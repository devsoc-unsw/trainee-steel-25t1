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
    console.log(`🚀 Generating schedule - Category: "${category}", Goal: "${goal}"`);
    const response = await axios.post(`${API_BASE_URL}/huggingface/schedule`, {
      goal,
      startDate,
      endDate,
      intensity,
      category,
    }, {
      timeout: 120000, // 2 minute timeout for AI generation
    });
    console.log('✅ Schedule received from backend');
    return response.data.schedule;
  } catch (error) {
    console.error('❌ Schedule generation failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return 'Schedule generation timed out. Please try again.';
      }
      if (error.response) {
        return `Server error: ${error.response.status}. Please try again.`;
      }
    }
    return 'Failed to generate schedule. Please try again.';
  }
};