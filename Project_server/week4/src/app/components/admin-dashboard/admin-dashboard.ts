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
  users: string[] = [];
  Ids: string[] = [];
  roles: string[] = [];

  // page data
  formattedData: {username: string, role: string, ID: string}[]=[];
  formattedGroupData: {groupName: string, groupCreator: string, groupID: string}[]=[]
  pageType: 'Users' | 'Groups' = 'Users';
  //
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
          if (response.role == "User")
          {
            this.router.navigate(['/home']);
          }
        },
        error: (err) =>
        {
          this.router.navigate(['/home']);
        }

      })
    }
    else
    {
      this.router.navigate(['/home'])
    }


    this.api.getUsersRequest().subscribe({
      next: (response) =>
      {
        if (response.success)
        {
          console.log(response.ids);
          console.log(response.users);
          console.log(response.roles);
          this.users = response.users;
          this.Ids = response.ids;
          this.roles = response.roles;
          this.formattedData = this.users.map((user, index) =>({
            username: user,
            role: this.roles[index],
            ID: this.Ids[index],
          }))
        }
      },
      error:(err) =>
      {
        console.error("error getting users from database: ", err);
      }
    })
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
          this.formattedData = this.formattedData.filter(user=> user.username !== username);
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
}
