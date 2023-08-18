import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loginSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  constructor() { }

  triggerLogin() {
    this.loginSubject.next();
  }

  onLogin(): Observable<void> {
    return this.loginSubject.asObservable();
  }
}
