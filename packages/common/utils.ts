import dotenv from "dotenv";
dotenv.config();


// BE
export const JWT_SECRET = process.env.JWTTOKEN || "";