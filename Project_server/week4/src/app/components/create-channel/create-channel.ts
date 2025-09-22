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
  @Output() groupCreated = new EventEmitter<void>();
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

  createGroup()
  {
    if (this.groupName == '')
    {
      this.message = "Group name field cannot be left empty!";
      return;
    }
    const rawToken = localStorage.getItem('currentUser');
    if (!rawToken)
    {
      this.message = "get out of there";
      return;
    }
    this.Api.verifyToken(rawToken.replace(/^"|"$/g, '')).subscribe({
      next: (response) =>
      {
        if (response.valid)
        {
          this.Api.createGroup(this.groupName, response.username).subscribe({
            next: (response) =>
            {
              if (response.valid)
              {
                this.message = "successully created group";
              }
            },
            error: (err) =>
            {
              this.message = ("error making group: " + err);
            }
          })
        }
        else
        {
          this.message = "you shouldnt be doing this";
          return;
        }
      },
      error: (err) =>
      {
        this.message = "server error: ", err;
        return;
      }
    })

  }

  createChannel()
  {
    
  }
}
