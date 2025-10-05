import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {SocketService} from '../../services/socket-service'
import { Router } from '@angular/router';
import {Api} from '../../services/api'

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
  messages :chatMessage[] = [];
  groups: string[] = [];
  channels: string[][] = [];
  userRole : string = "";
  channelName : string = "";
  showAdminPanel :boolean = true;
  errorMsg: string = '';


  ///
  groupName = "";
  ///

  

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
    this.socketService.receiveMessage((message: string, username: string)=>
    {
      this.messages.push(new chatMessage(username, message));
      console.log('message recieved: ', message);
    });

    this.socketService.updateGroups((groupName: string, ) => {
      this.groups.push(groupName);
    })

    // need one for updateChannels
      // remove Groups
      // remove Channel

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

            // each user has their own join room
            await this.socketService.connect(this.currentUser, response.username)
            this.channelName = "Not Connected";
            const useCase = response.role == "SuperAdmin" ? "SuperAdmin" : "2";
            this.api.getGroups(1, 10, this.currentUser, useCase).subscribe({
              next: (response) =>
              {
                if (response.success)
                {
                  this.groups = response.groups;
                  this.channels = response.channelNames;
                  // room 0 is superAdmins so recieve all updates regardless of membership
                  if (useCase == "SuperAdmin")
                  {
                    this.socketService.joinRoom("0", this.currentUser);
                  }
                  // joining to rooms they are apart of
                  else
                  {
                    for (let i = 0; i < this.groups.length; i++)
                    {
                      this.socketService.joinRoom(response.ids[i], this.currentUser)
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
    this.socketService.disconnect();    
  }

  sendMessage()
  {
    const userMessage = this.message;
       if (!userMessage)
       {
         return;
       }
    this.messages.push(new chatMessage(this.currentUser,this.message));
    this.socketService.sendMessage(userMessage, this.currentUser, this.channelName);
    this.message ='';
  }
  onChannelClick(channelName: string)
  {
    // I need some way for the joinRoom service to retrieve message history
      // socketservice.leaveRoom
    if (this.channelName != "Not Connected")
    {
      this.socketService.leaveRoom(this.channelName);
    }
    //this.socketService.leaveRoom(this.channelName);
    this.socketService.joinRoom(channelName, this.currentUser);
    this.channelName = channelName;
    this.messages = [];
    console.log(channelName);
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
