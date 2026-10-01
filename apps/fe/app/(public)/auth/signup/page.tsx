"use client";

import { SignupForm } from "@/components/signup-form"
import { useState } from "react";
import axios from "axios";

export default function signup() {
   const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e : React.FormEvent)=>{
    e.preventDefault();
    setError("");
    setLoading(true);

      try {
      await axios.post("http://localhost:8080/api/v1/auth/signup", {
        email,
        username,
        password,
      });

      setEmail("");
      setUsername("");
      setPassword("");

      alert("Signup done!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Signup failed");
      } else {
        setError("Something went wrong");
        alert("Something went wrong")
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSubmit} isPending={isLoading} error={error} email={email} password={password} setEmail={setEmail} setPassword={setPassword} username={username} setUsername={setUsername} />
       </div>
    </div>
  )
}
