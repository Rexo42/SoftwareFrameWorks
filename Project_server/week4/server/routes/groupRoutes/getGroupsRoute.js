export async function getGroups(app, db)
{
    app.get('/api/getGroups', async (req, res) =>
    {
        try
        {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page-1) * limit;
            //console.log(page, "kino");

            const totalUsers = await db.collection('Groups').countDocuments();
            const groups = await db.collection('Groups').find({}, {projection: { groupName: 1, _id: 1, creator: 1 }})
            .skip(skip)
            .limit(limit)
            .toArray();

            const groupNames = groups.map(group => group.groupName);
            const groupCreators = groups.map(group => group.creator);
            const Ids = groups.map(group => group._id.toString());

            return res.json({success: true, groups: groupNames, ids: Ids, creators: groupCreators, pageLimit: Math.ceil(totalUsers / limit)});
        }
        catch(error)
        {
            return res.status(500).json({success: false, message: "server error getting groups..."});
        }
    })
}