import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemsService } from 'src/app/Services/Items/items.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatMsg: any;
  chats: any;
  loggedInUserId: any;
  scrollDistance: any = 2; // Adjust this value according to your needs
  public datePipe = new DatePipe('en-US');


  constructor(public afs: AngularFirestore, // Inject Firestore service,
  public afAuth: AngularFireAuth, // Inject Firebase auth service
   private itemService: ItemsService) {

  }

  ngOnInit(): void {
    this.itemService.firebaseTable = 'chatMsg';
    this.GetMsgs();
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.loggedInUserId = user._delegate.uid;
      }
    });
  }

  GetMsgs() {
    this.itemService.GetItems().subscribe(
      (res: any) => {
        this.chats = res.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          }
        });
      }
    )
  }

  sendMsg() {
    var obj = {
      name: "Umer",
      chatMsg: this.chatMsg,
      updatedBy: new Date().toLocaleString(),
      UserId: JSON.parse(localStorage.getItem('user')).uid
    }
    this.itemService.CreateItem(obj);
    this.chatMsg = '';
  }

  onScroll() {debugger
    console.log('scrolled!!');
  }
}
