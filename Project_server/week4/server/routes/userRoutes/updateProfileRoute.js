import { validateToken } from "../../functions/validateToken.js";
import { ObjectId } from "mongodb";

// file handling
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
///
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


export async function updateProfile(app, db)
{
    app.patch('/api/update', upload.single('profilePicture'), async (req, res) =>{
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
            const { username, email, age, birthdate } = req.body;
            const updateData = {
            ...(username && { username }),
            ...(email && { email }),
            ...(age && { age }),
            ...(birthdate && { birthdate }),
        };
        if (req.file) 
        {
            updateData.profilePicture = req.file.filename;
        }
        await db.collection("Users").updateOne(
            {_id: new ObjectId(String(decryptedToken.userID))}, {$set: updateData}
        );
        console.log("successfully updated profile of userID: ", decryptedToken.userID);
        return res.json({success: true, message: "profile successfully updated", profilePicture: updateData.profilePicture});
        }
        catch(error)
        {
            console.error("error updating profile: ", error);
            res.status(500).json({success:false, message: "server error..."});
        }
    });
}