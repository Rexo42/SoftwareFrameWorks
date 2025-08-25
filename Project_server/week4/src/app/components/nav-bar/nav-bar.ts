import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit 
{
  isLoggedIn: boolean = false;
  constructor(private router: Router){}

  ngOnInit(): void 
  {
    this.isLoggedIn = !!(localStorage.getItem('currentUser'))
  }

  logout(): void
  {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
      this.router.navigate(['/dummy'], { skipLocationChange: true }).then(() => 
      {
        this.router.navigate(['/home']);
      });
  }
  create(): void
  {
    this.router.navigate(['/login']);
  }
}
