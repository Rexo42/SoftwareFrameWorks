import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  standalone: false,
  templateUrl: './create-group.html',
  styleUrl: './create-group.css'
})
export class CreateGroup 
{
  @Output() groupCreated = new EventEmitter<void>();
  groupName: string = '';
  message: string = '';
  constructor(private router: Router, private Api : Api) {}



  createGroup()
  {
    if (this.groupName == '')
    {
      return;
    }
    const rawToken = localStorage.getItem('currentUser');
    if (!rawToken)
    {
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
                this.message = "successfully made new group!";
                this.groupCreated.emit();
              }
              else
              {
                this.message = "failed to make new group!";
              }
            }
          })
        }
        else
        {
          return;
        }
      },
      error: (err) =>
      {
        console.error("error creating group: ", err);
        return;
      }
    })

  }
}
