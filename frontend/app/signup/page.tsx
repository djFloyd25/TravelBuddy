"use client";
// Update the import path to match the actual file location and filename
import SignupCard from "@/components/signup";



export default function Signup() {

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 p-4"> 
        <SignupCard />
    </main>
  );
}