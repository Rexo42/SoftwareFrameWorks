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
            this.userRole = response.role.trim();
            console.log(this.userRole.trim());
            this.socketService.connect('0', response.username)
            this.channelName = "Public Room";
            // would need to get groups and display them
              // in the route to get groups, we can filter based on role == superAdmin or is a member
                // super admin see all groups 
                  // user sees only ones they are a member of
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
    this.messages.push(new chatMessage(this.currentUser,this.message));
    this.socketService.sendMessage(userMessage, this.currentUser);
    this.message ='';
  }

  createGroup()
  {
    const currentGroupName = this.groupName;
    if (!currentGroupName || !this.currentUser)
    {
      this.errorMsg = "Missing fields";
      return;
    }
    
    this.socketService.newGroup(currentGroupName, this.currentUser).then(response => {
    if (response.valid) 
    {
    this.errorMsg = response.message;
    } 
    else 
    {
    this.errorMsg = response.message;
    }
});

    //this.socketService.newGroup(currentGroupName, this.currentUser);

    this.groupName = '';
  }

  toggleAdminPanel()
  {
    if (this.showAdminPanel)
    {
      this.errorMsg = '';
    }
    this.showAdminPanel = !this.showAdminPanel;
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
