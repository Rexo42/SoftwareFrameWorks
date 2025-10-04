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
  selectedGroupName: string = '';
  selectedWaitlist: string[] = [];
  selectedWaitlistUser: string ='';
  message : string = '';
  constructor(private router: Router, private Api : Api) {}

  groupChange(groupName: string)
  {
    const selected = this.groupList.find(g=> g.groupName === groupName);
    this.selectedWaitlist = selected?.groupWaitList || [];
  }

  approveUser() 
  {
    this.Api.addUserToGroup(this.selectedWaitlistUser, this.selectedGroupName).subscribe({
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
    // call api route to approve the user via selected groupName and selected waitlist user
  }
}
