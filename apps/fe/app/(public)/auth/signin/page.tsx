"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function signin() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async (e : React.FormEvent)=>{
      e.preventDefault(); 
      setisLoading(true);
      setError("");

      try{
         const res : Response = await axios.post("http://localhost:8080/api/v1/auth/signin", {
            email : email,
            password : password 
         }, {
          withCredentials : true
         });
         
         setEmail("");
         setPassword("");
         router.push("/dashboard");                  
      }
      catch(err){
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "SignIn failed");
      } else {
        setError("Something went wrong");
        alert("Something went wrong")
      }
      }
      finally{
        setisLoading(false);
      }
  }
 
  return (
    <div className="flex justify-center min-h-screen items-center">

    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button onClick={()=>router.push("/auth/signup")} variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                  Forgot your password?
                </a>
              </div>
              <Input  value={password}
                onChange={(e)=>setPassword(e.target.value)} id="password" type="password" required />
            </div>
          </div>

            <CardFooter className="flex-col gap-2">
        <Button disabled={isloading} type="submit" className="w-full">
            {
              isloading ? "Signing In user .." : "Sign In"
            }
        </Button>
      </CardFooter>
        </form>
      </CardContent>

      {error && <p className="text-sm text-red-500">{error}</p>}
    
    </Card>
    </div>
  )
}
