export class User
{
    //static ID = 0;
    constructor(username, email, password, role)
    {
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthdate = null;
        this.role = role;
        this.groups = [];
    }
}