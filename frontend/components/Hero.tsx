"use client";
import React from 'react';
import BlurText from '@/styles/BlurText';
import CircularGallery from '@/styles/CircularGallery'

type HeroProps = {
  heading: string;
  subheading: string;
  images?: string[];
};

export default function Hero({ heading, subheading, images }: HeroProps) {
  const handleAnimationComplete = () => {
    // eslint-disable-next-line no-console
    console.log('Hero animation completed');
  };

  return (
    <section className="relative w-full flex-1">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center pl-6 lg:pl-10 py-12 lg:py-16">
        {/* Left: Text */}
        <div className="text-white">
          <BlurText
            text={heading}
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl sm:text-5xl font-bold mb-4"
          />
          <BlurText
            text={subheading}
            delay={300}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-base sm:text-lg opacity-90"
          />
        </div>

        {/* Right: Image scroller aligned to right */}
        <div className="relative hidden md:block justify-self-end h-[360px] lg:h-[460px] xl:h-[540px] w-full md:w-[500px] lg:w-[620px] xl:w-[700px] 2xl:w-[760px] ">
          <CircularGallery bend={0} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} wobbleAmplitude={0.1} snap={true} />
        </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    </section>
  );
}
