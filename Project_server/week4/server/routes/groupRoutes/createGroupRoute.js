import {Group} from "../.../../../database/classes/Group.js"
import { checkPermissions } from "../../functions/checkPermissions.js";

export async function createGroup(app, db)
{
    app.post('/api/createGroup', async (req, res) =>{
        try
        {
            // check permissions
            const {userID,username, groupName} = req.body;

            if (checkPermissions(db,userID ,1))
            {
                const collection = await db.collection("Groups");
                const newGroup = new Group(groupName, username);
                await collection.insertOne(newGroup);
                return res.json({success: true});
            }
            else
            {
                return res.status(401).json({success:false});
            }
        }
        catch(error)
        {
            return res.status(500).json({success: true});
        }
    })
}