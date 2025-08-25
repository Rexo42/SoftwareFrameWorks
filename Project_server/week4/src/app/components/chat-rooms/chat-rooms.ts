import { Component, OnInit, OnDestroy } from '@angular/core';
import {SocketService} from '../../services/socket-service'
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat-rooms',
  standalone: false,
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.css'
})
export class ChatRooms implements OnInit, OnDestroy
{
  message : string = "";
  messages :chatMessage[] = [];
  constructor(private router : Router, private socketService : SocketService){}
  ngOnInit(): void 
  {
    const userRaw = localStorage.getItem('currentUser');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;


    if (currentUser?.username) 
    {
      this.socketService.connect('1', currentUser.username);
    }
    this.socketService.receiveMessage((message: string, username: string)=>
    {
      // update that array
      this.messages.push(new chatMessage(username, message));
      console.log('message recieved: ', message);
    });
    // inject socket service


            // we need to open a socket here or we do it when the user presses log in (saves resources and wont just waste them when doing other stuff)
    // we need to send a get request to the server to retrieve all current chatrooms    
      // create get to send back room info to here
        // we can use that retrieved room info to setup UI  
  }

  ngOnDestroy(): void 
  {
    this.socketService.disconnect();    
  }

  sendMessage()
  {
    const userMessage = this.message;
       if (!userMessage)
       {
         return;
       }
    // update ui
    const userRaw = localStorage.getItem('currentUser');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;
    this.messages.push(new chatMessage(currentUser.username,this.message));
    this.socketService.sendMessage(userMessage, currentUser.username);
    this.message ='';
  }

}
class chatMessage
{
  constructor(public sender : string, public message: string, public timeStamp: Date = new Date()){}
    getFormattedTime(): string 
  {
    return this.timeStamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
