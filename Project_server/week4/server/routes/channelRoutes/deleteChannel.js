export async function deleteChannel(app, db)
{
    app.delete('/api/deleteChannel', async(req, res)=>
    {
        try
        {
            // use username for validation check later
            const {channelName, groupName, username} = req.query;
            console.log(channelName, groupName, username);
            const targetGroup = await db.collection("Groups").findOne({groupName: groupName});
            console.log("we made it here");
            if (!targetGroup)
            {
                return res.status(401).json({valid: false});
            }
            const check = await db.collection("Groups").updateOne(
                {groupName: groupName},
                {$pull: {channels: channelName}}
            );
            if (check.modifiedCount === 0)
            {
                return res.status(404).json({valid: false, message: "Channel not found"})
            }
            return res.json({valid:true, message: "successfully deleted channel from database"});
        }
        catch(error)
        {

        }
    });
}