import { Injectable } from '@angular/core';
import { FormGroupName } from '@angular/forms';
import { IntegerType } from 'mongodb';
import {io, Socket} from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService 
{
  private socket: Socket | null = null;
  private readonly URL = 'http://localhost:3000';


////
  private messageCallback: ((message: any, user: any, profilePicture:any) => void) | null = null;
  private updateGroupsCallback: ((groupName: string, groupID:string) => void) | null = null;
  private updateChannelsCallback: ((groupName: string, channelName:string) => void) | null = null;
  private removeChannelCallback: ((groupName: string, channelName:string) => void) | null = null;
  private removeGroupCallback: ((groupName: string) => void) | null = null;
////

  constructor(){}

  async connect(room: string, user: string, profilePicture:string): Promise<void>
  {
    return new Promise((resolve, reject) =>{

    
    if (!this.socket || !this.socket.connected)
    {
      this.socket = io(this.URL);
      this.socket.on('connect', ()=>{
        if (room && user)
        {
          this.joinRoom(room, user, 2);
          this.socket?.emit('assignSocketToUser', user, profilePicture);
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
        if (this.updateChannelsCallback)
        {
          this.socket?.off('updateChannels');
          this.socket?.on('updateChannels', this.updateChannelsCallback);
        }
        if (this.removeChannelCallback)
        {
          this.socket?.off('removeChannel');
          this.socket?.on('removeChannel', this.removeChannelCallback);
        }
        if (this.removeGroupCallback)
        {
          this.socket?.off('removeGroup');
          this.socket?.on('removeGroup', this.removeGroupCallback);
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

  joinRoom(room: string, user: string, useCase : Number)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('joinRoom', room, user, useCase);
    }
  }
  leaveRoom(room:string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('leaveRoom', room);
    }
  }

  sendMessage(message: string, username: string, channel:string, group:string, profilePicture:string)
  {
    if (this.socket && this.socket.connected)
    {
      this.socket.emit('sendMessage', message, username, channel, group, profilePicture);  
    }

  }

  receiveMessage(callback: (message: any, user: any, profilePicture:any) => void)
  {
    this.messageCallback = callback;
      if (this.socket && this.socket.connected)
      {
         this.socket.on('receiveMessage', callback);
      }
  }

  updateGroups(callback: (groupName: string, groupID: string) => void)
  {
    this.updateGroupsCallback = callback;
      if (this.socket && this.socket.connected)
      {
         this.socket.on('updateGroups', callback);
      }
  }
  updateChannels(callback: (groupName: string, channelName:string) => void)
  {
    this.updateChannelsCallback = callback;
    if (this.socket && this.socket.connected)
    {
      this.socket.on('updateChannels', callback);
    }
  }
  removeChannel(callback: (groupName: string, channelName:string) => void)
  {
    this.removeChannelCallback = callback;
    if (this.socket && this.socket.connected)
    {
      this.socket.on('removeChannel', callback);
    }
  }
  removeGroup(callback: (groupName: string) => void)
  {
    this.removeGroupCallback = callback;
    if (this.socket && this.socket.connected)
    {
      this.socket.on('removeGroup', callback);
    }
  }
}
