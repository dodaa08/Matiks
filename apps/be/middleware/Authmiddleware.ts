import type { Request, Response } from "express";
import type { NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils.ts";

export const Middleware = async (req: Request, res : Response, nextFn : NextFunction)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1] || "";
        if (!token || !JWT_SECRET) {
          return res.status(401).json({ message: 'No token provided' });
        }
        const verify = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if(!verify){
            res.status(401).json({
                message : "User not authenticated"
            });
            return;
        };

        req.userId = verify.userId;

        nextFn();
    }
    catch(error){
        return res.status(404).json({
            message :  `Error while authenticating ${error}`
        });
    };
};
