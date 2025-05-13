import React, { useEffect, useState } from 'react';

// Modern illustrations for features
function MatrixIllustration() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" className="w-full h-auto">
      <rect x="10" y="10" width="140" height="75" fill="#DBEAFE" rx="6" />
      <rect x="170" y="10" width="140" height="75" fill="#DCFCE7" rx="6" />
      <rect x="10" y="95" width="140" height="75" fill="#F3F4F6" rx="6" />
      <rect x="170" y="95" width="140" height="75" fill="#FEF3C7" rx="6" />
      <rect x="25" y="25" width="110" height="10" fill="#93C5FD" rx="2" />
      <rect x="25" y="45" width="90" height="10" fill="#93C5FD" rx="2" />
      <rect x="185" y="25" width="110" height="10" fill="#86EFAC" rx="2" />
      <rect x="185" y="45" width="90" height="10" fill="#86EFAC" rx="2" />
      <rect x="25" y="110" width="110" height="10" fill="#D1D5DB" rx="2" />
      <rect x="25" y="130" width="90" height="10" fill="#D1D5DB" rx="2" />
      <rect x="185" y="110" width="110" height="10" fill="#FCD34D" rx="2" />
      <rect x="185" y="130" width="90" height="10" fill="#FCD34D" rx="2" />
    </svg>
  );
}

function MatrixMockupSVG() {
  // Stylized SVG mockup of the actual matrix UI
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto">
      <rect x="0" y="0" width="400" height="240" rx="28" fill="#fff" filter="url(#shadow)" />
      <g>
        {/* Quadrant backgrounds */}
        <rect x="24" y="24" width="164" height="84" rx="12" fill="#DBEAFE" />
        <rect x="212" y="24" width="164" height="84" rx="12" fill="#DCFCE7" />
        <rect x="24" y="132" width="164" height="84" rx="12" fill="#F3F4F6" />
        <rect x="212" y="132" width="164" height="84" rx="12" fill="#FEF3C7" />
        {/* Task bars */}
        <rect x="44" y="44" width="120" height="14" rx="4" fill="#3B82F6" />
        <rect x="44" y="66" width="90" height="10" rx="3" fill="#60A5FA" />
        <rect x="232" y="44" width="120" height="14" rx="4" fill="#22C55E" />
        <rect x="232" y="66" width="90" height="10" rx="3" fill="#6EE7B7" />
        <rect x="44" y="152" width="120" height="14" rx="4" fill="#9CA3AF" />
        <rect x="44" y="174" width="90" height="10" rx="3" fill="#D1D5DB" />
        <rect x="232" y="152" width="120" height="14" rx="4" fill="#F59E0B" />
        <rect x="232" y="174" width="90" height="10" rx="3" fill="#FDE68A" />
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="400" height="240" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2563eb" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
}

function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
      <circle cx="32" cy="32" r="28" fill="#2563eb" />
      <path d="M20 34l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage({ onLoginClick, onRegisterClick }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the viewport is mobile sized
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-10 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Logo />
            <span className="text-xl sm:text-2xl font-bold text-blue-700 tracking-tight select-none">Task Matrix</span>
          </div>
          <button
            onClick={onLoginClick}
            className="bg-white border border-blue-600 text-blue-700 font-semibold px-5 py-2 rounded-xl transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
            aria-label="Sign in"
          >
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <main className={`flex flex-1 flex-col ${isMobile ? '' : 'lg:flex-row lg:items-center lg:justify-between'} gap-8`}>
          {/* Left: Text */}
          <section className="flex-1 flex flex-col justify-center max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
              Take Control of Your Time and Tasks.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-7 max-w-lg" style={{lineHeight: '1.6', letterSpacing: '0.01em'}}>
              The <span className="text-blue-700 font-semibold">Eisenhower Matrix</span> empowers you to prioritize effectively. Sort tasks by urgency and importance, making sure your energy goes where it matters most.
            </p>
            <button
              onClick={onRegisterClick}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-7 rounded-2xl shadow-lg transition-all text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Start prioritizing now"
            >
              Start Prioritizing Now
            </button>
          </section>

          {/* Right: Matrix Mockup */}
          <section className={`flex-1 flex items-center justify-center ${isMobile ? 'mt-12' : ''}`} aria-hidden="true">
            <MatrixMockupSVG />
          </section>
        </main>
      </div>
    </div>
  );
} 