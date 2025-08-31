var express = require('express'); //used for routing
const session = require('express-session');
var app = express();
var http = require('http').Server(app); 
const path = require('path');
const jwt = require ('jsonwebtoken')

const jwtKey = 'testKey123';

var cors = require('cors');
app.use(cors());

//app.use(express.static(path.join('../dist/week4/browser')));
app.use(express.json());

app.use(session({
  secret: 'my-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
int : ticker = 0;

class user
{
    constructor(username, email, password)
    {
        this.userID = ticker;
        this.username = username;
        this.email = email;
        this.age;
        this.birthdate;
        this.valid = false;
        this.password = password;
        ticker += 1;
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
    origin: "http://localhost:4200",
    //origin: "http://121.222.65.60:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
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

app.post('/api/verifyToken', (req, res) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader)
    {
        console.log('No auth header found');
        return res.json({valid : false});
    }

    
    const token = authHeader.split(' ')[1];
    console.log(`token recieved from user: ${token}`);
    data = validateToken(token);

    for (i = 0; i < users.length; i++)
    {
        if (users[i].userID == data.username)
        {
            return res.json({valid : true, username : users[i].username, email:users[i].email, age:users[i].age, birthdate:users[i].birthdate })
        }
    }

});


app.post('/api/auth', (req, res) => {
    const {username, password} = req.body;
    for (i = 0; i < users.length; i++)
    {
        if (username == users[i].username && password == users[i].password)
        {
            users[i].valid = true;

            const token = generateToken({username: users[i].userID});
            //validateToken(token);
            console.log('authorisation token created: ', token);
            return res.json({message:"login success",success: true,token :token})
            //return res.json({ message: 'login success', success: users[i].valid, details: copy});
        }
    }
    return res.json({ message: 'login failed', success: false, token : null});
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

app.post('/api/updateProfile', (req, res) => {
    const {username, email, age, birthdate} = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(req.body);
    //console.log("LOOK HERE");
    decrypted = validateToken(token);
    let user = null;
    console.log(decrypted.userID, "look here");
    for (i = 0; i < users.length; i++){
        if (decrypted.username == users[i].userID)
        {
            user = users[i];
            break;
        }
    }
    if (user)
    {
        user.username = username;
        user.email = email;
        user.age = age;
        user.birthdate = birthdate;
        return res.json({ success: true});
    }
    else{
        return res.status(403).json({ error: 'user doesnt exist', success: false});
    }
});

function generateToken(payload) {
    // Generate the token with an expiration time of 1 hour
    const token = jwt.sign(payload, jwtKey, { expiresIn: '15m' });
    console.log("Generated Token:", token);
    return token;
}

function validateToken(token) {
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, jwtKey);
        console.log("Token is valid. Decoded payload:", decoded);
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log("Token expired.");
        } else {
            console.log("Invalid token:", err.message);
        }
        return null;
    }
}




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

