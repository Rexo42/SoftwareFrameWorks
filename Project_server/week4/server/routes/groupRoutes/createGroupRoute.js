import { response } from "express";
import {Group} from "../.../../../../database/classes/Group.js"
import { checkPermissions } from "../../functions/checkPermissions.js";

export async function createGroup(app, db, io)
{
    app.post('/api/createGroup', async (req, res) =>{
        try
        {
            const {groupName, username} = req.body;
            const user = await db.collection("Users").findOne({username: username});
            if (await checkPermissions(db,user._id ,1))
            {
                const memberDetails = {_id: user._id, username: username, role: user.role};

                const collection = await db.collection("Groups");
                const newGroup = new Group(groupName, memberDetails);
                const result = await collection.insertOne(newGroup);
                io.to('0').emit('updateGroups', groupName, result.insertedId);
                io.to(result.insertedId).emit('updateGroups', groupName, result.insertedId);
                return res.json({valid: true});
            }
            else
            {
                return res.status(401).json({valid:false});
            }
        }
        catch(error)
        {
            return res.status(500).json({valid: true});
        }
    })
}