import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-group-ui',
  standalone: false,
  templateUrl: './group-ui.html',
  styleUrl: './group-ui.css'
})
export class GroupUI {
  constructor(private router: Router, private Api : Api) {}
  groupName = "";

  ngOnInit()
  {
    // pull group data
  }

  createGroup()
  {
    const localToken = localStorage.getItem('currentUser');
    if (localToken)
    {
      const cleanToken = localToken.replace(/^"|"$/g, '');
      this.Api.verifyToken(cleanToken).subscribe({
        next: (response) =>{
          if (response.valid)
          {

          }
          else
          {
            this.router.navigate(['/home']);
          }
        }
      });
    }
    else
    {
      this.router.navigate(['/home']);
    }

    //});
    

  }
}
