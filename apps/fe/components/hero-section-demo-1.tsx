"use client";

import { motion } from "motion/react";
import ModeToggle from "./mode-toggle";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useEffect, useState } from "react";

export default function HeroSectionOne() {
  
  const router = useRouter();
  const [isLoggedIn, setisLoggedIn] = useState<boolean | null>(null);

  useEffect(()=>{
      axios.get("http://localhost:8080/api/v1/auth/me", {withCredentials : true}).then(()=>setisLoggedIn(true)).catch(()=>setisLoggedIn(false));
  }, [router]);

  const LogOut = async ()=>{
      try {
    await axios.post("http://localhost:8080/api/v1/auth/signout", {}, { withCredentials: true });
    setisLoggedIn(false);
    alert("User logged out");
    setTimeout(()=>{
      router.push("/auth/signin");
    }, 3000)
  } catch (err) {
    console.error(err);
  };
  }
  
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Matiks</h1>
      </div>
      <ModeToggle />
     <button
  onClick={() => (isLoggedIn ? LogOut() : router.push("/auth/signin"))}
  className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
>
  {isLoggedIn ? "Logout" : "Login"}
</button>
      
    </nav>
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Sharpen your mind. Beat your rivals."
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Challenge players worldwide in fast-paced math duels. Solve faster,
          climb the leaderboard, build your streak, and turn mental math into
          your favorite game.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth/signin")} className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Play Now
          </button>

        </motion.div>
      </div>
    </div>
  );
}

// const Navbar = () => {
//   const router = useRouter();
//   return (
    
//   );
// };