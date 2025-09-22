export async function deleteGroup(app, db)
{
    app.delete('/api/deleteGroup/:groupName', async(req, res) =>{
        try
        {
            const groupName = req.params.groupName;
            if (!groupName)
            {
                return res.status(401).json({success: false, message: "what are you doing bruh"});
            }
            const result = await db.collection("Groups").deleteOne({groupName: groupName});
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