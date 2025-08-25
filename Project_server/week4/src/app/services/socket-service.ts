import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService 
{
  private socket: Socket | null = null;
  private readonly URL = 'http://localhost:3000';
  constructor(){}

  connect(room?: string)
  {
    if (!this.socket || !this.socket.connected)
    {
      this.socket = io(this.URL);
      this.socket.on('connect', ()=>{
        if (room)
        {
          this.joinRoom(room);
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

  joinRoom(room: string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('joinRoom', room);
    }
    
  }

  sendMessage(message: string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('sendMessage', message);  
    }
    
  }

  receiveMessage(callback: (data: any) => void)
  {
      if (this.socket)
      {
         this.socket.on('receiveMessage', callback);
      }
  }
}
