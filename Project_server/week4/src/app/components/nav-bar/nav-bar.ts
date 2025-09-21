import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit 
{
  isLoggedIn: boolean = false;
  isSuperAdmin: boolean = false;
  constructor(private router: Router, private api: Api){}

  ngOnInit(): void 
  {
    this.isLoggedIn = !!(localStorage.getItem('currentUser'));
    const rawToken = localStorage.getItem('currentUser');
    if (this.isLoggedIn && rawToken)
    {
      this.api.verifyToken(rawToken.replace(/^"|"$/g, '')).subscribe({
        next: (response) =>
        {
          if (response.valid && response.role == "SuperAdmin")
          {
            this.isSuperAdmin = true;
          }
        },
        error: (err) =>
        {
          console.error("error validating user Token: ",err);
        }
      })
    }
  }

  logout(): void
  {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
  create(): void
  {
    this.router.navigate(['/login']);
  }
}
