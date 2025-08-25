import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../services/socket-service'
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat-rooms',
  standalone: false,
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.css'
})
export class ChatRooms implements OnInit 
{
  constructor(private router : Router, private socketService : SocketService){}
  ngOnInit(): void 
  {
    this.socketService.joinRoom((1).toString());
    // inject socket service


            // we need to open a socket here or we do it when the user presses log in (saves resources and wont just waste them when doing other stuff)
    // we need to send a get request to the server to retrieve all current chatrooms    
      // create get to send back room info to here
        // we can use that retrieved room info to setup UI  
  }
}
