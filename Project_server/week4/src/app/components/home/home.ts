import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit
{
  isLogged : boolean = false;
  ngOnInit(): void 
  {
    this.isLogged = localStorage.getItem('currentUser')!=null;    
  }
}
