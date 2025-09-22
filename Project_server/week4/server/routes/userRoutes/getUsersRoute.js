export async function getUsers(app, db)
{
    app.get('/api/getUsers', async(req, res) =>{
        try
        {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page-1) * limit;

            const totalUsers = await db.collection('Users').countDocuments();
            const users = await db.collection('Users').find({}, {projection: { username: 1, _id: 1, role: 1 }})
            .skip(skip)
            .limit(limit)
            .toArray();

            const usernames = users.map(user => user.username);
            const roles = users.map(user => user.role);
            const Ids = users.map(user => user._id.toString());

            return res.json({success: true, users: usernames, ids: Ids,roles: roles, pageLimit: Math.ceil(totalUsers / limit)});
        }
        catch(error)
        {
            console.error("error getting users: ", error);
            return res.status(500).json({success: false});
        }
    })
}