import { Request, Response } from "express";
import { InferenceClient } from "@huggingface/inference";
import Schedule from "../models/Schedule";

const HF_API_TOKEN = process.env.HF_API_TOKEN;

const client = new InferenceClient(HF_API_TOKEN);

export const generateSchedule = async (req: Request, res: Response) => {
  const { goal, startDate, endDate, intensity } = req.body;
  if (!goal || !startDate || !endDate || !intensity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Override startDate to today (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split("T")[0];

  // Compose a prompt for the AI model
  //   const prompt = `Create a detailed schedule to achieve the following goal: "${goal}".
  // Start date: ${startDate}
  // End date: ${endDate}
  // Intensity: ${intensity}
  // Please break down the goal into actionable steps and distribute them over the given time period.`;

  const prompt = `

You are a daily goal planner AI.

Based on the following:

Goal: ${goal}
Start Date: ${todayDate}
End Date: ${endDate}
Intensity: ${intensity}

Generate a day-by-day schedule from start to end date.

Each day must include 1–4 specific tasks, depending on intensity:

- Casual: 1–2 light tasks/day
- Moderate: 2–3 moderate tasks/day
- Intense: 3–4 challenging tasks/day

Format the output as:
DayOfWeek, Month Day|task|task|...;

Use this format exactly—no JSON, no markdown, no extra text.

Tasks must be helpful, clear, short, concise and goal-oriented.
Only return the schedule.

For example:
Monday, May 26|Research topic|Draft outline|Read supporting material;
Tuesday, May 27|Write intro|Revise outline;
Wednesday, May 28|Complete first draft|Peer review;
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

    const rawOutput =
      chatCompletion.choices?.[0]?.message?.content || "No schedule returned";

    const thinkEndIndex = rawOutput.indexOf("</think>");
    const schedule =
      thinkEndIndex !== -1
        ? rawOutput.slice(thinkEndIndex + "</think>".length).trim()
        : rawOutput.trim();

    // Save to MongoDB
    await Schedule.create({
      userId: req.user?._id,
      goal,
      startDate: todayDate,
      endDate,
      intensity,
      rawSchedule: schedule,
    });

    res.json({ schedule });
  } catch (error: any) {
    console.error("Hugging Face API error:", error);
    res
      .status(500)
      .json({ message: "Hugging Face API error", error: error.message });
  }
};
