import { Component, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import {Api} from '../../services/api'


@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard 
{
  formattedGroupData: {groupName: string, groupCreator: string, groupID: string}[]=[];
  formattedGroupNames: string[] = [];


  groups: string[] = [];
  groupIds: string[] = [];
  creators: string[] = [];

  currentUser: string = '';
  pageNumber: number = 1;
  message: string = '';
  totalPages: number = 0;
  constructor(private router : Router, private api : Api){}
  ngOnInit(): void
  {
    const rawToken = localStorage.getItem('currentUser');
    if (rawToken)
    {
      this.api.verifyToken(rawToken.replace(/^"|"$/g, '')).subscribe({
      next:(response) =>
      {
        if (response.valid)
        {
          this.currentUser = response.username;
          this.refreshGroups();
        }
        else
        {
          localStorage.clear();
          this.router.navigate(['/home']);
        }
      }
    })
    }
    else
    {
      this.router.navigate(['/home']);
    }

  }

  enrol(groupName : string)
  {
    this.api.joinGroupWaitlist(this.currentUser, groupName).subscribe({
      next: (response) =>
      {
        this.message = response.message;
        return;
      },
      error:(err)=>
      {
        this.message = err.error.message;
        return;
      }
    })
  }

  refreshGroups()
  {
    this.api.getGroupsToEnrol(this.pageNumber, 5, this.currentUser).subscribe({
    next:(response) =>
    {
      if (response.success)
      {
        this.groupIds = response.ids;
        this.groups = response.groups;
        this.creators = response.creators;
        this.totalPages = response.pageLimit;

        this.formattedGroupData = this.groups.map((group, index) =>({
        groupName: group,
        groupCreator: this.creators[index],
        groupID: this.groupIds[index],
      }))
      this.formattedGroupNames = this.formattedGroupData.map(group => group.groupName);
      }

      else
      {
        this.message = "failed to get groups for user...";
        return;
      }
    },
    error: (err) =>
    {
      this.message = "server error getting groups...";
      return;
    }
  })
  }

  pageUpdate(num : number)
  {
    let desired = this.pageNumber;
    if (num == 0) // previous
    {
      desired --;
      if (desired < 1)
      {
        return;
      }
    }
    else if (num == 1) // next
    {
      desired ++;
      if (desired > this.totalPages)
      {
        return;
      }
    }
    this.pageNumber = desired;
    this.refreshGroups();
  }
}
