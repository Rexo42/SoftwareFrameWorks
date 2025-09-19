export async function checkValidUsername(db, username)
{
    try
    {
        const collection = await db.collection("Users").find({}).toArray();
        for (const user of collection)
        {
            if (user.username == username)
            {
                return false;
            }
        }
        return true;
        }
    catch(error)
    {
        console.error("error checking username validation: ", error);
        return false;
    }
}