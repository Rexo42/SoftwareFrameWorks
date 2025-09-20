import { ObjectId } from "mongodb";
import { validateToken } from "../functions/validateToken.js";

export async function verifyToken(app, db)
{
    app.post('/api/verify', async (req, res) =>{
        try
        {
            const authHeader = req.headers.authorization;
            if (!authHeader)
            {
                console.log('No auth header found');
                return res.json({valid : false});
            }
            const rawToken = authHeader.split(' ')[1];
            const decryptedToken = validateToken(rawToken); 
            if (decryptedToken == null)
            {
                console.log("token unable to be decrypted...")
                return res.json({valid: false});
            }
            const user = await db.collection("Users").findOne({_id: new ObjectId(String(decryptedToken.userID))});
            if (user)
            {
                return res.json({valid: true, role: user.role, username: user.username, email: user.email, age: user.age, birthdate: user.birthdate})
            }
            return res.json({valid:false});
        }
        catch(error)
        {
            return res.status(500)({valid: false});
        }
    })
}