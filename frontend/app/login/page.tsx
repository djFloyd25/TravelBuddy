"use client";
import LoginCard from "@/components/login";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const {error} = await supabase.auth.signInWithPassword({email, password});
    if (error){
      console.error("Error logging in:", error.message);
    } else {
      console.log("User logged in successfully!");
      router.push("/dashboard"); // Redirect to home page
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 p-4"> 
        <LoginCard 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
    </main>
  );
}