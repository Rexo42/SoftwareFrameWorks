import { generateToken } from "../../functions/generateToken.js";
export async function userLogin(app, db)
{
    app.post('/api/auth', async (req, res) =>{
        const collection = await db.collection("Users").find({}).toArray();
        const {username, password} = req.body;
        //console.log("we made it chat");
        for (const user of collection)
        {
            if (user.username == username && user.password == password)
            {
                let newToken = generateToken({userID: user._id});
                console.log("user successfully logged in: ", user.username);
                return res.json({message:"login success",success: true,token : newToken})
            }
        }
        return res.status(404).json({
            message: "invalid username or password",
            success: false,
        });

    });
}