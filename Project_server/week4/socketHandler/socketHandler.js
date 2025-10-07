import {Server} from 'socket.io';
import { Message } from '../database/classes/Message.js';
export async function socketSetup(server, io, db)
{
    io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
    }); 

    io.on('connection', (socket)=>
    {
        console.log("user connected via socket: ", socket.id);

        socket.on('joinRoom', (room, user, useCase)=>
        {
            socket.join(room);
            console.log("socket: ",socket.id, " joined room: ", room);
            if (useCase == 1)
            {
                io.to(room).emit('receiveMessage', new Message(socket.username, "has joined", 'notification-Join'));
            }
            
        });

        socket.on('leaveRoom', (room) =>
        {
            socket.leave(room);
            console.log(`Socket ${socket.id} left channel ${room}`)
            io.to(room).emit('receiveMessage', new Message(socket.username, "has left", 'notification-Leave'));
        })

        socket.on('assignSocketToUser', (username, profilePicture)=>
        {
            if (!socket.username)
            {
                socket.username = username;
            }
            if (!socket.profilePicture)
            {
                socket.profilePicture = profilePicture;
            }
            //socket.username = username;
        });
        // need a leave room function 
        socket.on('sendMessage', (message, username, channel, group, profilePicture)=>
        {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;

            const newMsg = new Message(username, message, profilePicture);
            console.log("message recieved from:", socket.id, " :: ", message);
            // in here we can update message history
            try
            {
                db.collection("Groups").updateOne(
                    {
                        groupName: group,
                        "channels.channelName": channel,
                    },
                    {
                        $push: 
                        {
                            "channels.$.messageHistory": newMsg
                        }
                    }
                )
            }
            catch(error)
            {

            }

            socket.to(channel).emit('receiveMessage', newMsg);
        });

    socket.on('disconnect',()=>
    {
        //io.to('0').emit('receiveMessage', "has disconnected", socket.username);
        console.log("user disconnected: ", socket.id);
    });
    

    });
    return io;
    
}
