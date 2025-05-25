import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateSchedule = async (
  goal: string,
  startDate: string,
  endDate: string,
  intensity: string
): Promise<{ schedule: string; scheduleId: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/huggingface/schedule`, {
      goal,
      startDate,
      endDate,
      intensity,
    });
    // Return the whole response object
    return {
      schedule: response.data.schedule,
      scheduleId: response.data.scheduleId,
    };
  } catch (error) {
    return { schedule: 'Failed to generate schedule.', scheduleId: '' };
  }
};