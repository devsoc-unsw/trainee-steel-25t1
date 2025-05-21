import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMockSchedule } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

interface GoalFormData {
  objective: string;
  deadline: string;
  dedication: string;
}

const Schedule: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [goalData, setGoalData] = useState<GoalFormData | null>(null);
  const [schedule, setSchedule] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get goal data from localStorage
    const storedGoalData = localStorage.getItem('goalData');
    if (!storedGoalData) {
      navigate('/dashboard');
      return;
    }

    const parsedGoalData = JSON.parse(storedGoalData);
    setGoalData(parsedGoalData);
    
    // Generate schedule using OpenAI
    const fetchSchedule = async () => {
      try {
        // Use the mock function for now - replace with real generateSchedule when you have an API key
        const generatedSchedule = await generateMockSchedule(parsedGoalData);
        setSchedule(generatedSchedule);
      } catch (error) {
        console.error('Error generating schedule:', error);
        setSchedule('Failed to generate schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-drift-blue mb-4">Generating Your Schedule...</h2>
        <p className="text-gray-600 mb-6">Please wait while we create your personalized plan</p>
        <div className="w-12 h-12 border-t-4 border-drift-mauve border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-drift-blue mb-6">Your Personalized Schedule</h1>
      
      {goalData && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-drift-mauve mb-4">Goal Summary</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Objective:</span> {goalData.objective}</p>
            <p><span className="font-medium">Target Date:</span> {new Date(goalData.deadline).toLocaleDateString()}</p>
            <p><span className="font-medium">Dedication Level:</span> {goalData.dedication}</p>
          </div>
        </div>
      )}
      
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-drift-blue mb-4">Recommended Schedule</h2>
        <div className="prose max-w-none">
          <ReactMarkdown>{schedule}</ReactMarkdown>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors duration-200"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => {}} // This would save the schedule to backend in future implementation
          className="bg-drift-mauve hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default Schedule; 