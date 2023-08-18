import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ItemsService } from 'src/app/Services/Items/items.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatMsg: any;
  chats: any = [];
  loggedInUserId: any;
  scrollDistance: any = 2; // Adjust this value according to your needs
  public datePipe = new DatePipe('en-US');
  usersData: any;
  openChatPerson: string;
  showChatBoxBool: boolean = false;
  UserName: string;
  ImageUrl: string;
  loggedInImageUrl: string;
  loggedInUser: any;
  messages: any[] = []; // Replace with your actual messages data
  messageLimit: number = 15;
  showReadMoreButton: boolean = true;
  messageSkip: number = 0;
  msgRequired: boolean = false;
  allusers: any;
  unreadMsgs: any[] = [];
  specificUserStatus: string;
  // typingStatus: any;
  // openchatTypingStatus: any;

  constructor(public afs: AngularFirestore, // Inject Firestore service,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private itemService: ItemsService) {
  }

  async ngOnInit(): Promise<void> {

    this.itemService.firebaseTable = 'chatMsg';
    this.GetAllUser();
    this.GetUserPresence();
    this.GetUnreadMsgsCount();
    this.loggedInUserId = JSON.parse(localStorage.getItem('user'))?.uid;
  }

  GetAllUser() {
    this.itemService.firebaseTable = 'users';
    this.itemService.GetItems().subscribe(
      (res: any) => {
        this.usersData = res.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          }
        });
        this.allusers = this.usersData;
        let loggedInUserIndex = this.usersData.findIndex(x => x.uid == this.loggedInUserId);
        this.loggedInUser = this.usersData.splice(loggedInUserIndex, 1);
        this.loggedInImageUrl = this.loggedInUser[0].ImageUrl;

      }
    )
  }

  async GetUnreadMsgsCount() {
    this.unreadMsgs = [];
    let unreadMsgsObj = await this.itemService.GetUnReadMsgs();
    unreadMsgsObj.subscribe(res => {
      this.unreadMsgs = [];
      const idCountMap = new Map(); // Create a map to store ID counts

      res.forEach(item => {
        const id = item.UserId; // Assuming UserId contains the ID

        // Check if the ID already exists in the map
        if (idCountMap.has(id) && !item.msgRead) {
          idCountMap.set(id, idCountMap.get(id) + 1); // Increment count
        } else if (!item.msgRead) {
          idCountMap.set(id, 1); // Initialize count
        }
      });

      // Display the ID counts
      idCountMap.forEach((count, id) => {
        this.unreadMsgs.push({ Id: id, msgUnreadCount: count })
      });
    });
  }

  chatMessages$: Observable<any[]>; // Declare an Observable variable
  GetMsgs(openChatPerson: string) {
    this.GetSpecificUser(openChatPerson);
    this.chats = [];
    this.showChatBoxBool = true;
    this.openChatPerson = openChatPerson;
    this.itemService.firebaseTable = 'chatMsg';
    this.GenericGetMessage();
    let idxReadmsg = this.unreadMsgs.findIndex(x => x.Id == openChatPerson)
    idxReadmsg >= 0 ? this.unreadMsgs.splice(idxReadmsg, 1) : ''
  }

  GetSpecificUser(openChatPerson) {
    let specificUser = this.usersData.filter(x => x.uid == openChatPerson)[0]
    this.specificUserStatus = this.allusers.filter(x => x.uid == openChatPerson)[0].Status
    this.UserName = specificUser.UserName;
    this.ImageUrl = specificUser.ImageUrl;
  }

  sendMsg() {
    if (this.chatMsg === undefined || this.chatMsg === null || this.chatMsg === '') {
      this.msgRequired = true;
    }
    else {
      this.itemService.firebaseTable = 'chatMsg';
      var obj = {
        // name: "Umer",
        chatMsg: this.chatMsg,
        updatedBy: new Date(),
        UserId: this.loggedInUserId,
        SendToUser: this.openChatPerson,
        msgRead: false
      }
      this.itemService.CreateItem(obj);
      this.chatMsg = '';
    }
  }

  showMoreMessages() {
    this.itemService.firebaseTable = 'chatMsg';
    this.showReadMoreButton = this.messageLimit <= this.chats.length;
    this.messageLimit += 15; // Increase the message limit
    this.GenericGetMessage();
  }

  GetUserPresence() {
    this.itemService.GetAllUserPresence().subscribe((res: any) => {
      this.allusers = this.allusers.map(item1 => {
        const matchingItem = res.find(item2 => item2.UserId === item1.id);
        return matchingItem ? { ...item1, ...matchingItem } : { ...item1, ...{ Status: 'Offline' } };
      });
    })
  }

  // GetTypingStatus() {
  //   this.itemService.GetAllTypingStatus().subscribe((res: any) => {
  //     this.typingStatus = res;
  //     if(this.openChatPerson != null){
  //       this.openchatTypingStatus = res.filter(x => x.UserId == this.openChatPerson)[0]?.isTyping;
  //     }
  //   })
  // }

  GenericGetMessage() {
    this.chatMessages$ = this.itemService.GetchatofTwoPeople({
      loggedInUser: this.loggedInUserId, // Replace with actual user IDs
      openChatPerson: this.openChatPerson,
    }, this.messageLimit, this.messageSkip);

    this.chatMessages$.subscribe((messages: any) => {
      this.chats = messages.map(e => {
        return {
          id: e.payload.doc.id,
          chatMsg: e.payload.doc.data().chatMsg,
          updatedBy: new Date(e.payload.doc.data().updatedBy * 1000),
          UserId: e.payload.doc.data().UserId,
          SendToUser: e.payload.doc.data().SendToUser,
          msgRead: e.payload.doc.data().msgRead
        }
      });
      
      let obj = this.chats.filter(x => x.msgRead == false && x.UserId != this.loggedInUserId).map(x => x.id);
      this.itemService.updateColumnInMultipleDocuments(obj)
    });

  }

  filterUser(event: any) {
    this.allusers = this.usersData.filter(item => item.UserName.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  checkMsgUnreadFunc(id: any): string {
    for (let i = 0; i < this.unreadMsgs.length; i++) {
      if (this.unreadMsgs[i].Id == id) {
        return this.unreadMsgs[i].msgUnreadCount;
      }
    }
    return '';
  }

  showMsgUnreadFunc(id: any): boolean {
    for (let i = 0; i < this.unreadMsgs.length; i++) {
      if (this.unreadMsgs[i].Id == id) {
        return true
      }
    }
    return false;
  }
}