import { Injectable } from '@angular/core';
import { ItemsService } from '../Items/items.service';
import { Observable, Subject } from 'rxjs';
import { TypingStatus } from 'src/app/appModel/chat-model';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private inactivityTimeout: number = 30000; // 20 minutes of inactivity
  private lastActivityTime: number = Date.now();
  private activity$: Subject<void> = new Subject<void>();

  constructor(
    private itemService: ItemsService
  ) {
    this.setupEventListeners();
    this.setupInactivityTimer();
  }

  private setupEventListeners() {
    window.addEventListener('keypress', this.handleActivity);
  }

  private setupInactivityTimer() {
    setInterval(() => {
      if (this.isInactive()) {
        let obj: TypingStatus = {
          isTyping: false,
          UserId: JSON.parse(localStorage.getItem('user')).uid,
          updatedBy: new Date()
        }
        this.itemService.setTypingStatus(obj);
        this.activity$.next();
      }
      else {
        let obj: TypingStatus = {
          isTyping: true,
          UserId: JSON.parse(localStorage.getItem('user')).uid,
          updatedBy: new Date()
        }
        this.itemService.setTypingStatus(obj);
      }
    }, this.inactivityTimeout);
  }

  private handleActivity = () => {debugger
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
