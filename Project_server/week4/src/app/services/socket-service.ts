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

  ////
  private messageCallback: ((message: any, user: any) => void) | null = null;
  private updateGroupsCallback: ((groupName: string) => void) | null = null;
////

  constructor(){}

  async connect(room: string, user: string): Promise<void>
  {
    return new Promise((resolve, reject) =>{

    
    if (!this.socket || !this.socket.connected)
    {
      this.socket = io(this.URL);
      this.socket.on('connect', ()=>{
        if (room && user)
        {
          this.joinRoom(room, user);
          this.socket?.emit('assignSocketToUser', user);
        }

        if (this.messageCallback) 
        {
          this.socket?.off('receiveMessage');
          this.socket?.on('receiveMessage', this.messageCallback);
        }

        if (this.updateGroupsCallback) 
        {
          this.socket?.off('updateGroups');
          this.socket?.on('updateGroups', this.updateGroupsCallback);
        }
        resolve();
      });
    }
    else
    {
      resolve();
    }
    });
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
  leaveRoom(room:string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('leaveRoom', room);
    }
  }

  sendMessage(message: string, username: string, channel:string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('sendMessage', message, username, channel);  
    }

  }

  receiveMessage(callback: (message: any, user: any) => void)
  {
    this.messageCallback = callback;
      if (this.socket && this.socket.connected)
      {
        console.log("trying to do something");
         this.socket.on('receiveMessage', callback);
      }
  }


newGroup(groupName: string, username: string): Promise<{ valid: boolean; message: string }> {
  return new Promise((resolve, reject) => {
    if (this.socket && this.socket.connected) {
      this.socket.emit('newGroup', groupName, username, (response: { valid: boolean; message: string }) => {
        resolve(response);
      });
    } else {
      reject({ valid: false, message: 'Socket not connected' });
    }
  });
}

  updateGroups(callback: (groupName: string) => void)
  {
    this.updateGroupsCallback = callback;
      if (this.socket && this.socket.connected)
      {
         this.socket.on('updateGroups', callback);
      }
  }
}
