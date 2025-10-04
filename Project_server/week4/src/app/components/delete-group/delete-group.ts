import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-delete-group',
  standalone: false,
  templateUrl: './delete-group.html',
  styleUrl: './delete-group.css'
})
export class DeleteGroup 
{
  @Output() groupDeleted = new EventEmitter<void>();
  @Output() handleMessage = new EventEmitter<string>();
  @Input() groupList: string[] = [];

  selectedGroup : string ='';
  message : string = '';
  constructor(private router: Router, private Api : Api) {}

  deleteGroup()
  {
    this.Api.deleteGroup(this.selectedGroup).subscribe({
      next: (response) =>
      {
        if (response.success)
        {
          this.message = ("Group: '"+this.selectedGroup + "' successfully deleted");
          this.handleMessage.emit(this.message);
          this.groupDeleted.emit();
          this.selectedGroup = '';
        }
      },
      error: (err) =>
      { 
        this.message = err;
        this.handleMessage.emit(this.message);
      }
    })
  }
}
