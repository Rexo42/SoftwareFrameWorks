export class Message
{
    public timeStamp : string;
    constructor(public username:string, public message:string, public profilePicture:string)
    {
        this.username = username;
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        this.timeStamp = time;
        this.message = message;
        this.profilePicture = profilePicture;
    }
}