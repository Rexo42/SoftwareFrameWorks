import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  @Output() userCreated = new EventEmitter<void>();
  @Output() handleMessage = new EventEmitter<string>();
  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  constructor(private router: Router, private Api : Api) {}
    ngOnInit(): void
    {
      //if (localStorage.getItem('currentUser'))
      //{
      //  this.router.navigate(['/profile']);
      //}

    }

  accountCreate()
  {
    const user = {username: this.username, password: this.password, email: this.email}

    this.Api.createAccountRequest(user).subscribe({
    next: (response) => {
      if (response.success) 
      {
        this.message = response.message;
        this.userCreated.emit();
      } 
      else
      {
        this.message = response.message;
      }
    },
    error: (err) => {
      this.message = err.error.message;
    }
  });
  this.handleMessage.emit(this.message);
  }
}
