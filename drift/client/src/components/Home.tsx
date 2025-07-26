import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import DriftLogo from '../assets/drift_logo.svg';

// Floating Boat Animation Component
const FloatingBoat = () => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Wind effects */}
      <div className="absolute z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/4 w-16 h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-windGust1"></div>
        <div className="absolute right-5 top-1/3 w-12 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-windGust2"></div>
        <div className="absolute left-10 top-2/3 w-14 h-[1px] bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-windGust3"></div>
      </div>
      
      {/* Boat with wind-drift animation */}
      <div className="relative animate-windDrift">
        <img src={DriftLogo || "/placeholder.svg"} alt="Drift logo" className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40" />
      </div>
      
      {/* Natural water with curved edges */}
      <div className="w-full -mt-2 sm:-mt-3 md:-mt-4 overflow-visible">
        {/* Organic water surface with irregular edges */}
        <div className="relative h-2 sm:h-3 overflow-visible">
          {/* Main water curve */}
          <div className="absolute left-1/2 -translate-x-1/2 w-32 sm:w-40 md:w-48 h-2 sm:h-3 overflow-hidden">
            <div className="w-full h-4 sm:h-6 rounded-[100%] bg-gradient-to-b from-white/10 to-transparent"></div>
          </div>
          
          {/* Irregular ripple effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-44 md:w-52">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-[100%] animate-ripple transform-gpu"></div>
          </div>
          
          {/* Smaller natural waves */}
          <div className="absolute top-1 left-[40%] w-12 sm:w-16 h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-tinyWave1"></div>
          </div>
          <div className="absolute top-1 right-[42%] w-10 sm:w-14 h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full animate-tinyWave2"></div>
          </div>
          
          {/* Small glistening highlights */}
          <div className="absolute top-0 left-[30%] w-1 h-1 bg-white/40 rounded-full animate-glisten1"></div>
          <div className="absolute top-1 right-[35%] w-[2px] h-[2px] bg-white/50 rounded-full animate-glisten2"></div>
        </div>
        
        {/* Boat reflection with natural water distortion */}
        <div className="relative flex justify-center -mt-1 sm:-mt-2">
          {/* The reflection itself */}
          <div className="animate-reflectionWind">
            <img 
              src={DriftLogo || "/placeholder.svg"} 
              alt="Reflection" 
              className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 scale-y-[-1] opacity-40 blur-[1px]" 
            />
          </div>
          
          {/* Water movement lines */}
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full animate-waveSlowA"></div>
            <div className="h-[1px] w-3/4 mx-auto bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-full animate-waveSlowB"></div>
            <div className="h-[1px] w-4/5 ml-auto bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-waveFast"></div>
            <div className="h-[1px] w-2/3 mr-auto bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full animate-waveMed"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-drift-blue/95 to-drift-purple/95 backdrop-blur-md border-b border-white/20 shadow-xl fixed top-0 left-0 right-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-tight drop-shadow-lg">
              Drift
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
              <Link 
                to="/login" 
                className="text-white/95 hover:text-drift-orange transition-all duration-300 font-medium px-2 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-white/15 backdrop-blur-sm drop-shadow-sm text-sm md:text-base"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-drift-orange hover:bg-orange-600 text-white px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300 flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-3 pt-2 border-t border-white/20">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="text-white/95 hover:text-drift-orange transition-all duration-300 font-medium px-3 py-2.5 rounded-lg hover:bg-white/15 text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-drift-orange hover:bg-orange-600 text-white px-3 py-2.5 rounded-lg font-semibold transition-all duration-300 text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow overflow-x-hidden mb-0">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-drift-blue via-drift-purple to-drift-blue pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 sm:top-5 sm:left-5 md:top-10 md:left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-white rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 md:bottom-10 md:right-10 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-drift-orange rounded-full blur-2xl sm:blur-3xl"></div>
          </div>
          
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Text content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent px-2 sm:px-0">
                  Stay on Track with Drift
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed text-white/90 px-3 sm:px-4 lg:px-0">
                  Drift breaks your big goals into small, actionable steps and creates a clear daily schedule, making it easier to stay on track and achieve success step by step.
                </p>
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 md:gap-6 justify-center lg:justify-start items-center px-3 sm:px-0">
                  <Link 
                    to="/register" 
                    className="w-full sm:w-auto bg-drift-orange hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 min-w-[200px] sm:min-w-[180px]"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 border-2 border-white/40 hover:border-white/60 min-w-[200px] sm:min-w-[180px] shadow-lg hover:shadow-xl flex items-center justify-center text-center"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Right side - Floating Boat Animation */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="scale-75 sm:scale-90 lg:scale-100">
                  <FloatingBoat />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 bg-gradient-to-br from-slate-100 via-gray-200 to-slate-200 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-drift-blue/[0.03] to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-drift-orange/[0.04] to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-drift-purple/[0.03] to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-1/3 w-72 h-72 bg-gradient-to-br from-drift-pink/[0.02] to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-1/3 w-56 h-56 bg-gradient-to-br from-drift-mauve/[0.03] to-transparent rounded-full blur-3xl"></div>
          </div>
          
          {/* Subtle overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20"></div>
          
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-drift-blue mb-3 sm:mb-4 md:mb-6 px-2 sm:px-0">
                How Drift Helps You Succeed
              </h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-3 sm:px-0">
                Transform your ambitions into achievements with our proven three-step approach
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-white via-gray-50/50 to-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-gray-200/50 backdrop-blur-sm mx-2 sm:mx-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-drift-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-drift-purple group-hover:text-drift-blue transition-colors duration-300">Break Down Goals</h3>
                  <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Turn big ambitions into small, actionable steps that you can accomplish one at a time with confidence.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-white via-gray-50/50 to-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 border border-gray-200/50 backdrop-blur-sm mx-2 sm:mx-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-drift-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-drift-purple group-hover:text-drift-blue transition-colors duration-300">Smart Scheduling</h3>
                  <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Our intelligent system creates a personalized timetable based on your availability and priorities.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-white via-gray-50/50 to-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-gray-200/50 backdrop-blur-sm mx-2 sm:mx-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-drift-mauve/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-drift-purple group-hover:text-drift-blue transition-colors duration-300">Track Progress</h3>
                  <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Monitor your achievements, adjust as needed, and stay motivated with beautiful progress visualization.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-white via-gray-50/50 to-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 border border-gray-200/50 backdrop-blur-sm mx-2 sm:mx-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-drift-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-drift-purple group-hover:text-drift-blue transition-colors duration-300">Achievement Archive</h3>
                  <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Celebrate and review your completed goals in a dedicated archive that showcases your journey and success milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

                {/* CTA Section */}
        <section className="bg-gradient-to-r from-drift-blue to-drift-purple py-10 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0">
                Ready to Transform Your Goals?
              </h2>
              <div className="relative">
                {/* Glowing effects */}
                <div className="absolute inset-0 rounded-full bg-white/10 blur-md animate-glow"></div>
                
                {/* Sparkles */}
                <div className="absolute -top-2 left-1/4 w-1 h-1 bg-white rounded-full animate-sparkle1"></div>
                <div className="absolute -top-3 left-2/3 w-2 h-2 bg-white rounded-full animate-sparkle2"></div>
                <div className="absolute -bottom-2 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-sparkle3"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-sparkle1" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle2" style={{animationDelay: '3s'}}></div>
                
                {/* Button itself */}
                <Link 
                  to="/register" 
                  className="relative inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-drift-orange hover:bg-orange-600 text-white rounded-full text-sm sm:text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-orange-500/30 mx-2 sm:mx-0 border-4 border-white/20 hover:border-white/40 z-10 group"
                >
                  <span className="text-center leading-tight relative z-10 group-hover:scale-105 transition-transform duration-300">Begin Your<br />Drift</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-drift-pink/40 via-drift-purple/30 to-drift-orange/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-6 sm:py-8 md:py-12 -mt-4">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-500">Drift</div>
            <p className="text-gray-500 text-xs sm:text-sm">© {new Date().getFullYear()} Drift App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 