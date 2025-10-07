// export class Message
// {
//     constructor(sender, timeStamp, body, profilePicture)
//     {
//         this.sender = sender;
//         this.timeStamp = timeStamp;
//         this.body = body;
//         this.profilePicture = profilePicture;
//     }
// }
export class Message {
  constructor(username, message, profilePicture) {
    this.username = username;
    this.message = message;
    this.profilePicture = profilePicture;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.timeStamp = `${hours}:${minutes}`;
  }
}