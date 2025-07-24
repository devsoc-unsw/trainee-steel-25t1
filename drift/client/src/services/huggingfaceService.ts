import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:5000/api';

export const generateSchedule = async (
  goal: string,
  startDate: string,
  endDate: string,
  intensity: string,
  category: string,
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/huggingface/schedule`, {
      goal,
      startDate,
      endDate,
      intensity,
      category,
    });
    return response.data.schedule;
  } catch (error) {
    return 'Failed to generate schedule.';
  }
};