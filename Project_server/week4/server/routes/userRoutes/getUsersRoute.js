export async function getUsers(app, db)
{
    app.get('/api/getUsers', async(req, res) =>{
        try
        {
            const users = await db.collection('Users').find({}, {projection: { username: 1, _id: 1, role: 1 }}).toArray();
            const usernames = users.map(user => user.username);
            const roles = users.map(user => user.role);
            const Ids = users.map(user => user._id.toString());
            return res.json({success: true, users: usernames, ids: Ids,roles: roles});
        }
        catch(error)
        {
            console.error("error getting users: ", error);
            return res.status(500).json({success: false});
        }
    })
}