import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, zip } from 'rxjs';
import { AuthService } from 'src/app/Services/Auth/auth.service';
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
  onlineStatus: boolean;

  constructor(public afs: AngularFirestore, // Inject Firestore service,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private itemService: ItemsService) {
      this.onlineStatus = navigator.onLine;
  }

  async ngOnInit(): Promise<void> {

    this.itemService.firebaseTable = 'chatMsg';
    this.GetAllUser();
    this.GetUnreadMsgsCount();
    this.loggedInUserId = JSON.parse(localStorage.getItem('user')).uid;
    this.itemService.setUserPresence({UserId: this.loggedInUserId, updatedBy: new Date(), status: 'online', });
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

  async GetUnreadMsgsCount(){
    this.unreadMsgs = [];
    let unreadMsgsObj = await this.itemService.GetUnReadMsgs();
    unreadMsgsObj.subscribe(res => {
      this.unreadMsgs = [];
      // res.map(res => {
      //   // if(!res.readMsg){
      //   //   res.
      //   // }
      // })
      // this.unreadMsgs = x
      const idCountMap = new Map(); // Create a map to store ID counts

      res.forEach(item => {
        const id = item.UserId; // Assuming UserId contains the ID

        // Check if the ID already exists in the map
        if (idCountMap.has(id) && !item.msgRead) {
          idCountMap.set(id, idCountMap.get(id) + 1); // Increment count
        } else if(!item.msgRead) {
          idCountMap.set(id, 1); // Initialize count
        }
      });

      // Display the ID counts
      idCountMap.forEach((count, id) => {
        this.unreadMsgs.push({ Id: id, msgUnreadCount: count })
      });
    });
  }
  // GetMsgs(openChatPerson: string) {
  //   this.chats = [];
  //   this.itemService.firebaseTable = 'chatMsg';
  //   let obj = {
  //     loggedInUser: this.loggedInUserId,
  //     openChatPerson: openChatPerson
  //   };
  //   this.itemService.GetchatofTwoPeople(obj).then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       // Access the document data
  //       let chatModel = {
  //         id: doc.id,
  //         name: doc.data().name,
  //         UserId: doc.data().UserId,
  //         chatMsg: doc.data().chatMsg,
  //         updatedBy: new Date(doc.data().updatedBy * 1000),
  //       }
  //       this.chats.push(chatModel);
  //       console.log(this.chats);

  //     });
  //   }).catch((error) => {
  //     console.error("Error getting documents: ", error);
  //   });
  //   // .get().then((querySnapshot) => {
  //   //   querySnapshot.forEach((res) => {
  //   //     console.log(res);

  //   //   })
  //   // })
  //   // .subscribe(
  //   //   (res: any) => {
  //   //     this.chats = res.map(e => {
  //   //       return {
  //   //         id: e.payload.doc.id,
  //   //         name : e.payload.doc.data().name,
  //   //         UserId : e.payload.doc.data().UserId,
  //   //         chatMsg : e.payload.doc.data().chatMsg,
  //   //         updatedBy : new Date(e.payload.doc.data().updatedBy * 1000),
  //   //       }
  //   //     });
  //   //   }
  //   // )
  // }
  chatMessages$: Observable<any[]>; // Declare an Observable variable
  GetMsgs(openChatPerson: string) {debugger
    this.GetSpecificUser(openChatPerson);
    this.chats = [];
    this.showChatBoxBool = true;
    this.openChatPerson = openChatPerson;
    this.itemService.firebaseTable = 'chatMsg';
    this.GenericGetMessage();
    let idxReadmsg = this.unreadMsgs.findIndex(x => x.Id == openChatPerson)
    idxReadmsg >= 0 ? this.unreadMsgs.splice(idxReadmsg, 1) : ''
    // this.unreadMsgs
    // let obj :{msgRead: false};
    // this.itemService.UpdateMsgsRead(obj);
    // this.chatMsg.filter(x =>)
    // this.chatMessages$ = this.itemService.GetchatofTwoPeople({
    //   loggedInUser: this.loggedInUserId, // Replace with actual user IDs
    //   openChatPerson: openChatPerson,
    // }, this.messageLimit, 0);

    // this.chatMessages$.subscribe((messages: any) => {
    //   console.log(messages); // Handle the retrieved data here
    //   // let chatModel = {
    //   //           // id: messages.id,
    //   //           name: messages.name,
    //   //           UserId: messages.UserId,
    //   //           chatMsg: messages.chatMsg,
    //   //           updatedBy: new Date(messages.updatedBy * 1000),
    //   //         }
    //   this.chats = messages;
    //   this.chats.map(x => x.updatedBy = new Date(x.updatedBy * 1000))
    // });
  }

  GetSpecificUser(openChatPerson) {
    let specificUser = this.usersData.filter(x => x.uid == openChatPerson)[0]
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

  showMoreMessages() {debugger
    // this.messageSkip += 15;
    this.itemService.firebaseTable = 'chatMsg';
    this.GenericGetMessage();
    this.showReadMoreButton = this.messageLimit <= this.chats.length;
    this.messageLimit += 15; // Increase the message limit
  }

  GenericGetMessage() {
    this.chatMessages$ = this.itemService.GetchatofTwoPeople({
      loggedInUser: this.loggedInUserId, // Replace with actual user IDs
      openChatPerson: this.openChatPerson,
    }, this.messageLimit, this.messageSkip);

    this.chatMessages$.subscribe((messages: any) => {
      console.log(messages); // Handle the retrieved data here
      // this.chats.push.apply(this.chats, messages)
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
      // let obj = this.chats.filter(x => x.msgRead == false)
      // let obj = this.chats.filter(x => x.msgRead == false).map(x => x.id);
      let obj = this.chats.filter(x => x.msgRead == false && x.UserId != this.loggedInUserId).map(x => x.id);

      this.itemService.updateColumnInMultipleDocuments(obj)

      // return '';

      // this.chats = messages;
      // this.chats.map(x => x.updatedBy = new Date(x.updatedBy * 1000))
      // this.showReadMoreButton = this.messageLimit <= this.chats.length;
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