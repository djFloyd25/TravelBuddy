import React from 'react';
import ThemeToggle from './ThemeToggle';
import PillNav from '@/styles/PillNav';

const Navbar: React.FC = () => {
  return (
    <>
        <nav className="flex justify-between items-center w-full px-6 py-4 bg-transparent shadow-none">
        <div className="flex items-center gap-4">
            {/* other nav items */}
            <ThemeToggle />
        </div>
        </nav>
    <PillNav
      logo={'/globe.svg'}
            logoAlt="Company Logo"
            items={[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' }
            ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#00000000"
            pillColor="#DE7356"
            hoveredPillTextColor="#f4d6f6"
            pillTextColor="#ffffff"
        />
    </>
  );
};

export default Navbar;
