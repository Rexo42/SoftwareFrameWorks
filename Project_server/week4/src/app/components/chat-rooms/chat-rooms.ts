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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  message : string = "";
  messages :chatMessage[] = [];

  

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
  
    const userRaw = localStorage.getItem('currentUser');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;


    if (currentUser?.username) 
    {
      this.socketService.connect('1', currentUser.username);
    }
    else
    {
      this.router.navigate(['/home'])
    }
    this.socketService.receiveMessage((message: string, username: string)=>
    {
      this.messages.push(new chatMessage(username, message));
      console.log('message recieved: ', message);
    });
 
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
    const userRaw = localStorage.getItem('currentUser');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;
    this.messages.push(new chatMessage(currentUser.username,this.message));
    this.socketService.sendMessage(userMessage, currentUser.username);
    this.message ='';
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
