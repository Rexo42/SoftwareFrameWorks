export class Group
{
    constructor(name, creator)
    {
        this.creator = creator.username;
        this.groupName = name;
        this.members = []; 
        this.channels = [];
        this.memberWaitlist = [];
        this.members.push(creator);
    }
}