import { Request, Response } from 'express';
import axios from 'axios';

const HF_API_TOKEN = process.env.HF_API_TOKEN || 'token stored in env';

export const generateSchedule = async (req: Request, res: Response) => {
  const { goal, startDate, endDate, intensity } = req.body;
  if (!goal || !startDate || !endDate || !intensity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Compose a prompt for the AI model
  const prompt = `Create a detailed schedule to achieve the following goal: "${goal}".
  Start date: ${startDate}
  End date: ${endDate}
  Intensity: ${intensity}
  Please break down the goal into actionable steps and distribute them over the given time period.`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bigscience/bloomz-560m', // Or another text-generation model
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ schedule: response.data[0]?.generated_text || 'No schedule returned' });
  } catch (error: any) {
    res.status(500).json({ message: 'Hugging Face API error', error: error.message });
  }
};