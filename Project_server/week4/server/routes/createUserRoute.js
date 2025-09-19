import { User } from "../../database/classes/User.js";
import { checkValidUsername } from "../functions/checkUsername.js";

export async function createUser(app, db)
{
    app.post('/api/create', async(req, res) =>{
        const data = req.body;
        if (!data || (data.username == '' || data.email == ''||data.password==''))
        {
            return res.status(401).json({
                success: false,
                message: "missing fields",
            });
        }
        if (!await checkValidUsername(db, data.username))
        {
            return res.status(401).json({
                success:false,
                message: "username already taken",
            });
        }
        const newUser = new User(data.username, data.email, data.password, "User");
        try
        {
            const collection = await db.collection("Users");
            await collection.insertOne(newUser);
            console.log("new user created: ", newUser.username);
            return res.json({success: true, message: "new user created"})
        }
        catch(error)
        {
            return res.status(401).json({
                success:false,
                message: "server error..."
            });
        }

    })
}