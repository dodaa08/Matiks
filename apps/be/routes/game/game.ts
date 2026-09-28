import express from "express";
import type { Request, Response } from "express";
const gameRouter = express.Router();
import { db } from "@repo/db";

const getGameData = async (req : Request, res : Response)=>{
    const {id : gameId} = req.params;

    if (!gameId || Array.isArray(gameId)) {
        res.status(400).json({ message: "Missing or invalid game id" });
        return;
    }

    try{
        const findGame = await db.orm.public.Game.where({ id: gameId }).first();
        
        if(!findGame){
            res.status(404).json({ message: "Game not found" });
            return;
        };

        return res.status(200).json({
            message : "User Found",
            data : findGame
        });
    }
    catch(e){
        console.error("Failed to fetch game:", e);
        res.status(500).json({ message: "Internal server error" });
    }
};



gameRouter.get("/game/:id", getGameData);

export default gameRouter;