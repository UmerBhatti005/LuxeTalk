import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './Pages/students/students.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { SignInComponent } from './Pages/sign-in/sign-in.component';
import { UsersComponent } from './Pages/users/users.component';

const routes: Routes = [
  { path: '', component: StudentsComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
