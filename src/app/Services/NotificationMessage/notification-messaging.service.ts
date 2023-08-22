import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationMessagingService {

  title = 'af-notification';
  message: any = null;
  serverKey: string = 'AAAANT-iVfA:APA91bG4uRkVz-GCQPp-X04YrqyN-CLd4CPUJvZcqD2TaOhdujOWml3insyMuZEYia0aSO2SYVu_LuzLdiBJtJAlanrJKdsOJHNX-6MkmS_NUlavmZCdbT3HPXg0s5UpgQzZxjDMN9sQ';
  apiUrl = 'https://fcm.googleapis.com/fcm/send';

  constructor(private httpClient: HttpClient) { }

  requestPermission(): Promise<string> {
    const messaging = getMessaging();
    return new Promise((resolve, reject) => {
      getToken(messaging,
        { vapidKey: environment.vapidKey }).then(
          (currentToken) => {
            if (currentToken) {
              resolve(currentToken)
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });
    })
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
    });
  }

  sendNotification(fcToken: string, UserName: any): Observable<any> {
    debugger
    const headers = new HttpHeaders({
      Authorization: `key=${this.serverKey}`,
      'Content-Type': 'application/json',
    });

    const payload = {
      notification: {
        title: 'New Message',
        body: `You have a new message from ${UserName}`,
        icon: '\\assets\\Images\\Logos\\LogoSample_ByTailorBrands.jpg'
      },
      to: fcToken,
      data: {
        url: 'https://localhost:4200/chat'
      }
    };

    return this.httpClient.post(this.apiUrl, payload, { headers });
  }


}
