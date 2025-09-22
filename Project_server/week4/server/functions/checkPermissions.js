export async function checkPermissions(db, userID, permissionLevel, groupName, ChannelName )
{
    //// permission Level is the desired level needed to return true
    // value of 2 means super administrator only --- creating users, removing them
    // value of 1 means super admins and group admins with right conditions: group admin is the creator of a group etc

        /// groupName and channel name are optional parameters to handle creation of groups etc
    try
    {
        const user = await db.collection("Users").findOne({_id: new ObjectId(String(userID))});
        if (user)
        {
            switch (permissionLevel)
            {
                case (1):
                    if (user.role == "GroupAdmin" || user.role == "SuperAdmin")
                    {
                        return true;
                    }
                    return false;


                case(2):
                    if (user.role == "SuperAdmin")
                    {
                        return true;
                    }
                    return false;
            }
        }
        else
        {
            console.error("error finding user...");
            return false;
        }
    }
    catch(error)
    {
        console.error("error checking permissions: ", error);
        return false;
    }
}