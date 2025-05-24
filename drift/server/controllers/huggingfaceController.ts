import { Request, Response } from 'express';
import { InferenceClient } from "@huggingface/inference";

const HF_API_TOKEN = process.env.HF_API_TOKEN || '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';

const client = new InferenceClient(HF_API_TOKEN);

export const generateSchedule = async (req: Request, res: Response) => {
  const { goal, startDate, endDate, intensity } = req.body;
  if (!goal || !startDate || !endDate || !intensity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Override startDate to today (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split('T')[0];;



  // Compose a prompt for the AI model
//   const prompt = `Create a detailed schedule to achieve the following goal: "${goal}".
// Start date: ${startDate}
// End date: ${endDate}
// Intensity: ${intensity}
// Please break down the goal into actionable steps and distribute them over the given time period.`;

const prompt = `

Important Output Instructions:

Do ALL of your thinking behind the scene, I only want to see the final output of JSON objects

DO NOT include any explanation, preamble, or commentary.

ONLY return a raw JSON array of daily plans.

No markdown formatting 

Each date must be accurate based on the real calendar.

Assume the user is fully aware of the goal difficulty. Just generate the best possible schedule for the timeframe.


I want you to act as a daily goal planner AI assistant.
Based on the following user input:

Goal: ${goal}

Start Date: ${todayDate}

End Date: ${endDate}

Intensity Level: ${intensity}

Please create a comprehensive daily schedule, broken down Monday to Sunday, from the start date to the end date. Each day should have 2–4 small, specific tasks designed to help the user progressively achieve the goal.

The intensity level affects how demanding or time-consuming the tasks should be.

Low: 1–2 light, manageable tasks per day

Medium: 2–3 moderately challenging tasks

High: 3–4 challenging tasks requiring more time and effort

Important Output Format:

The output must be in pure JSON object format, one JSON object per day.

Each object should have a "date" field formatted as "DayOfWeek, Month Day", e.g., "Monday, May 26".

Each object should have a "tasks" field, which is a list of individual tasks.

Each task must be in this format:
{"task": "taskDescription", "completion": "false"}

The "completion" field should always be set to "false" by default.

Example Output Structure:
{
  "date": "Monday, May 26",
  "tasks": [
    {"task": "taskDescription", "completion": "false"},
    {"task": "taskDescription", "completion": "false"}
  ]
}
Important Output Instructions (again):

DO NOT include any explanation, preamble, or commentary.

ONLY return a raw JSON array of daily plans.

No markdown formatting 

Each date must be accurate based on the real calendar.

Assume the user is fully aware of the goal difficulty. Just generate the best possible schedule for the timeframe.

`;

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

    const rawOutput = chatCompletion.choices?.[0]?.message?.content || 'No schedule returned';

    // Extract the first JSON array from the output
    const jsonMatch = rawOutput.match(/\[\s*{[\s\S]*?}\s*\]/);
    const schedule = jsonMatch ? jsonMatch[0] : '[]';

    res.json({ schedule });
  } catch (error: any) {
    console.error('Hugging Face API error:', error); 
    res.status(500).json({ message: 'Hugging Face API error', error: error.message });
  }
};