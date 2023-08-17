import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToasterService } from '../ToasterService/toaster.service';
// const admin = require('firebase-admin');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public toastrService: ToasterService
  ) {

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(this.userData));
        // localStorage.setItem('UserId', JSON.stringify(this.userData.uid));
        // JSON.parse(localStorage.getItem('UserEmail')!);
        // JSON.parse(localStorage.getItem('UserId')!);
      } else {
        localStorage.setItem('user', 'null');
        // JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(formValue: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(formValue.Email, formValue.Password)
        .then((result) => {
          // this.SetUserData(result.user, formValue);
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              localStorage.removeItem('user');
              localStorage.setItem('user', JSON.stringify(user));
            }
            resolve(user)
            this.toastrService.logedInSuccessfully();
          });
        })
        .catch((error) => {
          window.alert(error.message);
        })
    })
  }

  // Sign up with email/password
  SignUp(form: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(form.Email, form.Password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        // this.SendVerificationMail();
        this.SetUserData(result.user, form);
        this.toastrService.customSuccess("User Created Successfully.");
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, form: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      UserName: form.UserName,
      updatedBy: new Date(),
      ImageUrl: form.ImageUrl,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.toastrService.message('User Logout Successfully.');
        this.userData = null;
        resolve('');
      });
    })
  }
}
