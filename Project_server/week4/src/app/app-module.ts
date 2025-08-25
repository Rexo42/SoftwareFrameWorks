import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { NavBar } from './components/nav-bar/nav-bar';
import { LoginPage } from './components/login-page/login-page';
import { Profile } from './components/profile/profile';
import { CreateAccount } from './components/create-account/create-account';
import { ChatRooms } from './components/chat-rooms/chat-rooms';

@NgModule({
  declarations: [
    App,
    Home,
    NavBar,
    LoginPage,
    Profile,
    CreateAccount,
    ChatRooms
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
