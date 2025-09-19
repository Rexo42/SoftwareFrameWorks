import { validateToken } from "../functions/validateToken.js";

export async function verifyToken(app, db)
{
    app.post('/api/verify', async (req, res) =>{
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
        console.log(decryptedToken.userID);
        const collection = await db.collection("Users").find({}).toArray();
        for (const user of collection)
        {
            if (user.userID == decryptedToken.userID)
            {
                return res.json({valid: true, username: user.username, email: user.email, age: user.age, birthdate: user.birthdate})
            }
        }
        return res.json({valid:false});
    })
}