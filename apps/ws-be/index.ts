import { WebSocketServer } from "ws";
import { verify, type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/utils";
import {db} from "@repo/db";

const WS = new WebSocketServer({
    port : 8080
});

WS.on("connection", async (ws, req)=>{
    const token = req.url?.split("?token")[1];
    
    if(!token){
        ws.close();
        return;
    }

    let decoded;
    
    try{
        decoded = verify(token, JWT_SECRET) as JwtPayload;
    }
    catch(error){
        console.log("Verfication failed!");
        ws.close();
        return;
    };
    

    type User = {
        id : String;
        name : String;
        email : String;
        ws : WebSocket
    };

    const OnlineUsers : Map<string, User> = new Map();
 
    const user = await db.orm.public.User.where({id : decoded.userId}).first();
    if(!user){
        ws.close();
        return;
    }



    OnlineUsers.set(decoded.userId, {
        id : user?.id,
        name : user?.username,
        email : user?.email,
        ws : ws  // TODO
    });

    // Broadcast all the users
    WS.clients.forEach((wss)=>{
        // wss.send(JSON.stringify(OnlineUsers));
        wss.send(JSON.stringify({
            type : "ONLINE_USERS",
            users : Array.from(OnlineUsers)
        }));
    });

    // const games = new Map();
    ws.on("message", (event)=>{
        try{
        const data = JSON.parse(event.toString());
        
        // Creating a game
        if(data.type == "CREATE"){
           games.set(
             {
              members : [{id : user.id, name : user.username}],
              adminId : user.id,
              status : "SEARCHING",
              questions : [],
              answers :  []
             },
           );
        };

        // Sending game status to everyone to find one user to play with
        WS.clients.forEach((ws)=>{
            ws.send(JSON.stringify({
                type : "GAME_REQUEST",
                data  : {
                    username : user.username
                }
            }))
        });
    

        }
        catch(e){

        };
    });
});