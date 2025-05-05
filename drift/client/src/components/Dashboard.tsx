import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    setUsername(name || 'User');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-drift-blue">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-drift-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-drift-mauve mb-6">
          Hello, {username}!
        </h2>
        <p className="text-center text-gray-600">
          Welcome to your Drift dashboard. Track your goals and progress here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 