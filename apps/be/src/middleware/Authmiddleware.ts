import type { Request, Response } from "express";
import type { NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils.ts";

export const Middleware = async (req: Request, res : Response, nextFn : NextFunction)=>{
    try{
        const token = req.cookies.token;
        if (!token || !JWT_SECRET) {
          res.status(401).json({ message: 'No token provided' });
          return;
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
        res.status(404).json({
            message :  `Error while authenticating ${error}`
        });
    };
};
