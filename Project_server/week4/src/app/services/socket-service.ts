import { Injectable } from '@angular/core';
import { FormGroupName } from '@angular/forms';
import {io, Socket} from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService 
{
  private socket: Socket | null = null;
  private readonly URL = 'http://localhost:3000';
  //private readonly URL = '121.222.65.60:3000'

  constructor(){}

  connect(room?: string, user?: string)
  {
    if (!this.socket || !this.socket.connected)
    {
      this.socket = io(this.URL);
      this.socket.on('connect', ()=>{
        if (room && user)
        {
          this.joinRoom(room, user);
        }
      });
    }
  }

  disconnect()
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(room: string, user: string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('joinRoom', room, user);
    }
    
  }

  sendMessage(message: string, username: string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('sendMessage', message, username);  
    }
    
  }

  receiveMessage(callback: (message: any, user: any) => void)
  {
    console.log("trying to do something");
      if (this.socket)
      {
         this.socket.on('receiveMessage', callback);
      }
  }


  newGroup(groupName: string, username: string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('newGroup', groupName, username);  
    }
  }

  updateGroups(callback: (groupName: string) => void)
  {
      if (this.socket)
      {
         this.socket.on('updateGroups', callback);
      }
  }
}
