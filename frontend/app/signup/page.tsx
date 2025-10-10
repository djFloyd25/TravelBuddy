"use client";
import SignupCard from "@/components/signup";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const {error} = await supabase.auth.signUp({email, password})
    if (error){
      console.error("Error signing up:", error.message)
    } else {
      console.log("User signed up successfully!")
      router.push("/login"); // Redirect to login page
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 p-4"> 
        <SignupCard 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSignup}
        />
    </main>
  );
}