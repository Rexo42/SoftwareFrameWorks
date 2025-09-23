export class Group
{
    constructor(name, creator)
    {
        this.creator = creator.username;
        this.groupName = name;
        this.members = []; 
        this.channels = [];
        this.waitList = [];
        this.members.push(creator.username);
    }
}