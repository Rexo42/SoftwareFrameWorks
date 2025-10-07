//import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';


@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})

export class LoginPage 
{

  username: string = '';
  password: string = '';
  message: string = '';
  constructor(private router: Router, private Api : Api) {}
  ngOnInit(): void
  {
    if (localStorage.getItem('currentUser'))
    {
      this.router.navigate(['/profile']);
    }
  }

  login() 
  {
    // logic for submitting user input fields to backend/API for verification/auth
    const user = { username: this.username, password: this.password };
    
      this.Api.loginRequest(user).subscribe({
      next: (response) => {
        if (response.success) 
        {
          localStorage.setItem('currentUser', JSON.stringify(response.token));
          this.router.navigate(['/profile']);
        } 
        else 
        {
          this.message = 'Invalid login credentials';
        }
      },
      error: (err) => {
        if (err.status === 404 && err.error && err.error.message)
        {
          this.message = err.error.message;
        }
        else
        {
          this.message = "server error... please try again later";
        }
      }
    });
  }
}


