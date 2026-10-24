"use client";
import OnlineUsers from "@/components/onlineUsers";
import CardC from "@/components/card/card";
import { useGame } from "@/store/game";

const Dash = () => {
  const onlineUsers = useGame((e)=>e.onlineUsers);
  const handleStartGame = useGame((e)=>e.startSearch);

  return (
    <>
      <div>
<div className="flex justify-center flex-col space-y-20">
      <div className="flex justify-center">
        <h1 className="text-2xl text-sidebar-foreground">Online Users</h1>
      </div>

      <div className="flex justify-center">
        <OnlineUsers users={onlineUsers} />
      </div>

      <div
        className="flex flex-col justify-center items-center py-30 space-y-10"
        >
         <div className="flex justify-center">
        <h1 className="text-2xl underline text-sidebar-foreground">Games</h1>
      </div>

      <div onClick={() => handleStartGame()}>
        <CardC />
      </div>
      </div>
    </div>
      </div>  
        </>
  );
};

export default Dash;