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
  userRole : string = "";
  channelName : string = "";

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

    const rawToken = localStorage.getItem('currentUser');
    if (rawToken)
    {
      
      const cleanToken = rawToken.replace(/^"|"$/g, '');
      this.api.verifyToken(cleanToken).subscribe({
        next: (response) => {
          if (response.valid)
          {
            this.currentUser = response.username;
            console.log(response.username);
            if (this.currentUser == "super")
            {
              this.userRole = "SuperAdmin";
            }
            this.socketService.connect('0', response.username)
            this.channelName = "Public Room";
          }
          else
          {
            console.log("invalid token");
            localStorage.clear();
            this.router.navigate(['/home'])
          }
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
    this.scroll();
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
    //const userRaw = localStorage.getItem('currentUser');
    //const currentUser = userRaw ? JSON.parse(userRaw) : null;
    this.messages.push(new chatMessage(this.currentUser,this.message));
    this.socketService.sendMessage(userMessage, this.currentUser);
    this.message ='';
  }

  createGroup()
  {
    const groupName = this.groupName;
    if (!groupName || !this.currentUser)
    {
      return;
    }
    this.socketService.newGroup(groupName, this.currentUser);
    this.groupName = '';
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
