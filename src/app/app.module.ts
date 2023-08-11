import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment'
import { AngularFireModule } from '@angular/fire/compat';
import { StudentsComponent } from './Pages/students/students.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './Pages/chat/chat.component';
import { SignInComponent } from './Pages/sign-in/sign-in.component';
import { SignUpComponent } from './Pages/sign-up/sign-up.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { UsersComponent } from './Pages/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { StorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    ChatComponent,
    SignInComponent,
    SignUpComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // AngularFireDatabaseModule,
    // AngularFirestoreModule,
    // provideFirebaseApp(() => initializeApp(environment)),
    // provideFirestore(() => getFirestore())
    AngularFireModule.initializeApp(environment),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    StorageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
