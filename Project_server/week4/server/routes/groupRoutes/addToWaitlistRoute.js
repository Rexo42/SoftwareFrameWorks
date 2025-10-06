import { ObjectId } from 'mongodb';
export async function addToWaitList(app, db)
{
    app.patch('/api/addWaitList/:username/:groupName', async(req,res)=>
    { 
        try
        {
            const username = req.params.username;
            const groupName = req.params.groupName;
            
            const user = await db.collection("Users").findOne({username: username});
            const group = await db.collection("Groups").findOne({_id: new ObjectId(groupName)});
            if (!user || !group)
            {
                return res.status(402).json({valid:false, message: "something wierd going on huh"});
            }
            const check = group.waitList?.includes(username) || group.members?.includes(username);
            if (check)
            {
                return res.status(401).json({valid: false, message: "already in the waitlist for this group"});
            }
            await db.collection("Groups").updateOne(
                {_id: new ObjectId(groupName)},
                {$addToSet: {waitList: username}}
            )
            return res.json({valid: true, message: "successfully added user to waitlist"});

        }
        catch(error)
        {
            return res.status(500).json({valid: false, message: "server error adding user to waitlist"});
        }
    })
}