import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalForm from './components/GoalForm';
import ColorPalette from './components/ColorPalette';

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        setHealthStatus(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error('Error checking health status:', error);
        setHealthStatus('Unable to connect to server');
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="text-center">
      <header className="bg-drift-blue min-h-[30vh] flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-5xl font-bold m-0 tracking-wide">Drift</h1>
        <p className="text-xl opacity-90 my-2">Break down your goals, achieve more.</p>
        {loading ? (
          <p className="text-lg">Checking server status...</p>
        ) : (
          <p className="text-lg">Server status: {healthStatus}</p>
        )}
      </header>
      <main className="p-4 max-w-7xl mx-auto">
        <ColorPalette />
        <GoalForm />
      </main>
    </div>
  );
}

export default App;
