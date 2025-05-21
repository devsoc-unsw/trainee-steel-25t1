import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GoalFormData {
  objective: string;
  deadline: string;
  dedication: string;
}

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [formData, setFormData] = useState<GoalFormData>({
    objective: '',
    deadline: '',
    dedication: ''
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in localStorage temporarily
    localStorage.setItem('goalData', JSON.stringify(formData));
    // Navigate to schedule page (to be implemented)
    navigate('/schedule');
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
      
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-center text-drift-mauve mb-6">
          Hello, {username}!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Let's create a personalized schedule to help you achieve your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-drift-blue">Let's Get Started</h3>
          
          <div className="space-y-2">
            <label htmlFor="objective" className="block text-lg font-medium text-gray-700">
              1. What do you want to achieve?
            </label>
            <textarea
              id="objective"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-drift-blue focus:border-drift-blue"
              rows={3}
              placeholder="Describe your goal in detail..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-lg font-medium text-gray-700">
              2. When do you want to achieve this by?
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-drift-blue focus:border-drift-blue"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dedication" className="block text-lg font-medium text-gray-700">
              3. How dedicated are you?
            </label>
            <select
              id="dedication"
              name="dedication"
              value={formData.dedication}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-drift-blue focus:border-drift-blue"
            >
              <option value="">Select your dedication level</option>
              <option value="casual">Casual - I can spare a few hours per week</option>
              <option value="moderate">Moderate - I can work on this regularly</option>
              <option value="serious">Serious - This is a top priority for me</option>
              <option value="intense">Intense - I'm fully committed to this goal</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-drift-mauve hover:bg-purple-700 text-white py-3 px-6 rounded-md text-lg font-medium transition-colors duration-200"
          >
            Make it happen
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard; 