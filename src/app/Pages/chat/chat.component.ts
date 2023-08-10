import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { MessageService } from 'primeng/api';


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


  constructor(public afs: AngularFirestore, // Inject Firestore service,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private itemService: ItemsService,
    private toastrService: ToasterService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.itemService.firebaseTable = 'chatMsg';
    this.GetAllUser();
    // this.GetMsgs('');
    // this.afAuth.authState.subscribe((user: any) => {
    //   if (user) {
    //     this.loggedInUserId = user._delegate.uid;
    //   }
    // });
    this.loggedInUserId = JSON.parse(localStorage.getItem('user')).uid;
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
        let loggedInUserIndex = this.usersData.findIndex(x => x.uid == this.loggedInUserId);
        this.loggedInUser = this.usersData.splice(loggedInUserIndex, 1);
        this.loggedInImageUrl = this.loggedInUser.ImageUrl;
      }
    )
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
  GetMsgs(openChatPerson: string) {
    this.GetSpecificUser(openChatPerson);
    this.chats = [];
    this.showChatBoxBool = true;
    this.openChatPerson = openChatPerson;
    this.itemService.firebaseTable = 'chatMsg';
    this.GenericGetMessage();
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
        SendToUser: this.openChatPerson
      }
      this.itemService.CreateItem(obj);
      this.chatMsg = '';
    }
  }

  showMoreMessages(): void {
    this.messageLimit += 15; // Increase the message limit
    // this.messageSkip += 15;
    this.itemService.firebaseTable = 'chatMsg';
    this.GenericGetMessage();
    this.showReadMoreButton = this.messageLimit <= this.chats.length;
  }

  GenericGetMessage() {
    this.chatMessages$ = this.itemService.GetchatofTwoPeople({
      loggedInUser: this.loggedInUserId, // Replace with actual user IDs
      openChatPerson: this.openChatPerson,
    }, this.messageLimit, this.messageSkip);

    this.chatMessages$.subscribe((messages: any) => {
      console.log(messages); // Handle the retrieved data here
      // this.chats.push.apply(this.chats, messages)
      this.chats = messages;
      this.chats.map(x => x.updatedBy = new Date(x.updatedBy * 1000))
      this.showReadMoreButton = this.messageLimit <= this.chats.length;
    });
  }
}

