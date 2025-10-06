export async function deleteChannel(app, db,io)
{
    app.delete('/api/deleteChannel', async(req, res)=>
    {
        try
        {
            // use username for validation check later
            const {channelName, groupName, username} = req.query;
            console.log(channelName, groupName, username);
            const targetGroup = await db.collection("Groups").findOne({groupName: groupName});
            
            if (!targetGroup)
            {
                return res.status(401).json({valid: false});
            }
            const check = await db.collection("Groups").updateOne(
                {groupName: groupName},
                {$pull: {channels: {channelName}}}
            );
            
            if (check.modifiedCount === 0)
            {
                return res.status(404).json({valid: false, message: "Channel not found"})
            }
            console.log("we made it here");
            io.to('0').emit('removeChannel', targetGroup._id, channelName);
            io.to(targetGroup._id).emit('removeChannel', targetGroup._id, channelName);
        
            return res.json({valid:true, message: "successfully deleted channel from database"});
        }
        catch(error)
        {

        }
    });
}