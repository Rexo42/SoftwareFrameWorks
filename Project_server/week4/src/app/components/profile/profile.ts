import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit
{
  profileForm!: FormGroup
  constructor(private fb: FormBuilder, private router:Router ){}
  ngOnInit(): void
  {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser)
    {
      const user = JSON.parse(storedUser);

      this.profileForm = this.fb.group({
      username: [user.username],
      birthdate: [user.birthdate],
      age: [user.age],
      email: [user.email],
      valid: [user.valid]
    });
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }
  onSubmit(): void
  {
  localStorage.setItem('currentUser',JSON.stringify(this.profileForm.value));
  }
}

