import express from "express";
import cors from "cors";
import { AuthRouter } from "./routes/auth/auth";
import gameRouter from "./routes/game/game";
import { Middleware } from "./middleware/Authmiddleware";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(cookieParser());

app.use("/api/v1/auth",AuthRouter);
app.use("/api/v1/games", Middleware, gameRouter);

app.get("/health", (req : Request, res : Response)=>{
    res.send("Working and healthy!");
})

app.listen(8080, ()=>{
    console.log(`listening on port ${8080}`);
});