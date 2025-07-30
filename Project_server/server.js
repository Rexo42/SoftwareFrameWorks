var express = require('express'); //used for routing
const session = require('express-session');
var app = express();
var http = require('http').Server(app); //used to provide http functionality

const users = [
{username: "test1", password: "pass1"},
{username: "test2", password: "pass2"},
{username: "test3", password: "pass3"}

];

app.use(express.static(__dirname + '/www'));
app.use(express.json());

app.use(session({
    secret: 'mysecretkey', // change for security
    resave: false,
    saveUninitialized: true,
}));

let server = http.listen(3000, function () 
{
let host = server.address().address;
let port = server.address().port;
console.log("My First Nodejs Server!");
console.log("Server listening on: "+ host + " port:" + port);
});
app.get('/test', function (req, res)
{
    res.sendFile(__dirname + '/www/index.html');
});

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
});

