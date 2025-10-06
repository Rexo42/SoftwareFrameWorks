import { ObjectId } from 'mongodb';
import {channel} from "../.../../../../database/classes/Channel.js"
export async function createChannel(app, db, io)
{
    app.post('/api/createChannel', async(req, res) =>{
        try
        {
        const {username, groupName, channelName} = req.body;
        console.log(username, groupName, channelName);
        const targetGroup = await db.collection("Groups").findOne({_id: new ObjectId(groupName)});
        const channels = targetGroup.channels;
        if (channels.includes(channelName))
        {
            return res.status(401).json({valid: false})
        }
        const newChannel = new channel(channelName, username);
        await db.collection("Groups").updateOne(
            {_id: new ObjectId(groupName)},
            {$push:{channels: newChannel}}
        )
        io.to(groupName).emit('updateChannels', groupName, channelName);
        io.to('0').emit('updateChannels', groupName, channelName);
        return res.json({valid: true});
        }
        catch(error)
        {
            return res.status(500).json({success: false});
        }
    })
}