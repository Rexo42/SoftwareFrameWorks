export async function addUserToGroup(app, db)
{
    app.patch('/api/addUser/:groupName/:username', async(req, res) =>
    {
        try
        {
            const groupName = req.params.groupName;
            const userName = req.params.username;
            if (!groupName || !userName)
            {
                return res.status(401).json({success: false, message: "no params sent"});
            }
            
            const user = await db.collection("Users").findOne({username: userName});
            const group = await db.collection("Groups").findOne({_id: groupName});

            if (!user || !group)
            {
                return res.status(401).json({success: false, message: "no user/group given that exists"});
            }
            await db.collection("Groups").updateOne(
            {groupName},
            {$pull: {waitList: userName}, $addToSet: {members: userName}})
            return res.json({success: true, message: "successfully added user to group"});
        }
        catch(error)
        {
            return res.status(500).json({success:false, message: "server error adding user to group"});
        }
    })
}