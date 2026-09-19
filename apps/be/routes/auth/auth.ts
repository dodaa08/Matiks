import express from "express";
import type { Request, Response } from "express";
import  {db} from "@repo/db";
import {SignUpSchema, SignInSchema} from "@repo/common";
import bcrypt, { hash } from "bcryptjs";
import  {sign} from "jsonwebtoken";
import {JWT_SECRET} from "./../../utils";
import { Middleware } from "../../middleware/Authmiddleware";

export const AuthRouter = express.Router();
 
AuthRouter.post("/signup",  async (req : Request, res : Response)=>{
    const {success, data, error} = SignUpSchema.safeParse(req.body);
    if(!success){ 
        res.status(403).json({
            message : `${error.flatten().fieldErrors}`
        });
        return;
    }

    const {email, password } = data;

    const findUser = await  db.orm.public.User.where({email}).first();
    if(findUser){
        res.status(403).json({
            message : `User already exist, logIn`
        });
        return;
    }

    const hashpassword = await bcrypt.hash(password, 3);
    
    const username = await email.split("@")[0] || "";
    
    await db.orm.public.User.create({
        email : data.email,
        password : hashpassword,
        username : username
    });

    return res.status(200).json(
        {message : "Success"}
    )

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

    const findUser = await  db.orm.public.User.where({email}).first();
    if(!findUser){
        res.status(403).json({
            message : `User doen't exist`
        });
        return;
    }

    // const hashpassword = await bcrypt.hash(password, 3);
    const comapre = bcrypt.compare(password, findUser.password);

    if(!comapre){
         res.status(403).json({
            message : `Invalid password`
        });
        return;
    }

    // cretae a jwt token and return it to user
    const  token = sign({userId : findUser.id}, JWT_SECRET);
  
    return res.status(200).json(
        {message : "Success", token : token}
    );

});

// add a middleware and good to go
AuthRouter.get("/me", Middleware, async (req : Request,  res : Response)=>{
    
    try{
        const userId = req.userId;
        const userinfo =  await db.orm.public.User.where({ id : userId}).first();
        // Omit password ? 
        // Why include game member here with prisma
        // TODO
        
        return res.status(200).json({
            message : "Success",
            User : userinfo
        });
    }
    catch(e){
        return res.status(400).json({
            message : "Error",
            User : e
        });
    };

});