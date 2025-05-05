import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-drift-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold text-2xl">Drift</div>
            <div>
              <Link 
                to="/login" 
                className="text-white hover:text-drift-orange transition-colors duration-200 mr-4"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-drift-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-drift-blue to-drift-purple py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Stay on Track with Drift</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Break down your long-term goals into manageable steps and achieve more with personalized schedules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-drift-orange hover:bg-orange-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="bg-white hover:bg-gray-100 text-drift-blue px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-drift-blue">How Drift Helps You Succeed</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-drift-orange rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-drift-purple">Break Down Goals</h3>
                <p className="text-gray-600 text-center">
                  Turn big ambitions into small, actionable steps that you can accomplish one at a time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-drift-pink rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-drift-purple">Auto-Schedule</h3>
                <p className="text-gray-600 text-center">
                  Our smart system creates a personalized timetable based on your availability and priorities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-drift-mauve rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-drift-purple">Track Progress</h3>
                <p className="text-gray-600 text-center">
                  Monitor your achievements, adjust as needed, and stay motivated with visual progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Drift App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 