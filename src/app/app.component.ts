import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './Services/Auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserPresence } from './appModel/chat-model';
import { ItemsService } from './Services/Items/items.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { IdleService } from './Services/HelperService/idle.service';
import { TypingService } from './Services/HelperService/typing.service';
import { JsonPipe } from '@angular/common';
import { SharedService } from './Services/Shared/shared.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userInactive: Subject<any> = new Subject();
  userActive: Subject<any> = new Subject();
  isLoginBool: boolean;
  userData: any;
  private subscription: Subscription;

  constructor(private authService: AuthService,
    public afAuth: AngularFireAuth,
    private itemService: ItemsService,
    private idleService: IdleService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.subscription = this.sharedService.onLogin().subscribe(() => {
      this.userData = JSON.parse(localStorage.getItem('user'));
      this.isLoggedIn();
    });

    this.itemService.GetUserPresence(this.userData.uid).subscribe((res: any) => {
      if(res != null){
      localStorage.setItem('AvailabilityStatusId', res[0].payload.doc.id);
      }
      else{
        localStorage.removeItem('AvailabilityStatusId');
      }
    });

    let obj: UserPresence = {
          Status: 'Online',
          UserId: JSON.parse(localStorage.getItem('user')).uid,
          updatedBy: new Date()
        }
        this.itemService.setUserPresence(obj);
    // this.idleService.activityStream.subscribe(() => {
    //   console.log('User is inactive');
    //   // Perform any actions when user becomes inactive
    // });
  }


  @HostListener('window:unload')
  async unloadUserState() {
    let obj: UserPresence = {
      Status: 'Offline',
      UserId: JSON.parse(localStorage.getItem('user')).uid,
      updatedBy: new Date()
    }
    // $event.returnValue = false;
    // $event.returnValue = 'Are you sure you want to leave?';
    await this.itemService.setUserPresence(obj);
  }

  // setTimeout() {
  //   this.userActivity = setTimeout(() => this.userInactive.next(undefined), 5000);
  // }

  isLoggedIn(): boolean {
    this.isLoginBool = !(this.userData == null || this.userData == undefined);
    return this.isLoginBool;
  }

  async logout() {
    let obj: UserPresence = {
      Status: 'Offline',
      UserId: JSON.parse(localStorage.getItem('user')).uid,
      updatedBy: new Date()
    }
    await this.itemService.setUserPresence(obj);
    await this.authService.SignOut();
    this.userData = null;
    this.isLoggedIn();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}


