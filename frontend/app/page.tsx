"use client";
import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";



export default function Home() {

  return (
    <main className="relative flex flex-col items-stretch overflow-hidden">
      {/* Hero wrapper with background behind navbar + hero only */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/background.jpg')",
        }}
      >
        <Navbar />
        <Hero
          heading="Welcome to Travel Buddy"
          subheading="Connecting people through meaningful journeys."
          images={["/globe.svg", "/window.svg", "/file.svg", "/vercel.svg", "/next.svg"]}
        />
      </div>

      {/* Following sections have their own backgrounds */}
      <HowItWorks />
    </main>
  );
}


