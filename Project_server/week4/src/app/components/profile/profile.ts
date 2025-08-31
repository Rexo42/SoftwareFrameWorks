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
            this.router.navigate(['/home']);
          }

        }
      })
    }
    else
    {
      console.log("no auth token found");
      this.router.navigate(['/home']);
    }
  }
  onSubmit(): void
  {
    const token = localStorage.getItem('currentUser');
    if (!token)
    {
      console.log("token missing when updating details!");
      this.router.navigate(['/home']);
      return;
    }
   
    const values = this.profileForm.value;
    const user = {
      username : values.username,
      email : values.email,
      age : values.age,
      birthdate: values.birthdate,
    };
    console.log(user, token);
    const cleanToken = token.replace(/^"|"$/g, '');
    this.Api.updateProfileRequest(user, cleanToken).subscribe({
      next: (response) =>{
        if (response.success)
        {
          console.log("updated credentials");
        }
        else
        {
          console.log("failed to update profile");
        }
      }
    });
    
    
  }
}

