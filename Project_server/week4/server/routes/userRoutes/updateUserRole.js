export async function updateRole(app, db)
{
    app.patch('/api/updateRole/:username', async (req, res) =>{
        try
        {
            const newRole = req.body.role;
            console.log(req.body);
            await db.collection("Users").updateOne(
                {username: req.params.username}, {$set: {role: newRole}}
            );
            console.log("updated user: ", req.params.username, " to role of: ", newRole);
            return res.json({success: true, message: "updated users role successfully"});
        }
        catch(error)
        {
            console.error("failed to update user role");
            return res.status(500).json({success: false, message: error});
        }
    });
}