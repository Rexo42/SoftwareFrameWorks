import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount 
{
  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  constructor(private router: Router, private Api : Api) {}
        ngOnInit(): void
    {
      if (localStorage.getItem('currentUser'))
      {
        this.router.navigate(['/profile']);
      }

    }

  accountCreate()
  {
    const user = {username: this.username, password: this.password, email: this.email}

      this.Api.createAccountRequest(user).subscribe({
      next: (response) => {
        if (response.success) 
        {
          // we need to set local storage of the values
          localStorage.setItem('currentUser', JSON.stringify(response.token))
          this.router.navigate(['/profile']);
        } else {
          this.message = response.message;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = 'Server error, please try again later.';
      }
    });
    // api makes call sends user as data and creates the account
      // only check if the username is taken
  }
}
