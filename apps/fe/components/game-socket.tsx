"use client";
import { useGame } from "@/store/game";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
const RESULT_PAGES = ["/game/result", "/game"];

export const GameSocket = ()=>{
    const status = useGame((e)=>e.status);
    const router = useRouter();
    const pathname =usePathname();
    useEffect(()=>{

    const socket = new WebSocket(`ws://localhost:8081`);
    useGame.getState().setSocket(socket);

    socket.onmessage = ((event)=>{
        const msg = JSON.parse(event.data);
        
        switch(msg.type){
            case "ONLINE_USERS":
                useGame.setState({
                    onlineUsers : msg.users
                });
                break;
                
            case "SEARCHING":
                useGame.setState({
                    status: "SEARCHING"
                });
                break;
            case "GAME_START":
                useGame.setState({
                    game : msg.data,
                    scores : [],
                    status : "RUNNING"
                });
                break;
            case "SCORE_UPDATE":
                useGame.setState({
                    scores : msg.data.scores
                })
                break;

            case "ANSWER_RESULT":
                useGame.setState({
                    lastAnswer : msg.data
                })
                break;
            case "ERROR":
                useGame.setState({
                    lastError : msg.message
                })
                break;
            case "STOPPED":
                useGame.setState({ status: "STOPPED", endReason: msg.reason, lastResult: msg.result, game: null, scores: [] })
                break;
        }
    });

    socket.onclose = (e)=>{
         if (e.code === 1008) router.replace("/");
    };

    return () => socket.close();
    }, [router]);


    const GetuserId = async ()=>{
         const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/v1/auth/me`, {
            withCredentials : true
        });

        useGame.getState().setMyUserId(user.data.User.id);
    }
    useEffect(()=>{
        GetuserId().catch(() => {});
    }, []);



    useEffect(() => {
        if (status === "STOPPED" && !RESULT_PAGES.includes(pathname)) {
        useGame.getState().clearResult()
        return;
    }
    if (status === "SEARCHING" && pathname !== "/game/wating") router.push("/game/wating");
    else if (status === "RUNNING" && pathname !== "/game") router.replace("/game");
    else if (status === "STOPPED" ) {
        if (pathname !== "/game/result") router.replace("/game/result");
    }
    else if (status === "IDLE" && (pathname === "/game/wating" || pathname === "/game"))
      router.replace("/dashboard");
  }, [status, pathname, router]);
  
  return null;

};