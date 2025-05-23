import { Request, Response } from 'express';
import { InferenceClient } from "@huggingface/inference";

const HF_API_TOKEN = process.env.HF_API_TOKEN || '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';

const client = new InferenceClient(HF_API_TOKEN);

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
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const message = chatCompletion.choices?.[0]?.message?.content || 'No schedule returned';
    res.json({ schedule: message });
  } catch (error: any) {
    res.status(500).json({ message: 'Hugging Face API error', error: error.message });
  }
};