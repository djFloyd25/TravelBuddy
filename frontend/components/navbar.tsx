import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full px-4 sm:px-6 lg:px-10 py-4 bg-transparent shadow-none text-white">
      <div className="mx-auto w-full max-w-screen-2xl grid grid-cols-3 items-center">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2 justify-self-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="TravelBuddy logo" className="h-8 w-8" />
            <span className="text-xl font-semibold tracking-tight">TravelBuddy</span>
          </Link>
        </div>

        {/* Center: Navigation */}
  <ul className="hidden md:flex items-center gap-6 lg:gap-10 xl:gap-14 justify-self-center">
          <li><Link href="/" className="text-sm font-medium hover:opacity-80 transition-opacity">Home</Link></li>
          <li><Link href="/explore" className="text-sm font-medium hover:opacity-80 transition-opacity">Explore</Link></li>
          <li><Link href="/trips" className="text-sm font-medium hover:opacity-80 transition-opacity">Trips</Link></li>
          <li><Link href="/about" className="text-sm font-medium hover:opacity-80 transition-opacity">About</Link></li>
          <li><Link href="/contact" className="text-sm font-medium hover:opacity-80 transition-opacity">Contact</Link></li>
        </ul>

        {/* Right: Call to Action */}
        <div className="flex items-center justify-self-end">
          <Link
            href="/start-trip"
            className="inline-flex items-center rounded-sm bg-[#ff3700] text-white px-3 sm:px-4 py-2 text-sm font-semibold hover:opacity-90 transition-colors"
            aria-label="Start a trip"
          >
            Start a trip
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
