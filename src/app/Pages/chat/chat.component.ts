import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';

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


  constructor(public afs: AngularFirestore, // Inject Firestore service,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private itemService: ItemsService,
    private toastrService: ToasterService) {

  }

  ngOnInit(): void {
    this.itemService.firebaseTable = 'chatMsg';
    this.GetAllUser();
    // this.GetMsgs('');
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.loggedInUserId = user._delegate.uid;
      }
    });
  }

  GetAllUser() {
    this.itemService.firebaseTable = 'users';
    this.itemService.GetItems().subscribe(
      (res: any) => {
        debugger
        this.usersData = res.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          }
        });
        // this.usersData.filter(x => x.uid ==this)
      }
    )
  }

  GetMsgs(openChatPerson: string) {
    this.chats = [];
    this.itemService.firebaseTable = 'chatMsg';
    let obj = {
      loggedInUser: this.loggedInUserId,
      openChatPerson: openChatPerson
    };
    this.itemService.GetchatofTwoPeople(obj).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Access the document data
        let chatModel = {
          id: doc.id,
          name: doc.data().name,
          UserId: doc.data().UserId,
          chatMsg: doc.data().chatMsg,
          updatedBy: new Date(doc.data().updatedBy * 1000),
        }
        this.chats.push(chatModel);
      });
    }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
    // .get().then((querySnapshot) => {
    //   querySnapshot.forEach((res) => {
    //     debugger
    //     console.log(res);

    //   })
    // })
    // .subscribe(
    //   (res: any) => {
    //     this.chats = res.map(e => {
    //       return {
    //         id: e.payload.doc.id,
    //         name : e.payload.doc.data().name,
    //         UserId : e.payload.doc.data().UserId,
    //         chatMsg : e.payload.doc.data().chatMsg,
    //         updatedBy : new Date(e.payload.doc.data().updatedBy * 1000),
    //       }
    //     });
    //   }
    // )
  }

  async sendMsg() {
    this.itemService.firebaseTable = 'chatMsg';
    var obj = {
      name: "Umer",
      chatMsg: this.chatMsg,
      updatedBy: new Date(),
      UserId: JSON.parse(localStorage.getItem('user')).uid
    }
    await this.itemService.CreateItem(obj);
    this.toastrService.customSuccess("Message Send Successfully.")
    this.chatMsg = '';
  }


}
