import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateSchedule = async (
  goal: string,
  startDate: string,
  endDate: string,
  intensity: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/huggingface/schedule`, {
      goal,
      startDate,
      endDate,
      intensity,
    });
    return response.data.schedule;
  } catch (error) {
    return 'Failed to generate schedule.';
  }
};