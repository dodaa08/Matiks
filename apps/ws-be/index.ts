import { WebSocketServer, type WebSocket } from "ws";
import { verify, type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/utils";
import { db } from "@repo/db";
import type { GameT, Question, Result, User, EndReason } from "./types";
import { randomUUID } from "crypto";
import { GenerateQuestions, CalAnswer } from "./utils";

const WS = new WebSocketServer({
    port : 8080
});

const OnlineUsers : Map<string, User> = new Map();
const GameState: Map<string, GameT> = new Map();
const UserGames : Map<string, string> = new Map();
const WSConnections : Map<string, WebSocket> = new Map();
const GameAnswers : Map<string, Map<string, Map<string, number>>> = new Map();
const GameTimer : Map <string, NodeJS.Timeout> = new Map();

const send = (userId : string, payload : unknown)=>{
    WSConnections.get(userId)?.send(JSON.stringify(payload));
};

const notifyMembers = (game : GameT, payload : unknown)=>{
    game.gameMembers.forEach((member) => send(member.userId, payload));
};

const correctAnswer = (question : Question) : number =>
    CalAnswer(question.operation, question.NumsToBeUsed);


const handleAnswer = async (userId : string, data : {
    questionId : string , answer : number
})=>{
    
    const gameId = UserGames.get(userId) || "";
    
    // Check if game exists from Gameid
    const game = gameId ? GameState.get(gameId) : undefined;
    if(!game || game.gameStatus != "RUNNING"){
        send(userId, { type: "ERROR", message: "No running game" });
        return;
    }

    // Check if game is running
    const deadline = game.startedAt.getTime() + game.timelimit * 1000;
    
    if(Date.now() > deadline){
        send(userId, { type: "ERROR", message: "Time is up" });
        return;
    };

    const { questionId, answer } = data;
    const question = game.questions.find((q)=>questionId==q.id);
    if(!question){
        send(userId, { type: "ERROR", message: "Question doesn't exist" });
        return;
    };

    const userAnswer = GameAnswers.get(gameId)?.get(userId);
    if(!userAnswer) return;

    const member = game.gameMembers.find((m) => m.userId === userId);
    if (!member) return;

    if (userAnswer.has(questionId)) {
        send(userId, { type: "ERROR", message: "Already answered" });
        return;
    }
   
    const correctVal = correctAnswer(question);
    userAnswer.set(questionId, answer);
    member.questionsAnswered += 1;

    const isCorrect = answer == correctVal;
    if (isCorrect) member.score += 1;
    send(userId, {
        type : "Answer_result",
        data : {questionId, answer, isCorrect, score: member.score}
    });

    notifyMembers(game,{
        data: {
            scores: game.gameMembers.map((m) => ({
                userId: m.userId,
                score: m.score,
                questionsAnswered: m.questionsAnswered,
            })),
        },
    });

    const allDone = game.gameMembers.every(mem=>mem.questionsAnswered >= game.questions.length);
    if(allDone) void EndGame(gameId, "COMPLETED");
};

const StartGame = async (game : GameT)=>{
    game.questions = GenerateQuestions();
    game.gameStatus = "RUNNING";
    game.timelimit = 60;

    try{
        await db.orm.public.Game.create({
            timelimit : game.timelimit,
            gameStatus : game.gameStatus,
            startedAt : Temporal.Now.instant(),
            endAt : null,
            score : 0,
            questions : (q)=> q.create(game.questions.map(({ operation, numOfOprands, NumsToBeUsed }) => ({
                operation, numOfOprands, NumsToBeUsed,
            }))),
            gameMember : (m)=> m.create(game.gameMembers.map((member)=>({
                userId : member.userId,
                result : member.result,
                score : member.score,
                questionsAnswered : member.questionsAnswered,
            }))),
        });
    }
    catch(e){
        console.error("Failed to save game:", e);
    }

    game.gameMembers.forEach((member)=> UserGames.set(member.userId, game.id));

    GameAnswers.set(game.id, new Map(game.gameMembers.map((member)=> [member.userId, new Map<string, number>()])));

    notifyMembers(game, {
        type : "GAME_START",
        data : {
            gameId : game.id,
            timelimit : game.timelimit,
            questions : game.questions,
            members : game.gameMembers.map((member)=> ({ userId : member.userId })),
        },
    });

    GameTimer.set(game.id, setTimeout(()=>{
        void EndGame(game.id, "COMPLETED");
    }, game.timelimit * 1000));
};

const EndGame = async (gameId : string, result : EndReason)=>{
   
        const findGame = GameState.get(gameId);
        if(!findGame){
            return;
        };

        if(findGame.gameStatus === "STOPPED"){
            return;
        };

        findGame.gameStatus = "STOPPED";
        findGame.endAt = new Date();

        const timer = GameTimer.get(gameId);
        
        if(timer){
            clearTimeout(timer);
            GameTimer.delete(gameId);
        };

        const scores = findGame.gameMembers.map(m=>m.score);
        const maxScore = Math.max(...scores);
        const winner = findGame.gameMembers.filter((m)=>m.score == maxScore);
        const isDraw = winner.length > 1;

        findGame.gameMembers.forEach((member)=>{
            member.result = isDraw ? "TIE" : member.score === maxScore ? "WON" : "LOST";
        });

        try{
            await db.orm.public.Game.where({id : gameId}).update({
                gameStatus : findGame.gameStatus,
                endAt :  Temporal.Instant.fromEpochMilliseconds(findGame.endAt.getTime()),
            });

             for (const member of findGame.gameMembers) {
        await db.orm.public.GameMember.where({ id: member.id }).update({
            score: member.score,
            result: member.result,
            questionsAnswered: member.questionsAnswered,
        });
    }
        }
        catch(e){
           console.error("Failed to update game on end:", e);  // log e, not ""
        };
        
        // Notify members
        notifyMembers(findGame, {    
            type : "STOPPED",
            reason : result,
            result : findGame.gameMembers.map(mem=>(
                {
                    userId : mem.userId,
                    scores : mem.score,
                    questionsAnswered : mem.questionsAnswered,
                    result : mem.result
                }
            ))
        });

        // cleanups in mem ds
        findGame.gameMembers.map(member => UserGames.delete(member.userId));
        GameAnswers.delete(gameId);
        GameState.delete(gameId);

    };


WS.on("connection", async (ws, req)=>{

    const token = new URL(req.url ?? "", "http://localhost").searchParams.get("token");

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

    const user = await db.orm.public.User.where({id : decoded.userId}).first();
    if(!user){
        ws.close();
        return;
    };

    WSConnections.set(user.id, ws);

    OnlineUsers.set(user.id, {
        id : user.id,
        name : user.username,
        email : user.email,
    });

    // Broadcast to all
    WS.clients.forEach((wss)=>{
        wss.send(JSON.stringify({
            type : "ONLINE_USERS",
            users : Array.from(OnlineUsers),
        }));
    });

    ws.on("message", async (event)=>{
        try{
            const data = JSON.parse(event.toString());

            if(data.type == "SEARCHING"){
                let JoinedGame : GameT | null = null;
                const gameId = randomUUID();
                for(const game of GameState.values()){
                    if(game.gameStatus === "SEARCHING" && game.gameMembers.length < 2){
                        JoinedGame = game;
                        break;
                    }
                };

                if(JoinedGame){
                    JoinedGame.gameMembers.push({
                        id : randomUUID(),
                        gameId : JoinedGame.id,
                        userId : user.id,
                        questionsAnswered : 0,
                        result : null,
                        score : 0,
                    });
                    console.log(`${user.username} joined game ${JoinedGame.id}`);
                    await StartGame(JoinedGame);
                }
                else{
                    const newGame : GameT = {
                        id : gameId,
                        gameStatus : "SEARCHING",
                        timelimit : 60,
                        adminId : user.id,
                        questions : [],
                        gameMembers : [
                            {
                                id : randomUUID(),
                                gameId : gameId,
                                userId : user.id,
                                result : null,
                                score : 0,
                                questionsAnswered : 0,
                            }
                        ],
                        startedAt : new Date(),
                        endAt : null,
                    };
                    GameState.set(gameId, newGame);
                    UserGames.set(user.id, gameId);
                    ws.send(JSON.stringify({ type: "WAITING_FOR_OPPONENT", data: { gameId } }));
                }
            }
            else if(data.type == "ANSWER"){
                handleAnswer(user.id, data.data);
            };
            
        }
        catch(e){
            console.error("Failed to handle message:", e);
        };
    });

    ws.on("close", (reason : Result)=>{

        OnlineUsers.delete(user.id);
        WSConnections.delete(user.id);

        WS.clients.forEach((wss)=>{
            wss.send(JSON.stringify({
                type : "ONLINE_USERS",
                users : Array.from(OnlineUsers)
            }));
        });

        const gameId = UserGames.get(user.id);
        if (!gameId) return;
        
        const game = GameState.get(gameId);
        if (!game) return;


        send(user.id, {
            message : "Connection Closed",
            reason : reason
        });

        if(game.gameStatus == "SEARCHING"){
            GameState.delete(gameId);
            UserGames.delete(gameId);
        };

        if(game.gameStatus == "RUNNING"){
            void EndGame(gameId, "ABORTED");
        }

        console.log(`${user.username} disconnected`);
    });
});