import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors(
    {
        allowedHeaders: ["GET", "POST", "PUT"],
        origin : "*" 
    }
));

app.listen(8080, ()=>{
    console.log(`listening on port ${8080}`);
})