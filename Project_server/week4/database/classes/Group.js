export class Group
{
    constructor(name, creator)
    {
        this.creator = creator;
        this.groupName = name;
        this.members = []; 
        this.channels = [];
        this.members.push(this.creator);
    }
}