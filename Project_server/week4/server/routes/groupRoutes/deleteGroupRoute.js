import { ObjectId } from 'mongodb';
export async function deleteGroup(app, db, io)
{
    app.delete('/api/deleteGroup/:groupName', async(req, res) =>{
        try
        {
            
            const groupName = req.params.groupName;
            console.log(groupName);
            if (!groupName)
            {
                return res.status(401).json({success: false, message: "what are you doing bruh"});
            }

            // logic to delete channnels visually
            const data = await db.collection("Groups").findOne({_id: new ObjectId(groupName)});
            for (let i = 0; i < data.channels.length; i++)
            {
                console.log (data.channels.length);
                io.to('0').emit('removeChannel', groupName, data.channels[i]);
                io.to(groupName).emit('removeChannel', groupName, data.channels[i]);
            }
            io.to('0').emit('removeGroup', groupName);
            io.to(groupName).emit('removeGroup', groupName);

            ////

            const result = await db.collection("Groups").deleteOne({_id: new ObjectId(groupName)});
            if (result.deletedCount != 0)
            {
                console.log("successfully deleted group from database: ", groupName);
                return res.json({success: true, message: "successfully deleted group: ", groupName});
            }
            return res.status(404).json({success:false, message: "no user exists with the given username..."})


        }
        catch(err)
        {
            return res.status(500).json({success: false, message: "server error deleting group"});
        }
    })
}