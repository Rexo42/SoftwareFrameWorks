import jwt from 'jsonwebtoken';
//require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
//const jwtKey = 'testkey123';
const jwtKey = process.env.jwtKey;

export function generateToken(payload) 
{
    const token = jwt.sign(payload, jwtKey, { expiresIn: '45m' });
    console.log("Generated Token:", token);
    return token;
}