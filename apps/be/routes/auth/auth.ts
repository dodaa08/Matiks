import express from "express";
import type { Request, Response } from "express";
import  {db} from "@repo/db";
import  {SignUpSchema, SignInSchema,zodError} from "@repo/common";
import bcrypt, { hash } from "bcryptjs";
import  {sign} from "jsonwebtoken";
import  dotenv from "dotenv";
dotenv.config();

const AuthRouter = express.Router();
const JWT_SECRET = process.env.JWTTOKEN || "No token";
 
AuthRouter.post("/signup",  async (req : Request, res : Response)=>{
    const {success, data, error} = SignUpSchema.safeParse(req.body);
    if(!success){ 
        res.status(403).json({
            message : `${zodError({error})}`
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
    const {success, data, error} = SignUpSchema.safeParse(req.body);
    if(!success){ 
        res.status(403).json({
            message : `${zodError({error})}`
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
AuthRouter.get("/me", async (req : Request,  res : Response)=>{
    const username = req.body;

    const userinfo =  await db.orm.public.User.where({username}).first();
    
    return res.status(200).json({
        message : "",
        Name : userinfo?.username,
        Email : userinfo?.email
    });

});