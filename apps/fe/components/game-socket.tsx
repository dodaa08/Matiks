"use client";
import { useGame } from "@/store/game";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
            case "STOPPED":
                useGame.getState().reset();
                break;
        }
    });

    socket.onclose = (e)=>{
         if (e.code === 1008) router.replace("/");
    };

    return () => socket.close();
    }, [router]);

    useEffect(() => {
    if (status === "SEARCHING" && pathname !== "/game/wating") router.push("/game/wating");
    else if (status === "RUNNING" && pathname !== "/game") router.replace("/game");
    else if (status === "IDLE" && (pathname === "/game/wating" || pathname === "/game"))
      router.replace("/dashboard");
  }, [status, pathname, router]);
  
  return null;

};