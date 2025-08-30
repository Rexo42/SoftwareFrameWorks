import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit
{
  profileForm!: FormGroup
  constructor(private fb: FormBuilder, private router:Router, private Api : Api){}
  ngOnInit(): void
  {
    this.profileForm = this.fb.group({
    username: [''],
    email: [''],
    age: [''],
    birthdate: [''],
  });
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser)
    {
      this.Api.verifyToken(storedUser.replace(/^"|"$/g, '')).subscribe ({
        next: (response) => {
          if (response.valid)
          {
            // response include username
            console.log("validated successfully");
            console.log(response)
            this.profileForm = this.fb.group(
            {
              username: [response.username || ''],
              email: [response.email || ''],
              age: [response.age || ''],
              birthdate: [response.birthdate || ''],
            });

          }
          else
          {
            console.log("failed to validate token");
            this.router.navigate(['/login']);
          }

        }
      })
     // const user = JSON.parse(storedUser);

    //   this.profileForm = this.fb.group({
    //   username: [user.username],
    //   birthdate: [user.birthdate],
    //   age: [user.age],
    //   email: [user.email],
    //   valid: [user.valid]
    // });
    }
    else
    {
      console.log("no auth token found");
      this.router.navigate(['/login']);
    }
  }
  onSubmit(): void
  {
    // call a post to the server to update credentials
    const values = this.profileForm.value;
    
  }
}

