import axios from 'axios';

interface GoalFormData {
  objective: string;
  deadline: string;
  dedication: string;
}

// API base URL - adjust as needed for your environment
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generates a personalized schedule based on user goals using OpenAI via the server
 */
export const generateSchedule = async (goalData: GoalFormData): Promise<string> => {
  try {
    // Call server endpoint that interfaces with OpenAI
    const response = await axios.post(
      `${API_BASE_URL}/openai/generate-schedule`,
      goalData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    );

    // Return the generated schedule
    return response.data.schedule;
  } catch (error) {
    console.error('Error generating schedule:', error);
    
    // Return a fallback message if the API call fails
    return `We couldn't generate your schedule at this time. Please try again later.
    
Here's what we know about your goal:
- Objective: ${goalData.objective}
- Target date: ${new Date(goalData.deadline).toLocaleDateString()}
- Dedication level: ${goalData.dedication}`;
  }
};

/**
 * Calls the mock schedule generator on the server (for testing without API key)
 */
export const generateMockSchedule = async (goalData: GoalFormData): Promise<string> => {
  try {
    // Call the mock endpoint on the server
    const response = await axios.post(
      `${API_BASE_URL}/openai/generate-mock-schedule`,
      goalData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    );
    
    return response.data.schedule;
  } catch (error) {
    console.error('Error generating mock schedule:', error);
    
    // If there's an error, fall back to a client-side mock
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `## PERSONALIZED SCHEDULE FOR: ${goalData.objective}
  
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

This schedule is designed for your ${goalData.dedication} dedication level, with your deadline of ${new Date(goalData.deadline).toLocaleDateString()}.`;
  }
}; 