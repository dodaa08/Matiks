import express from "express";
import type { Request, Response } from "express";
import  {db} from "@repo/db";
import {SignUpSchema, SignInSchema} from "@repo/common";
import bcrypt from "bcryptjs";
import  {sign} from "jsonwebtoken";
import {JWT_SECRET} from "../../utils";
import { Middleware } from "@/middleware/Authmiddleware";

export const AuthRouter = express.Router();

AuthRouter.post("/signup",  async (req : Request, res : Response)=>{
    const {success, data, error} = SignUpSchema.safeParse(req.body);
    if(!success){ 
         console.log("validation failed:", error.flatten());
        res.status(403).json({
            message : `${error.flatten().fieldErrors}`
        });
           return;
    }

    console.log("signup body:", req.body);

    try{

        const {email, password } = data;
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password required" });
        }
        
        const findUser = await  db.user.findFirst({
            where : {
                email : email
            }
        });

        if(findUser){
            res.status(403).json({
                    message : `User already exist, logIn`
                });
                return;
            }
            
            const hashpassword = await bcrypt.hash(password, 3);
            
            const username =  email.split("@")[0] || "";
            
            await db.user.create({
                 data : {
                email : data.email,
                password : hashpassword,
                username : username
            }
            });
            
            res.status(200).json(
                {message : "Success"}
            )
        }
      catch (e: any) {
    console.error("code:", e.code, "meta:", e.meta);
    console.error(e.message);
    res.status(500).json({ message: "Internal error" });
}
});

AuthRouter.post("/signin", async (req : Request, res : Response)=>{
    const {success, data, error} = SignInSchema.safeParse(req.body);
    if(!success){ 
        res.status(403).json({
            message : `${error.flatten().fieldErrors}`
        });
        return;
    }

    const {email, password } = data;

    const findUser = await  db.user.findFirst({
            where : {
                email : email
            }
        });

    if(!findUser){
        res.status(403).json({
            message : `User doen't exist`
        });
        return;
    }

    // const hashpassword = await bcrypt.hash(password, 3);
    const comapre = await bcrypt.compare(password, findUser.password);

    if(!comapre){
         res.status(403).json({
            message : `Invalid password`
        });
        return;
    }

    // cretae a jwt token and return it to user
    const  token = sign({userId : findUser.id}, JWT_SECRET, {
        expiresIn : "7d"
    });

    res.cookie("token", token, {
    httpOnly: true,                                  // JS can't read it
    secure: process.env.NODE_ENV === "production",   // HTTPS only in prod
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,                 // match the JWT expiry
    });

    res.status(200).json(
        {message : "Success", user : { id: findUser.id, email: findUser.email, username: findUser.username } }
    );

});

AuthRouter.post("/signout", async (req : Request, res : Response)=>{
    if (!req.cookies.token) {
  return res.status(200).json({ message: "Already logged out" });
}
        res.clearCookie('token', {
             httpOnly : true,
             secure: process.env.NODE_ENV === "production",
             sameSite : "lax"
        });

        res.json({
            message : "Logged out"
        });
    }
);


// add a middleware and good to go
AuthRouter.get("/me", Middleware, async (req : Request,  res : Response)=>{
    
    try{
        const userinfo = await db.user.findUnique({
     where: { id: req.userId },
     select: { id: true, email: true, username: true },
   });
        // Omit password ? 
        // Why include game member here with prisma
        // TODO
        
        res.status(200).json({
            message : "Success",
            User : userinfo
        });
    }
    catch(e){
        res.status(400).json({
            message : "Error",
            User : e
        });
    };

});