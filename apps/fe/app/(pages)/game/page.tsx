"use client";
import { Input } from "@/components/ui/input";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useGame } from "@/store/game";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const Game = () =>{
    const game = useGame((e)=>e.game);
    const [timer, setTimer] = useState<number>(0);
    const onlineUsers = useGame((e)=>e.onlineUsers);

    useEffect(()=>{
        if(!game) return;

        const calc = () => {
  const deadline = new Date(game.startedAt).getTime() + game.timelimit * 1000;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
};
setTimer(calc());
const id = setInterval(() => setTimer(calc()), 1000);

        return () => clearInterval(id);
    }, [game]);



return<>
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-2">
      
            <div className="flex w-full flex-row justify-between">

                {
                    game?.members.map((member)=>{
                        const player = onlineUsers.find((e)=>e.id === member.userId);
                        
                          return ( 
                             <div key={member.userId} className="flex flex-col items-center space-y-2">
                <Avatar className="size-17">
                    <AvatarImage src={player?.image} />
                    <AvatarFallback>{player?.name[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <h1 className="text-center text-lg text-sidebar-foreground">{player?.name}</h1>
            </div>

                          )
                        
})
                }

           
        </div>

        <div>{timer}</div>

        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden">
            <DotPattern  />
        </div>


        <div className="flex flex-col justify-center">
         <h1 className="text-center text-sidebar-foreground text-lg">type your answers</h1>
        <Input type="number" className="w-max"/>
        </div>
            </div>
    </>
};

export default Game;