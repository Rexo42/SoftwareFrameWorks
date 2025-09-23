export async function createChannel(app, db)
{
    app.post('/api/createChannel', async(req, res) =>{
        try
        {
        const {username, groupName, channelName} = req.body;
        const targetGroup = await db.collection("Groups").findOne({groupName: groupName});
        const channels = targetGroup.channels;
        if (channels.includes(channelName))
        {
            return res.status(401).json({valid: false})
        }
        await db.collection("Groups").updateOne(
            {groupName: groupName},
            {$push:{channels: channelName}}
        )
        return res.json({valid: true});
        }
        catch(error)
        {
            return res.status(500).json({success: false});
        }
    })
}