import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
@Component({
  selector: 'app-delete-channel',
  standalone: false,
  templateUrl: './delete-channel.html',
  styleUrl: './delete-channel.css'
})
export class DeleteChannel 
{
  constructor(private router : Router, private api : Api){};
  @Output() channelDeleted = new EventEmitter<{groupName: string, channelName: string}>();
  @Output() handleMessage = new EventEmitter<string>();
  @Input() groupList: {groupName: string, groupCreator: string, groupID: string, groupWaitList: string[], channelNames: string[]}[]=[];

  selectedChannel : string = '';
    selectedGroup: {
    groupName: string;
    groupCreator: string;
    groupID: string;
    groupWaitList: string[];
    channelNames: string[];
  } | null = null;

  message : string = '';


  deleteChannel()
  {
    // logic for calling external parent function given user input group/channel to delete
    if (this.selectedChannel && this.selectedGroup)
    {
      this.channelDeleted.emit({groupName: this.selectedGroup.groupName, channelName: this.selectedChannel});
      this.selectedChannel = '';
      this.selectedGroup =null;
    }
    
  }


}
