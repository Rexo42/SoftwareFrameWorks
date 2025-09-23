import {Group} from "../.../../../../database/classes/Group.js"
import { checkPermissions } from "../../functions/checkPermissions.js";

export async function createGroup(app, db)
{
    app.post('/api/createGroup', async (req, res) =>{
        try
        {
            // check permission
            const {groupName, username} = req.body;
            const user = await db.collection("Users").findOne({username: username});
            //console.log(checkPermissions(db, user._id.toString(), 1));
            //console.log("kino");
            if (await checkPermissions(db,user._id ,1))
            {
                //console.log("kino");
                //console.log(groupName, username);
                const memberDetails = {_id: user._id, username: username, role: user.role};
                console.log(memberDetails, "LOOK HERE");
                const collection = await db.collection("Groups");
                const newGroup = new Group(groupName, memberDetails);
                await collection.insertOne(newGroup);
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