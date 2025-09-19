import jwt from 'jsonwebtoken';
const jwtKey = 'testkey123';

export function generateToken(payload) 
{
    const token = jwt.sign(payload, jwtKey, { expiresIn: '15m' });
    console.log("Generated Token:", token);
    return token;
}