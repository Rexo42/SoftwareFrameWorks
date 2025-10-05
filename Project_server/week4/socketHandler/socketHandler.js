import {Server} from 'socket.io';
export async function socketSetup(server, io)
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

        socket.on('joinRoom', (room, user)=>
        {
            socket.join(room);
            console.log("socket: ",socket.id, " joined room: ", room);
            io.to(room).emit('receiveMessage', "has joined", user);
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
        socket.on('sendMessage', (message, username, channel)=>
        {
            console.log("message recieved from:", socket.id, " :: ", message);
            socket.to(channel).emit('receiveMessage', message, username);
        });
        socket.on('newGroup', (groupName, username, callback)=>
        {
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
        io.to('0').emit('receiveMessage', "has disconnected", socket.username);
        console.log("user disconnected: ", socket.id);
    });

    });
    return io;
}