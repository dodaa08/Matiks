import { Input } from "@/components/ui/input";
import { dummyOnlineUsers } from "../dashboard/dummy";
import { DotPattern } from "@/components/ui/dot-pattern";

const Game = () =>{
    return<>
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-2">
      
            <div className="flex w-full flex-row justify-between">

            <div className="flex flex-col items-center space-y-2">
                <img src={dummyOnlineUsers[0].image} className="size-17 rounded-full"/>
                <h1 className="text-center text-lg text-sidebar-foreground">{dummyOnlineUsers[0].name}</h1>
            </div>

              <div className="flex flex-col space-y-2">
                <img src={dummyOnlineUsers[4].image} className="size-17 rounded-full"/>
                <h1 className="text-lg text-center text-sidebar-foreground">{dummyOnlineUsers[1].name}</h1>
            </div>
        </div>

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