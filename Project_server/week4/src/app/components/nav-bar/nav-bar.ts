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
  role: string = '';
  user: string = '';
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
          if (response.valid && (response.role == "SuperAdmin" || response.role == "GroupAdmin"))
          {
            this.isSuperAdmin = true;
          }
          (response.valid)
          {
            this.user = response.username;
            this.role = response.role;
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
    // logic for logging out/clearing storage/altering UI
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
  create(): void
  {
    this.router.navigate(['/login']);
  }
}
