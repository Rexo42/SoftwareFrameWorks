import jwt from 'jsonwebtoken';
const jwtKey = 'testkey123';

export function validateToken(token) 
{
    try 
    {
        const decoded = jwt.verify(token, jwtKey);
        console.log("Token is valid. Decoded payload:", decoded);
        return decoded;
    } 
    catch (err) {
        if (err.name === 'TokenExpiredError') 
        {
            console.log("Token expired: ", err.message);
        } 
        else 
        {
            console.log("Invalid token: (what are you trying to do huh?)", err.message);
        }
        return null;
    }
}