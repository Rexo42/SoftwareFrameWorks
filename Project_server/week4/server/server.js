import express from 'express';
import {createServer} from 'http';
import path from 'path';
//import jwt from 'jsonwebtoken';
//import fs from 'fs';
import cors from 'cors';
//import bodyParser from 'body-parser';
//import { ObjectId } from 'mongodb';
//import {Server} from 'socket.io';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

/// routes
import { userLogin } from './routes/userRoutes/userLoginRoute.js';
import {verifyToken} from './routes/verifyTokenRoute.js';
import { createUser } from './routes/userRoutes/createUserRoute.js';
import { removeUser } from './routes/userRoutes/removeUserRoute.js';
import { updateProfile } from './routes/userRoutes/updateProfileRoute.js';
import { getUsers } from './routes/userRoutes/getUsersRoute.js';
import { updateRole } from './routes/userRoutes/updateUserRole.js';
import { getGroups } from './routes/groupRoutes/getGroupsRoute.js';
import { createGroup } from './routes/groupRoutes/createGroupRoute.js';
import { deleteGroup } from './routes/groupRoutes/deleteGroupRoute.js';
import { createChannel } from './routes/channelRoutes/createChannel.js';
import { addToWaitList } from './routes/groupRoutes/addToWaitlistRoute.js';
import { addUserToGroup } from './routes/groupRoutes/addUserToGroupRoute.js';
///



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const http = createServer(app);


app.use(cors());
app.use(express.json());

import mongoConnect from '../database/db.js'
import { socketSetup } from '../socketHandler/socketHandler.js';
//import { deleteGroup } from './routes/groupRoutes/deleteGroupRoute.js';
//import { getgroups } from 'process';

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

    // initializing mongo and socket.io instance
    db = await mongoConnect();
    io = await socketSetup(server, io);
    //
    
    // route setup calls
    userLogin(app, db);
    verifyToken(app, db);
    createUser(app, db);
    removeUser(app,db);
    updateProfile(app,db);
    getUsers(app, db);
    updateRole(app, db);

    getGroups(app, db);
    createGroup(app, db);
    deleteGroup(app, db);
    
    addToWaitList(app, db);
    addUserToGroup(app,db);

    createChannel(app,db);
    ///


}
catch(error)
{
    console.error("error starting backend: ", error);
    throw (error);
}

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



