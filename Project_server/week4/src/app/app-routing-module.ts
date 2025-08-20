import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Home} from './components/home/home';
import {LoginPage} from './components/login-page/login-page';
import {Profile} from './components/profile/profile';

const routes: Routes = 
[
  {path: '', component: Home},
  {path: 'home', component: Home},
  {path: 'login', component: LoginPage},
  {path: 'profile', component: Profile}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
