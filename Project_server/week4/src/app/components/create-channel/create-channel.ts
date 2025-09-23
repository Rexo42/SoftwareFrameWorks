import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-create-channel',
  standalone: false,
  templateUrl: './create-channel.html',
  styleUrl: './create-channel.css'
})
export class CreateChannel 
{
  @Output() channelCreated = new EventEmitter<void>();
  @Input() groupList: string[] = [];
  groupName: string = '';
  creator: string = '';
  message: string = '';

  selectedGroup: string = '';
  //groupList: string[] = [];
  channelName: string = '';
  constructor(private router: Router, private Api : Api) {}
  ngOnInit():void
  {
    
  }
  createChannel()
  {
    if (!this.selectedGroup || !this.channelName.trim())
    {
      this.message = "please select a group and enter a name for the channel";
      return;
    }
    const rawToken = localStorage.getItem('currentUser');
    if (!rawToken)
    {
      return;
    }
    this.Api.verifyToken(rawToken.replace(/^"|"$/g, '')).subscribe({
      next: (respone) =>
      {
        if (respone.valid)
        {
          this.Api.createChannel(respone.username, this.selectedGroup, this.channelName).subscribe({
            next: (res) =>
            {
              if (res.valid)
              {
                this.message = ("successfully created channel in group: "+this.selectedGroup);
                this.channelCreated.emit();
              }
            }
          })
        }
      }
    })
  }
}
