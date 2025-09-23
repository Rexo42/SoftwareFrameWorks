export async function getGroups(app, db)
{
    app.get('/api/getGroups', async (req, res) =>
    {
        try
        {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page-1) * limit;
            const username = req.query.username;
           // console.log(username);
            const user = await db.collection('Users').findOne({username: username});
            const useCase = req.query.useCase;
            let totalUsers;
            let groups;
            // if (user.role == "User")
            // {
            //     return res.status(401).json({success: false, message: "Invalid permissions"});
            // }
            if (!useCase)
            {
                if (user.role == "GroupAdmin")
                {
                    
                    totalUsers = await db.collection('Groups').countDocuments({creator: user.username});
                    groups = await db.collection('Groups').find({creator: user.username}, {projection: { groupName: 1, _id: 1, creator: 1 }})
                    .skip(skip)
                    .limit(limit)
                    .toArray();
                }
                else
                {
                    //console.log(user.role);
                    totalUsers = await db.collection('Groups').countDocuments();
                    groups = await db.collection('Groups').find({}, {projection: { groupName: 1, _id: 1, creator: 1 }})
                    .skip(skip)
                    .limit(limit)
                    .toArray();
                }
                const groupNames = groups.map(group => group.groupName);
                const groupCreators = groups.map(group => group.creator);
                const Ids = groups.map(group => group._id.toString());

                return res.json({success: true, groups: groupNames, ids: Ids, creators: groupCreators, pageLimit: Math.ceil(totalUsers / limit)});
            }
            else
            {
                totalUsers = await db.collection('Groups').countDocuments();
                groups = await db.collection('Groups').find({}, {projection: { groupName: 1, _id: 1, creator: 1 }})
                .skip(skip)
                .limit(limit)
                .toArray();
                const groupNames = groups.map(group => group.groupName);
                const groupCreators = groups.map(group => group.creator);
                const Ids = groups.map(group => group._id.toString());

                return res.json({success: true, groups: groupNames, ids: Ids, creators: groupCreators, pageLimit: Math.ceil(totalUsers / limit)});
            }
        }
        catch(error)
        {
            return res.status(500).json({success: false, message: "server error getting groups..."});
        }
    })
}