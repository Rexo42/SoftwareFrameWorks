import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService 
{
  private socket: Socket;
  private readonly URL = 'http://localhost:3000';
  constructor()
  {
    this.socket = io(this.URL);
  }

  disconnect()
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.disconnect();
    }
  }

  joinRoom(room: string)
  {
    this.socket.emit('joinRoom', room);
  }

  sendMessage(message: string)
  {
    this.socket.emit('message', message);
  }

  receiveMessage(callback: (data: any) => void)
  {
    this.socket.on('message', callback);
  }
}
