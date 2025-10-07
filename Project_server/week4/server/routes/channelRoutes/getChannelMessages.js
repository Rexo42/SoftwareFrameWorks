export async function getChannelMessages(app, db)
{
    app.get('/api/getMessages', async(req,res) =>
    {
        const {groupName, channelName} = req.query;
        if (!groupName|| !channelName)
        {
            return res.status(401).json({valid:false});
        }
        try
        {

            const result = await db.collection("Groups").findOne(
                {
                    groupName: groupName,
                    "channels.channelName": channelName,
                },
                {
                    projection: {"channels.$":1}
                }
            )
            return res.json({valid:true, messages: result.channels[0].messageHistory});
        }
        catch(error)
        {  
            return res.status(401).json({valid:false});
        }
    })
}