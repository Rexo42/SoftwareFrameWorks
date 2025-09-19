import express from 'express';
import {createServer} from 'http';
import path from 'path';
//import jwt from 'jsonwebtoken';
//import fs from 'fs';
import cors from 'cors';
//import bodyParser from 'body-parser';
//import { ObjectId } from 'mongodb';
import {Server} from 'socket.io';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

/// routes
import { userLogin } from './routes/userLoginRoute.js';
import {verifyToken} from './routes/verifyTokenRoute.js';
import { createUser } from './routes/createUserRoute.js';
import { removeUser } from './routes/removeUserRoute.js';
import { updateProfile } from './routes/updateProfileRoute.js';
///

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const http = createServer(app);


app.use(cors());
app.use(express.json());

import mongoConnect from '../database/db.js'

class channels
{
    constructor(name)
    {
        this.channelName = name;
        this.channelMembers = [];
    }
}

let io;
let db;

try
{
    let server = http.listen(3000, function () 
    {
    let host = server.address().address;
    let port = server.address().port;
    console.log("My First Nodejs Server!");
    console.log("Server listening on: "+ host + " port:" + port);
    console.log('Serving static files from:', path.join(__dirname));
    });
    io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
    });
    db = await mongoConnect();

    // route setup calls
    userLogin(app, db);
    verifyToken(app, db);
    createUser(app, db);
    removeUser(app,db);
    updateProfile(app,db);
    ///


}
catch(error)
{
    console.error("error starting backend: ", error);
    throw (error);
}


io.on('connection', (socket)=>
{
    console.log("user connected via socket: ", socket.id);

    socket.on('joinRoom', (room, user)=>{
        socket.join(room);
        console.log("socket: ",socket.id, " joined room: ", room);
        io.to('0').emit('receiveMessage', "has joined", user);
    });
    // need a leave room function 
    socket.on('sendMessage', (message, username)=>{
        console.log("message recieved from:", socket.id, " :: ", message);
        socket.to('0').emit('receiveMessage', message, username);
    });
    socket.on('newGroup', (groupName, username, callback)=>{
        for (let group of groups)
        {
        if (group.groupName == groupName)
        {
            return callback({valid: false, message: 'Group Already Exists'});
        }
        }
        console.log("creating new group from socket: ", socket.id);
        console.log (username, "created new group: ", groupName)
        groups.push(new group(groupName, username));
        updateServerData(serverDataa);
        io.to('0').emit('updateGroups', groupName);
        return callback({valid:true, message: "Group Created Successfully"});
    });
    socket.on('disconnect',()=>
    {
        io.to('0').emit('receiveMessage', "has disconnected", socket.id);
        console.log("user disconnected: ", socket.id);
    });

});

app.get('/api/getGroups', (req, res) =>{
    console.log("PULLING USER GROUP");
    let groupNames = [];
    const authHeader = req.headers.authorization;
    if (!authHeader)
    {
        console.log('No auth header found');
        return res.json({valid : false});
    }

    const token = authHeader.split(' ')[1];
    console.log(`token recieved from user: ${token}`);
    data = validateToken(token);
    if (data == null)
    {
        return res.json({valid: false});
    }
    //console.log("KINO");
    for (let user of users)
    {
        //console.log(data.username);
        //console.log(user.userID);
        if (user.userID == data.username)
        {
            if (user.roles[0] == "Super Administrator")
            {
                groupNames = groups.map(group => group.groupName)
                //console.log(groupNames);
                //console.log(groups);
                return res.json({groups: groupNames});
            }
            groupNames = user.groups.map(group => group.groupName)
            return res.json({groups: groupNames});
        }
    }
    //return res.json({groups : groupNames})
});

app.post('/api/createGroup',(req, res)=>{
    // send through group name and the creator user id
    //console.log(req.body);
    data = req.body;
    let newGroup = new group(data.groupName, data.username);
    for (let group of groups)
    {
        if (group.groupName == data.groupName)
        {
            return res.json({valid:false});
        }
    }
    //newGroup.members.push();
    // also will need to give the creator of the group the admin role
    groups.push(newGroup);
    console.log("created group: ", newGroup);
    updateServerData(serverDataa);
    return res.json({valid: true});
});


app.post('/api/createChannel',(res, req)=>{
    data = req.body;
    // contains parentGroup, Channel name id of user making group
    for (i = 0; i < groups.length; i++)
    {
        if (groups[i].groupName == data.parentGroup)
        {
            group = groups[i];
            group.channels.push(new channel(data.channelName));
            // send event to everyone in the parent group socket to update UI stuff
        }
    }
});

app.delete('/api/deleteChannel', (res, req)=>{
    data = req.body;
    // send through the channel name being deleted, also need a reference to the parent GROUP
    for (i = 0; i < groups; i++)
    {
        if (groups[i].groupName == data.parentGroup)
        {
            for (j = 0; j < groups[i].channels.length; j++)
            {
                if (groups[i].channels[j].channelName == data.channelName)
                {
                    groups[i].channels.remove(j);
                    return res.json({success:true});
                    // send an event to everyone in the channel that updates UI 
                }
            }
        }
    }
    return res.json({success:false});
});

app.delete('/api/deleteGroup', (res,req) =>{
    data = req.body;
    // group name, and user sending the request
    for (i = 0; i < groups.length; i++)
    {
        if (groups[i].groupName == data.groupName)
        {
            groups.remove(i);
            // send out socket event to everyone in that group to update UI and then also close socket opened to this group
        }
    }
    updateServerData(serverDataa);

})

// app.post('/api/updateProfile', (req, res) => {
//     const {username, email, age, birthdate} = req.body;
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     decrypted = validateToken(token); // need to add expiry protection here
//     if (!checkValidUsername(decrypted.username, username))
//     {
//         return res.json({error: 'username already taken',success: false});
//     }

//     let user = null;
//     //console.log(decrypted.username, "look here");
//     for (i = 0; i < users.length; i++){
//         if (decrypted.username == users[i].userID)
//         {
//             user = users[i];
//             break;
//         }
//     }
//     if (user)
//     {
//         user.username = username;
//         user.email = email;
//         user.age = age;
//         user.birthdate = birthdate;
//         updateServerData(serverDataa);
//         return res.json({ success: true});
//     }
//     else{
//         return res.status(403).json({ error: 'user doesnt exist', success: false});
//     }
// });




