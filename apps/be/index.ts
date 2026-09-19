import express from "express";
import cors from "cors";
import  dotenv from "dotenv";
dotenv.config();
import { AuthRouter } from "./routes/auth/auth";

const app = express();

app.use(express.json());
app.use(cors(
    {
        allowedHeaders: ["GET", "POST", "PUT"],
        origin : "*" 
    }
));

app.use("/api/v1/auth",AuthRouter);


app.listen(8080, ()=>{
    console.log(`listening on port ${8080}`);
})