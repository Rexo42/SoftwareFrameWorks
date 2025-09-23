import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Home} from './components/home/home';
import {LoginPage} from './components/login-page/login-page';
import {Profile} from './components/profile/profile';
import {CreateAccount} from './components/create-account/create-account';
import {ChatRooms} from './components/chat-rooms/chat-rooms';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserDashboard } from './components/user-dashboard/user-dashboard';

const routes: Routes = 
[
  {path: '', component: Home},
  {path: 'home', component: Home},
  {path: 'login', component: LoginPage},
  {path: 'profile', component: Profile},
  {path: 'create', component: CreateAccount},
  {path: 'chatRooms', component: ChatRooms},
  {path: 'adminDashboard', component: AdminDashboard},
  {path: 'userDashboard', component: UserDashboard},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
