import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Home} from './components/home/home';
import {LoginPage} from './components/login-page/login-page';
import {Profile} from './components/profile/profile';
import {CreateAccount} from './components/create-account/create-account';
import {ChatRooms} from './components/chat-rooms/chat-rooms';
import {Dummy} from './components/dummy/dummy';

const routes: Routes = 
[
  {path: '', component: Home},
  {path: 'home', component: Home},
  {path: 'login', component: LoginPage},
  {path: 'profile', component: Profile},
  {path: 'create', component: CreateAccount},
  {path: 'chatRooms', component: ChatRooms},
  {path: 'dummy', component:Dummy}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
