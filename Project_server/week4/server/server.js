var express = require('express'); //used for routing
const session = require('express-session');
var app = express();
var http = require('http').Server(app); //used to provide http functionality
const path = require('path');

var cors = require('cors');
app.use(cors());

//app.use(express.static(path.join('../dist/week4/browser')));
app.use(express.json());

app.use(session({
  secret: 'my-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Set to true only if using HTTPS
}));

class user
{
    constructor(username, email, password)
    {
        this.username = username;
        this.email = email;
        this.age;
        this.birthdate;
        this.valid = false;
        this.password = password;
    }
}
//username: 'user1', birthdate: string, age: int, email: string, password: 'pass1', valid: false
    // {new : user("user1", "exampl@testmail.com", "pass1")},
    // { username: 'user2', birthdate: '12/8/1995', age: 42, email: "example2@testmail.com", password: 'pass3', valid: false },
    // { username: 'user3', birthdate: '18/2/2013', age: 36, email: "example3@testmail.com", password: 'pass3', valid: false }
// hardcoded logins for testing
const users = 
[
    new user("user1", "example@testmail.com", "pass1"),
    new user("user2", "example2@testmail.com", "pass2"),
    new user("user3", "example3@testmail.com", "pass3")
];


let server = http.listen(3000, function () 
{
let host = server.address().address;
let port = server.address().port;
console.log("My First Nodejs Server!");
console.log("Server listening on: "+ host + " port:" + port);
console.log('Serving static files from:', path.join(__dirname));
});
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Your Angular frontend
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket)=>
{
    console.log("user connected via socket: ", socket.id);

    socket.on('joinRoom', (room, user)=>{
        socket.join(room);
        console.log("socket: ",socket.id, " joined room: ", room);
        io.to('1').emit('receiveMessage', "has joined", user);
    });
    // need a leave room function 
    socket.on('sendMessage', (message, username)=>{
        console.log("message recieved from:", socket.id, " :: ", message);
        socket.to('1').emit('receiveMessage', message, username);
    });
    socket.on('disconnect',()=>
    {
        io.to('1').emit('receiveMessage', "has disconnected", socket.id);
        console.log("user disconnected: ", socket.id);
    });

});




app.post('/api/auth', (req, res) => {
    const {username, password} = req.body;
    for (i = 0; i < users.length; i++)
    {
        if (username == users[i].username && password == users[i].password)
        {
            users[i].valid = true;
            copy = new user(users[i].username, users[i].email, '')
            return res.json({ message: 'login success', success: users[i].valid, details: copy});
        }
    }
    return res.json({ message: 'login failed', success: false});
});

app.post('/api/create', (req, res) =>{
    const {username, password, email} = req.body;
    if (!username || !password || !email)
    {
        return res.json({message: 'missing fields', success: false});
    }
        // go through existing users and check a username doesnt already exist if not return kino
    for (i = 0; i < users.length; i++)
    {
        if (users[i].username == username || users[i].email == email)
        {
            return res.json ({message: 'that username or email is already taken', success: false})
        }
    }
    details = new user(username, email, password);
    console.log(details.username);
    copy = new user(details.username, details.email, '')
    users.push(details);
    console.log("made a user");
    return res.json({message: 'creation success', success: true, details: copy})
});





/*
app.get('/account', function (req, res)
{
    if (req.session.username)
    {
        console.log(req.session.username);
        res.sendFile(__dirname + '/www/account.html');
    }
    else{
        res.redirect('/');
    }
    
});
app.post('/api/login', function(req, res)
{
    if (!req.body)
    {
        console.log("joever");
        return res.sendStatus(400);
    }
    var user = {};
    user.email = req.body.email;
    user.pwd = req.body.password;
    user.valid = false;

    for (i = 0; i < users.length; i++)
    {
        if (user.email == users[i].username && user.pwd == users[i].password)
        {
            user.valid = true;
            req.session.username = user.email;
        }
    }
    res.send(user);
});
app.get('/api/username', (req, res) =>
    {
    if (req.session.username)
    {
        res.json({username: req.session.username});
    }
    else{
        res.json({username:null});
    }
        */
//});

