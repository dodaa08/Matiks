"use client";
import OnlineUsers from "@/components/onlineUsers"
import { dummyOnlineUsers } from "./dummy";
import CardC from "@/components/card/card";
import { useRouter } from "next/navigation";

const Dash = ()=>{
    const router = useRouter();

    return<> 
    <div className="flex justify-center flex-col space-y-20">
        <div className="flex justify-center">
            <h1 className="text-2xl text-sidebar-foreground">
                Online Users
            </h1>
        </div>

        <div className="flex justify-center">
           <OnlineUsers users={dummyOnlineUsers} />
        </div>

        <div onClick={()=>router.push("/game")}  className="flex justify-center items-center py-30">
           <CardC />
        </div>
    </div>
    </>
};

export default Dash;