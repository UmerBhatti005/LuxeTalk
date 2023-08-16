import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/Auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
    public afAuth: AngularFireAuth) { }
  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return !(this.authService.userData == null || this.authService.userData == undefined);
  }

  logout(){
    this.authService.SignOut();
    this.isLoggedIn();
  }
}


