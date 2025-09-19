export class group
{
    static groupID = 0;
    constructor(name, creator)
    {
        this.groupID = ++this.groupID;
        this.groupName = name;
        this.creator = creator;
        this.members = []; 
        this.channels = [];
        this.members.push(this.creator);
    }
}