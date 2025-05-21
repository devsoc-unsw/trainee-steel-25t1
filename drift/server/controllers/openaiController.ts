import { Request, Response } from 'express';
import axios from 'axios';

// Replace with your OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate a personalized schedule based on user goals
 */
export const generateSchedule = async (req: Request, res: Response) => {
  try {
    const { objective, deadline, dedication } = req.body;

    if (!objective || !deadline || !dedication) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: objective, deadline, and dedication are required' 
      });
    }

    // Format the deadline for better readability
    const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a prompt for OpenAI
    const prompt = `Generate a detailed weekly schedule to help someone achieve the following goal:
    
Goal: ${objective}
Deadline: ${formattedDeadline}
Dedication Level: ${dedication}

The schedule should include:
1. Daily tasks and time blocks
2. Weekly milestones
3. Resources they might need
4. Tips for staying motivated
5. How to track progress

Please format the response in a clear, structured way that's easy to follow using markdown formatting.`;

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4-turbo', // You can adjust the model as needed
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates personalized schedules to help people achieve their goals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extract the generated schedule
    const schedule = response.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      schedule
    });
  } catch (error: any) {
    console.error('Error generating schedule:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to generate schedule',
      error: error.message
    });
  }
};

/**
 * Generate a mock schedule (for testing without API key)
 */
export const generateMockSchedule = async (req: Request, res: Response) => {
  try {
    const { objective, deadline, dedication } = req.body;

    if (!objective || !deadline || !dedication) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: objective, deadline, and dedication are required' 
      });
    }

    // Format deadline for display
    const formattedDeadline = new Date(deadline).toLocaleDateString();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock schedule
    const schedule = `## PERSONALIZED SCHEDULE FOR: ${objective}
  
### WEEKLY SCHEDULE

**Monday:**
- 7:00 AM: Morning motivation - review your goal
- 8:00 AM - 9:00 AM: Core work on priority tasks
- 5:00 PM - 6:00 PM: Review progress and plan for tomorrow

**Tuesday:**
- 7:00 AM: Quick morning reflection
- 8:00 AM - 9:00 AM: Deep work session
- 6:00 PM - 7:00 PM: Skill development related to your goal

**Wednesday:**
- 7:00 AM: Mid-week check-in
- 8:00 AM - 9:30 AM: Extended focus session
- 5:00 PM - 6:00 PM: Overcome blockers review

**Thursday:**
- 7:00 AM: Morning motivation
- 8:00 AM - 9:00 AM: Core work on priority tasks
- 6:00 PM - 7:00 PM: Connect with accountability partner

**Friday:**
- 7:00 AM: End of week assessment
- 8:00 AM - 9:00 AM: Final push of the week
- 5:00 PM - 6:00 PM: Weekly review and planning

**Weekend:**
- Flexible 2-hour block for catch-up or getting ahead
- Rest and recharge

### WEEKLY MILESTONES
Week 1: Initial setup and planning
Week 2: Build momentum and establish routine
Week 3: Overcome challenges and adjust approach
Week 4: Final push toward your deadline

### RESOURCES
- Journal for tracking progress
- Timer for focused work sessions
- Dedicated workspace
- Support from friends/family

### STAYING MOTIVATED
- Celebrate small wins daily
- Visualize your goal completion regularly
- Connect your goal to your core values
- Take proper breaks to avoid burnout

This schedule is designed for your ${dedication} dedication level, with your deadline of ${formattedDeadline}.`;

    return res.status(200).json({
      success: true,
      schedule
    });
  } catch (error: any) {
    console.error('Error generating mock schedule:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to generate mock schedule',
      error: error.message
    });
  }
}; 