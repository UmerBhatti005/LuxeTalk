import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './Services/Auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserPresence } from './appModel/chat-model';
import { ItemsService } from './Services/Items/items.service';
import { Subject, takeUntil } from 'rxjs';
import { IdleService } from './Services/HelperService/idle.service';
import { TypingService } from './Services/HelperService/typing.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userActivity;
  userInactive: Subject<any> = new Subject();
  userActive: Subject<any> = new Subject();

  constructor(private authService: AuthService,
    public afAuth: AngularFireAuth,
    private itemService: ItemsService,
    private idleService: IdleService) {
    this.userInactive.subscribe(() => console.log('user has been inactive for 5s'));
  }

  ngOnInit(): void {

    // this.idleService.activityStream.subscribe(() => {
    //   console.log('User is inactive');
    //   // Perform any actions when user becomes inactive
    // });
  }

  // setTimeout() {
  //   this.userActivity = setTimeout(() => this.userInactive.next(undefined), 5000);
  // }

  // @HostListener('window:mousemove') refreshUserState() {
  //   clearTimeout(this.userActivity);
  //   this.setTimeout();
  // }

  isLoggedIn(): boolean {
    return !(this.authService.userData == null || this.authService.userData == undefined);
  }

  async logout() {
    debugger
    let obj: UserPresence = {
      Status: 'Offline',
      UserId: JSON.parse(localStorage.getItem('user')).uid,
      updatedBy: new Date()
    }
    await this.itemService.setUserPresence(obj);
    await this.authService.SignOut();
    this.isLoggedIn();
  }


  ngOnDestroy() {
    debugger
    this.destroy$.next();
    this.destroy$.complete();
  }
}


