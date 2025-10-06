import {Server} from 'socket.io';
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
                io.to(room).emit('receiveMessage', "has joined", user);
            }
            
        });

        socket.on('leaveRoom', (room) =>
        {
            socket.leave(room);
            console.log(`Socket ${socket.id} left channel ${room}`)
        })

        socket.on('assignSocketToUser', (username)=>
        {
            if (!socket.username)
            {
                socket.username = username;
            }
            //socket.username = username;
        });
        // need a leave room function 
        socket.on('sendMessage', (message, username, channel, group)=>
        {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;


            const formattedMessage = `(${time}) ${username}: ${message}`
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
                        $push: {
                            "channels.$.messageHistory": formattedMessage
                        }
                    }
                )
            }
            catch(error)
            {

            }

            socket.to(channel).emit('receiveMessage', message, username);
        });
        // socket.on('newGroup', (groupName, username, callback)=>
        // {
        //     io.to('0').emit('updateGroups', groupName);
        //     return callback({valid:true, message: "Group Created Successfully"});
        // });
        // socket.on('newChannel', (groupID, channelName, callback)=>
        // {
        //     io.to(groupID).emit('updateChannels', groupID, channelName);
        //     return callback({valid: true, message: "channel created Successfully"});
        // });

    socket.on('disconnect',()=>
    {
        io.to('0').emit('receiveMessage', "has disconnected", socket.username);
        console.log("user disconnected: ", socket.id);
    });
    

    });
    return io;
    
}
