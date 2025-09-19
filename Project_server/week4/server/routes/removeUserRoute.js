export async function removeUser(app, db)
{
    app.delete('/api/delete/:username', async(req, res) =>{
        try
        {
            const username = req.params.username;
            const res = await db.find("Users").deleteOne({username: username});
            if (res.deletedCount != 0)
            {
                console.log("successfully deleted user from database: ", username);
                return res.json({success: true, message: "successfully deleted user: ", username});
            }
            return res.status(404).json({success:false, message: "no user exists with the given username..."})
            
        }
        catch(error)
        {
            return res.status(401).json({success: false, message: "serverside error trying to delete user"})
        }

    })
}