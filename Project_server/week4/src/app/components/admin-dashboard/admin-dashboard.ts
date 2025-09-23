import { Component, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import {Api} from '../../services/api'
import { IntegerType } from 'mongodb';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit
{
  ///
  users: string[] = [];
  Ids: string[] = [];
  roles: string[] = [];
  ///
  groups: string[] = [];
  groupIds: string[] = [];
  creators: string[] = [];


  // page data
  formattedData: {username: string, role: string, ID: string}[]=[];
  formattedGroupData: {groupName: string, groupCreator: string, groupID: string}[]=[]
  formattedGroupNames: string[] = [];
  pageType: 'Users' | 'Groups' = 'Users';
  pageNumber : number = 1;
  totalPages : number = 0;  //
  isSuperAdmin : boolean = false;
  username: string = '';

  constructor(private router : Router, private api : Api){}
  ngOnInit(): void 
  { // on init we get all users
    // ill have a manual refresh button to update all components
    const rawToken = localStorage.getItem('currentUser');
    if (rawToken)
    {
      this.api.verifyToken(rawToken.replace(/^"|"$/g, '')).subscribe({
        next: (response) =>
        {
          if (!response.valid || response.role == "User")
          {
            localStorage.clear();
            this.router.navigate(['/home']);
          }
          this.isSuperAdmin = (response.role == "SuperAdmin");
          this.username = response.username;
          if (!this.isSuperAdmin)
          {
            this.pageType = "Groups"
            this.refreshGroups();
            return;
          }
        },
        error: (err) =>
        {
          localStorage.clear();
          this.router.navigate(['/home']);
        }

      })
    }
    else
    {
      this.router.navigate(['/home'])
    }

    this.refreshUsers();
  }


  // formatted data will be  the main data shown 
    // buttons etc determined by an if on the category name



  deleteUser(userID : string, username : string)
  {
    this.api.deleteUserRequest(userID, username).subscribe({
      next: (response) =>
      {
        if (response.success)
        {
          console.log("successfully deleted user: ", username);
          this.refreshUsers();
        }

        else
        {
          console.error("failed to delete user: ",username);
        }
      },
      error: (err) =>
      {
        console.error(err.error.message);
      }
    })
  }

  deleteGroup(groupName: string)
  {
    this.api.deleteGroup(groupName).subscribe({
      next: (response) =>
      {
        if (response.success)
        {
          this.refreshGroups();
          console.log(response.message);
        }
        else
        {
          console.error(response.message);
        }
      },
      error: (err) =>
      {
        console.error("error deleting group: ", err);
      }
    })
  }

  updateUserRole(roleValue : string, username : string)
  {
    this.api.updateUserRole(username, roleValue.toString()).subscribe({
      next: (response) =>
      {
        if (response.success)
        {
          this.formattedData = this.formattedData.map(user => {
            if (user.username === username)
            {
              return {...user, role: roleValue};
            }
            return user;
          })
          console.log("successfully updated user: ", username," to role: ", roleValue);
        }
      },
      error: (err) =>
      { 
        console.error("error updating user role: ", err);
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
    if (this.pageType == "Users")
    {
      this.refreshUsers();
    }
    else
    {
      this.refreshGroups();
    }


    // this.api.getUsersRequest(this.pageNumber, 8).subscribe({
    //   next: (response) =>
    //   {
    //     if (response.success)
    //     {
    //       this.users = response.users;
    //       this.Ids = response.ids;
    //       this.roles = response.roles;
    //       this.formattedData = this.users.map((user, index) =>({
    //         username: user,
    //         role: this.roles[index],
    //         ID: this.Ids[index],
    //       }))
    //     }
    //   },

    //   error: (err) =>
    //   {
    //     console.error("error getting users for page: ", err);
    //   }
    // })


  }

  refreshUsers()
  {
    this.api.getUsersRequest(this.pageNumber, 8).subscribe({
    next: (response) =>
    {
      if (response.success)
      {
        this.users = response.users;
        this.Ids = response.ids;
        this.roles = response.roles;
        this.totalPages = response.pageLimit;
        this.formattedData = this.users.map((user, index) =>({
          username: user,
          role: this.roles[index],
          ID: this.Ids[index],
        }))
      }
    },

    error: (err) =>
    {
      console.error("error getting users for page: ", err);
    }
  })
  }

  refreshGroups()
  {
    console.log(this.pageNumber);
    this.api.getGroups(this.pageNumber, 5, this.username).subscribe({
      next: (response) => 
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

        }
      },

      error: (err) =>
      {
        console.error("HAWK");
      }
    })

  }

  changePageCategory()
  {
    const prevType = this.pageType;
    this.pageType = this.pageType == "Users" ? "Groups" : "Users";
    if (this.pageType == "Users")
    {
      this.refreshUsers();
    }
    else
    {
      console.log("here")
      this.refreshGroups();
    }
  }
}
