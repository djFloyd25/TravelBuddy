"use client";
import Navbar from "@/components/navbar";
import LiquidEther from "@/styles/LiquidEther";
import BlurText from "@/styles/BlurText";



export default function Home() {

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10">
        <LiquidEther
          colors={['#755bff', '#ffb3fc', '#c7b7ff']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Foreground content */}
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow text-white">
        <BlurText
          text="Welcome to Travel Buddy"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-5xl font-bold mb-4"
        />
        <BlurText
          text="Connecting people through meaningful journeys."
          delay={300}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-lg opacity-90"
        />
      </section>
    </main>
  );
}


