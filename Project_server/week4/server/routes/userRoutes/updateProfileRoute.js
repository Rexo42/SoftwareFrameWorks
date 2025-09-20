import { validateToken } from "../../functions/validateToken.js";
import { ObjectId } from "mongodb";
export async function updateProfile(app, db)
{
    app.patch('/api/update', async (req, res) =>{
        try
        {
        const authHeader = req.headers.authorization;
        if (!authHeader)
        {
            console.log('No auth header found');
            return res.status(400).json({valid : false});
        }
        const rawToken = authHeader.split(' ')[1];
        const decryptedToken = validateToken(rawToken); 
        if (decryptedToken == null)
        {
            console.log("token unable to be decrypted...")
            return res.status(401).json({success: false});
        }
        const {username , email, age, birthdate} = req.body;
        await db.collection("Users").updateOne(
            {_id: new ObjectId(String(decryptedToken.userID))}, {$set: req.body}
        );
        console.log("successfully updated profile of userID: ", decryptedToken.userID);
        return res.json({success: true, message: "profile successfully updated"});
        }
        catch(error)
        {
            console.error("error updating profile: ", error);
            res.status(500).json({success:false, message: "server error..."});
        }
    });
}