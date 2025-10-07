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
  selectedFile: File | null = null;
  profilePicture: string | null = null;
  message : string = "";
  profileForm!: FormGroup
  constructor(private fb: FormBuilder, private router:Router, private Api : Api){}
  ngOnInit(): void
  {
    this.profileForm = this.fb.group({
    username: [''],
    email: [''],
    age: [''],
    birthdate: [''],
    profilePicture: [''],
  });
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser)
    {
      this.Api.verifyToken(storedUser.replace(/^"|"$/g, '')).subscribe ({
        next: (response) => {
          if (response.valid)
          {
            console.log("validated successfully");
            console.log(response)
            if (response.profilePicture)
            {
              this.profilePicture = response.profilePicture;
            }
            this.profileForm = this.fb.group(
            {
              username: [response.username || ''],
              email: [response.email || ''],
              age: [response.age || ''],
              birthdate: [response.birthdate || ''],
              profilePicture: [response.profilePicture || ''],
            });
            console.log(response.profilePicture);

          }
          else
          {
            console.log("failed to validate token");
            localStorage.removeItem('currentUser');
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

  onFileSelected(event: Event): void 
  {
    // logic for setting file
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) 
    {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void
  {
    // updating profile submission logic
    const token = localStorage.getItem('currentUser');
    if (!token)
    {
      console.log("token missing when updating details!");
      this.router.navigate(['/home']);
      return;
    }
    
    const values = this.profileForm.value;
    const data = new FormData();

    data.append('username', values.username);
    data.append('email', values.email);
    data.append('age', values.age);
    data.append('birthdate', values.birthdate);
    
    console.log(data, token);
    const cleanToken = token.replace(/^"|"$/g, '');
    if (this.selectedFile)
    {
      data.append('profilePicture', this.selectedFile);
    }

    this.Api.updateProfileRequest(data, cleanToken).subscribe(
    {
      next: (response) =>{
        if (response.success)
        {
          if (this.selectedFile)
          {
            this.profilePicture = response.profilePicture;
          }
          
          console.log("updated credentials");
          this.message = "Profile Updated Successfully!";
          this.selectedFile = null;
        }
        else
        {
          console.log("failed to update profile");
          this.message = response.message;
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (err.status == 500 && err.error && err.error.message)
        {
          this.message = err.error.message;
        }
        else
        {
          this.message = "server error... please try again later";
          this.router.navigate(['/home']);
        }
      }
    
    });
    
    
  }
}

