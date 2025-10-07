import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-approve-member',
  standalone: false,
  templateUrl: './approve-member.html',
  styleUrl: './approve-member.css'
})
export class ApproveMember 
{
  @Output() userApproved = new EventEmitter<void>();
  @Output() handleMessage = new EventEmitter<string>();

  @Input() groupList: {groupName: string, groupCreator: string, groupID: string, groupWaitList: string[], channelNames: string[]}[]=[];
  // @Input() username: string = '';
  //selectedGroupName: string = '';
  selectedGroup: 
  {
    groupName: string;
    groupCreator: string;
    groupID: string;
    groupWaitList: string[];
    channelNames: string[];
  } | null = null;
  selectedWaitlist: string[] = [];
  selectedWaitlistUser: string ='';
  message : string = '';
  constructor(private router: Router, private Api : Api) {}

  groupChange()
  {
    // logic for selecting a group from dropdown and setting it
    console.log(this.selectedGroup?.groupName);
    this.selectedWaitlist = this.selectedGroup?.groupWaitList || [];
  }

  approveUser() 
  {
    // submit logic to approve the chosen user into the chosen group
    if (!this.selectedGroup)
    {
      return;
    }
    this.Api.addUserToGroup(this.selectedWaitlistUser, this.selectedGroup?.groupID).subscribe({
      next:(response) =>
      {
        if (response.success)
        {

          this.userApproved.emit();
          const index = this.selectedWaitlist.indexOf(this.selectedWaitlistUser);
          this.selectedWaitlist.splice(index, 1);
          this.selectedWaitlistUser = '';
        }
        this.message = response.message;
      },
      error: (err) =>
      {
        this.message = err.error.message;
      }
    })
    this.handleMessage.emit(this.message);
  }
}
