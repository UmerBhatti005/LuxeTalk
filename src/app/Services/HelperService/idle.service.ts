import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil, timer } from 'rxjs';
import { UserPresence } from 'src/app/appModel/chat-model';
import { ItemsService } from '../Items/items.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private inactivityTimeout: number = 600000; // 10 minutes of inactivity
  private lastActivityTime: number = Date.now();
  private activity$: Subject<void> = new Subject<void>();

  constructor(
    private itemService: ItemsService
  ) {
    this.setupEventListeners();
    this.setupInactivityTimer();
  }

  private setupEventListeners() {
    window.addEventListener('mousemove', this.handleActivity);
    window.addEventListener('keydown', this.handleActivity);
  }

  private setupInactivityTimer() {
    setInterval(() => {
      if (this.isInactive()) {
        let obj: UserPresence = {
          Status: 'Offline',
          UserId: JSON.parse(localStorage.getItem('user')).uid,
          updatedBy: new Date()
        }
        this.itemService.setUserPresence(obj);
        this.activity$.next();
      }
      else{
        let obj: UserPresence = {
          Status: 'Online',
          UserId: JSON.parse(localStorage.getItem('user')).uid,
          updatedBy: new Date()
        }
        this.itemService.setUserPresence(obj);
      }
    }, this.inactivityTimeout);
  }

  private handleActivity = () => {
    this.lastActivityTime = Date.now();
  }

  private isInactive(): boolean {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastActivityTime;
    return elapsedTime >= this.inactivityTimeout;
  }

  get activityStream(): Observable<void> {
    return this.activity$.asObservable();
  }
}
