"use client";
import React, { useEffect, useRef, useState } from "react";

type Step = {
  title: string;
  description: string;
  image: string;
};

type HowItWorksProps = {
  heading?: string;
  steps?: Step[];
};

const defaultSteps: Step[] = [
  {
    title: "Plan your trip",
    description:
      "Create a trip, add users, and take surveys to gather preferences and interests.",
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Book with ease",
    description:
      "Lock in stays and experiences seamlessly. Keep all your reservations organized in one place.",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Enjoy the journey",
    description:
      "Navigate with real-time tips and offline access. Share memories and highlights along the way.",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

export default function HowItWorks({
  heading = "Plan your trip in 3 easy steps",
  steps = defaultSteps,
}: HowItWorksProps) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(idx);
        },
        {
          root: null,
          threshold: 0.4,
          rootMargin: "-10% 0px -40% 0px",
        }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [steps.length]);

  return (
    <section id="how-it-works" className="bg-white text-black">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center">
          {heading}
        </h2>

        {/* Timeline with per-step images */}
        <ol className="space-y-16">
          {steps.map((s, i) => (
            <li key={i} ref={(el) => { itemRefs.current[i] = el; }} className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
                {/* Left: Step text with timeline indicator */}
                <div className="relative pl-10">
                  <span className="absolute left-0 top-1.5 bottom-0 w-px bg-gray-200" aria-hidden />
                  <span
                    className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                      i <= active ? "bg-black border-black" : "bg-white border-gray-300"
                    }`}
                  />
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Step {i + 1}
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-1">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-700 max-w-prose">
                    {s.description}
                  </p>
                </div>

                {/* Right: Step image */}
                <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] md:h-[300px] lg:h-[360px]">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
