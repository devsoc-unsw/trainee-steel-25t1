import React, { useState } from 'react';
import axios from 'axios';

interface GoalFormData {
  title: string;
  description: string;
  steps: string[];
  userId: string;
}

const GoalForm: React.FC = () => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    steps: [''],
    userId: '65f1a1d1e21c912345678901' // Example user ID, in a real app this would come from auth
  });
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/goals', formData);
      setMessage('Goal created successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        steps: [''],
        userId: '65f1a1d1e21c912345678901'
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      setMessage('Failed to create goal. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-drift-purple mb-6 text-center">Create New Goal</h2>
      {message && (
        <div className="p-3 mb-6 rounded bg-green-100 text-green-800 text-center">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-drift-orange"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-drift-orange"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Steps</label>
          {formData.steps.map((step, index) => (
            <div key={index} className="flex mb-3 gap-2">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-drift-orange"
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="bg-drift-pink text-white px-3 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={formData.steps.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="bg-gray-500 text-white px-3 py-2 rounded-md mt-2"
          >
            Add Step
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-drift-blue hover:bg-blue-700 text-white py-3 px-4 rounded-md text-base font-medium transition-colors duration-200 mt-4"
        >
          Create Goal
        </button>
      </form>
    </div>
  );
};

export default GoalForm; 