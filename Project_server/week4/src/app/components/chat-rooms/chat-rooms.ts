import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {SocketService} from '../../services/socket-service'
import { Router } from '@angular/router';
import {Api} from '../../services/api'
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat-rooms',
  standalone: false,
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.css'
})
export class ChatRooms implements OnInit, OnDestroy, AfterViewChecked
{
  currentUser : string = "";
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  message : string = "";
  messages :Message[] = [];
  profilPicture:string = '';
  groups: string[] = [];
  groupIds: string[] = [];
  channels: string[][] = [];
  userRole : string = "";
  channelName : string = "";
  groupName : string = "";
  showAdminPanel :boolean = true;
  errorMsg: string = '';

  

  scroll(): void
  {
    try{
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err){
      console.error('Scroll failed', err);
    }
  }


  constructor(private router : Router, private socketService : SocketService, private api : Api){}
  ngOnInit(): void 
  {
    this.socketService.receiveMessage((raw:any)=>
    {
      this.messages.push(new Message(raw.username, raw.message, raw.profilePicture));
      console.log('message recieved: ', raw);
    });

    this.socketService.updateGroups((groupName: string, groupID: string ) => {
      console.log(groupID, groupName);
      this.groups.push(groupName);
      this.groupIds.push(groupID);
      this.channels.push([]);
    })

    this.socketService.updateChannels((groupName:string, channelName:string ) =>{
      console.log(groupName, channelName);
      for (let i = 0; i < this.groups.length; i++)
      {
        if (this.groupIds[i] == groupName)
        {
          this.channels[i].push(channelName);
          console.log(this.channels[i]);
          console.log(this.groups[i]);
        }
      }
      
    })

      this.socketService.removeChannel((groupName:string, channelName:string ) =>{
      console.log(groupName, channelName);
      for (let i = 0; i < this.groups.length; i++)
      {
        if (this.groupIds[i] == groupName)
        {
          const index = this.channels[i].indexOf(channelName);
          if (index != -1)
          {
            this.channels[i].splice(index, 1);
            this.socketService.leaveRoom(channelName);
            if (this.channelName == channelName)
            {
              this.channelName = "Not Connected";
            }
            console.log('Removed channel:', channelName);
          }
        }
      }
      
    })
    this.socketService.removeGroup((groupName:string) =>
    {
        console.log(groupName);

        const index = this.groupIds.findIndex(id => id === groupName);
        for (let i = 0; i < this.channels[index].length; i++)
        {
          if (this.channels[index][i] == this.channelName)
          {
            this.socketService.leaveRoom(this.channelName);
            this.channelName = "Not Connected";
          }
        }
        this.groups.splice(index, 1);
        this.groupIds.splice(index,1);
        this.channels.splice(index,1);
        this.socketService.leaveRoom(groupName);
        
    })
    const rawToken = localStorage.getItem('currentUser');
    if (rawToken)
    {
      
      const cleanToken = rawToken.replace(/^"|"$/g, '');
      this.api.verifyToken(cleanToken).subscribe({
        next: (response) => {
          if (response.valid)
          {
            (async() =>{ 
            this.currentUser = response.username;
            console.log(response.username);
            this.userRole = response.role.trim();
            console.log(this.userRole.trim());

            this.profilPicture = response.profilePicture;

            // each user has their own join room
            await this.socketService.connect(this.currentUser, response.username, response.profilePicture)
            this.channelName = "Not Connected";
            const useCase = response.role == "SuperAdmin" ? "SuperAdmin" : "2";
            this.api.getGroups(1, 10, this.currentUser, useCase).subscribe({
              next: (response) =>
              {
                if (response.success)
                {
                  this.groups = response.groups;
                  this.channels = response.channelNames;
                  this.groupIds = response.ids;
                  // room 0 is superAdmins so recieve all updates regardless of membership
                  if (useCase == "SuperAdmin")
                  {
                    this.socketService.joinRoom("0", this.currentUser, 2);
                  }
                  // joining to rooms they are apart of
                  else
                  {
                    for (let i = 0; i < this.groups.length; i++)
                    {
                      this.socketService.joinRoom(response.ids[i], this.currentUser, 2)
                    }
                  }
                  console.log(this.channels);
                }
              }
            });
            })();
          }
          
          else
          {
            console.log("invalid token");
            localStorage.clear();
            this.router.navigate(['/home'])
          }
          
        },
        error: (err) => {
          console.log("something has gone really wrong");
          localStorage.clear();
          this.router.navigate(['/home']);
        }
      });
    }
    else
    {
      this.router.navigate(['/home'])
    }
 
  }

  ngAfterViewChecked():void
  {
    if (this.channelName != "Not Connected")
    {
      this.scroll();
    }
    
  }

  ngOnDestroy(): void 
  {
    this.socketService.leaveRoom(this.channelName);
    this.socketService.disconnect();    
  }

  sendMessage()
  {
    // logic for sending message, local update and socket event
    const userMessage = this.message;
       if (!userMessage)
       {
         return;
       }
    this.messages.push(new Message(this.currentUser, this.message, this.profilPicture));
    this.socketService.sendMessage(userMessage, this.currentUser, this.channelName, this.groupName, this.profilPicture);
    this.message ='';
  }

  onChannelClick(channelName: string, groupName:string)
  {
    // logic for joinining a channel

    if (this.channelName != "Not Connected")
    {
      this.socketService.leaveRoom(this.channelName);
    }
    this.groupName = groupName;
    this.socketService.joinRoom(channelName, this.currentUser, 1);
    this.channelName = channelName;
    this.api.getMessages(groupName, channelName).subscribe({
      next: (response) =>
      {
        if (response.valid)
        {
          this.messages = response.messages;
          console.log(this.messages);
          this.messages.push(new Message(this.currentUser, "has joined", "notification-Join"));
        }
      }
    })
    console.log(channelName);
  }
  
}