import { Request, Response } from "express";
import { InferenceClient } from "@huggingface/inference";
import Schedule from "../models/Schedule";
import { addDocs, queryDocs } from "../utils/chromaRAG";
import 'dotenv/config';

// const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;

// const client = new InferenceClient(HUGGINGFACEHUB_API_KEY);

async function enhanceGoal(originalGoal: string, category: string): Promise<string> {
  const enhancementPrompt = `You are a goal enhancement specialist. Your task is to rewrite user goals to be more specific, actionable, and measurable.

ENHANCEMENT RULES:
1. Extract specific numbers, weights, timeframes, current state
2. Add quantifiable metrics and measurements
3. Include progression strategies relevant to the category
4. Remove vague language like "I want to" and replace with specific targets
5. Emphasize the core action/skill being developed
6. Add context about experience level if mentioned
7. Make the goal more compelling and focused

CATEGORY-SPECIFIC ENHANCEMENTS:

FITNESS GOALS:
- Extract current weight/performance and target
- Add specific exercise names and rep ranges
- Include progression increments (e.g., "increase by 5kg weekly")
- Mention technique focus and supporting exercises
- Add nutrition/recovery considerations

STUDY GOALS:
- Specify exact skills, topics, or knowledge areas
- Add measurable outcomes (test scores, certifications)
- Include practice frequency and study methods
- Mention specific resources or materials

WORK GOALS:
- Define specific skills, projects, or achievements
- Add career progression metrics
- Include networking and skill development
- Mention timeline and measurable deliverables

LIFE GOALS:
- Quantify financial, health, or personal targets
- Add specific habits and behaviors
- Include tracking methods and milestones
- Mention support systems or resources needed

EXAMPLES:

Original: "I want to deadlift 300kg, im currently at 270kg, quite expereinced"
Enhanced: "Increase deadlift from current 270kg to 300kg target (30kg progression) over 12-16 weeks using advanced powerlifting techniques, focusing on sumo deadlift form refinement, progressive overload with 2.5-5kg weekly increases, accessory work for posterior chain strength, and optimized recovery protocols for experienced lifter"

Original: "I want to learn Spanish fluently"
Enhanced: "Achieve conversational Spanish fluency (B2 level) within 6 months through daily 45-minute practice sessions, focusing on speaking confidence with native speakers, mastering 2000+ vocabulary words, completing intermediate grammar structures, and passing DELE B2 certification exam"

Original: "I want to get promoted at work"
Enhanced: "Secure senior developer promotion within 8 months by demonstrating technical leadership on 3 major projects, mentoring 2 junior developers, improving code review skills, obtaining cloud certification, and building relationships with engineering management team"

Original: "I want to save money for vacation"
Enhanced: "Save $5000 for European vacation within 10 months by reducing monthly expenses by $300, increasing income through freelance work, tracking all spending via budgeting app, and maximizing high-yield savings account returns"

USER GOAL TO ENHANCE:
"${originalGoal}"

CATEGORY: ${category}

OUTPUT ONLY THE ENHANCED GOAL - NO EXPLANATIONS OR ADDITIONAL TEXT:`;

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b',
        prompt: enhancementPrompt,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.6,
          num_predict: 2000,
          stop: [],
          repeat_penalty: 1.1,
        }
      })
    });

    if (!response.ok) {
      console.warn("Goal enhancement failed, using original goal");
      return originalGoal;
    }

    const data = await response.json();
    let enhancedGoal = data.response?.trim() || originalGoal;
    
    // Filter out the <think> reasoning section (same as main schedule generation)
    const thinkEndIndex = enhancedGoal.indexOf("</think>");
    if (thinkEndIndex !== -1) {
      enhancedGoal = enhancedGoal.slice(thinkEndIndex + "</think>".length).trim();
    }
    
    // Clean up any remaining thinking artifacts
    enhancedGoal = enhancedGoal
      .replace(/^<think>[\s\S]*?<\/think>/g, '') // Remove any remaining think tags (using [\s\S] instead of . with s flag)
      .replace(/^Alright[\s\S]*?vague\./g, '') // Remove thinking introductions
      .replace(/^Let me[\s\S]*?enhance[\s\S]*?:/g, '') // Remove planning statements
      .trim();
    
    // If the result is empty or too short, fallback to original
    if (!enhancedGoal || enhancedGoal.length < 20) {
      enhancedGoal = originalGoal;
    }
    
    console.log("🎯 GOAL ENHANCEMENT:");
    console.log("Original:", originalGoal);
    console.log("Enhanced:", enhancedGoal);
    console.log("========================");
    
    return enhancedGoal;
  } catch (error) {
    console.error("Goal enhancement error:", error);
    return originalGoal; // Fallback to original goal
  }
}

export const generateSchedule = async (req: Request, res: Response) => {  
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`[${requestId}] Starting generateSchedule request`);

  const { goal, startDate, endDate, intensity, category } = req.body;
  if (!goal || !startDate || !endDate || !intensity || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // STEP 1: Enhance the goal to be more specific and actionable
  console.log(`[${requestId}] Enhancing goal...`);
  const enhancedGoal = await enhanceGoal(goal, category);

  // Override startDate to today (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split("T")[0];

  // Calculate total days and create date list
  const start = new Date(todayDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Generate list of dates to ensure model covers all days
  const dateList = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = currentDate.getDate().toString().padStart(2, '0');
    dateList.push(`${dayName} ${monthName} ${dayNumber}`);
  }

  // STEP 2: Use enhanced goal for RAG and schedule generation
  console.log(`[${requestId}] Generating schedule with enhanced goal...`);
  await addDocs();
  const docs = await queryDocs(enhancedGoal, category); // Use enhanced goal for better RAG results
  const rawKnowledge = docs.map((doc: any) => doc.pageContent).join("\n");
  const knowledge = rawKnowledge.length > 800 ? rawKnowledge.substring(0, 800) + "..." : rawKnowledge;

  const prompt = `OUTPUT FORMAT OVERRIDE: You are a schedule generator. Output ONLY schedule lines in the exact format shown. No other text allowed.

  
  CORRECT FORMAT RULES:
  - DayOfWeek MonthName DayNumber|task1|task2|task3;###
  - Each task must be specific and actionable
  - Include exact quantities, numbers, measurements
  - Use action verbs: Eat, Consume, Track, Complete, Perform, Practice, Write, etc.
  - Each line MUST end with semicolon followed by ###

  WRONG FORMATS (DO NOT USE):
  Monday, July 22|Review syllabus|Take practice quiz;
  Mon Jul 22|Read about nutrition; Learn protein calculation;
  Monday, July 22|Study muscle building;Complete exercises;
  Mon Jul 22|Study muscle building;Take practice quiz|###;

  STRICT RULES - NO EXCEPTIONS:
  1. Start output immediately with first day
  2. NO introductions, headers, explanations, notes, or concluding statements
  3. NO markdown (**bold**, ###headers, etc.)
  4. NO bullet points or dashes
  5. NO week sections or groupings
  6. Each line MUST end with semicolon followed by ###
  7. Tasks based on intensity: Casual=2 tasks, Moderate=3 tasks, Intense=4 tasks
  8. DayOfWeek MonthName DayNumber|task1|task2|task3;###
  9. MUST generate exactly ${totalDays} consecutive days
  10. MUST cover ALL dates from ${todayDate} to ${endDate}
  11. BE PRACTICAL: Give direct actions to DO, not things to read or learn about
  12. BE ACTIONABLE: Use implementation verbs like "Eat", "Calculate", "Consume", "Do", "Perform", "Track"
  13. BE SPECIFIC: Include exact quantities, foods, exercises, measurements
  14. FOCUS ON GOAL: All tasks must directly support the specific goal: "${enhancedGoal}"
  15. NO GENERIC LEARNING: Don't assign reading, studying, or research tasks

  FEW-SHOT EXAMPLES - LEARN FROM THESE INPUT-OUTPUT PAIRS:

  EXAMPLE 1 - FITNESS CATEGORY:
  Input: "I want to lose 10 pounds in 2 weeks" (fitness, moderate intensity)
  Output:
  Mon Jul 22|Eat 400g grilled chicken breast with steamed vegetables|Track calories in MyFitnessPal app for entire day|Complete 45-minute cardio workout at gym;###
  Tue Jul 23|Consume 6 egg whites with spinach for breakfast|Weigh yourself and record weight in fitness journal|Perform 30 burpees followed by 20-minute walk;###

  EXAMPLE 2 - STUDY CATEGORY:
  Input: "I want to pass my computer science final exam" (study, intense intensity)
  Output:
  Wed Jul 24|Solve 15 algorithm problems from LeetCode medium difficulty|Create flashcards for 25 data structure definitions|Write code for binary search tree implementation|Review and debug your heap sort algorithm;###
  Thu Jul 25|Complete 3 past exam papers under timed conditions|Memorize time complexities for 20 sorting algorithms|Build a working hash table from scratch in Python|Practice explaining recursion concepts out loud for 30 minutes;###

  EXAMPLE 3 - WORK CATEGORY:
  Input: "I want to get promoted to senior developer" (work, moderate intensity)
  Output:
  Fri Jul 26|Complete the user authentication feature for the main project|Send progress update email to your manager with specific achievements|Volunteer to mentor 2 junior developers on code review process;###
  Sat Jul 27|Attend the Saturday tech meetup and network with 5 industry professionals|Update LinkedIn profile with your recent project accomplishments|Practice your presentation skills by recording a 10-minute technical talk;###

  EXAMPLE 4 - LIFE CATEGORY:
  Input: "I want to save $5000 for a vacation" (life, casual intensity)
  Output:
  Sun Jul 28|Transfer $50 to your vacation savings account|Cancel 2 unused subscriptions to save monthly costs;###
  Mon Jul 29|Pack lunch instead of buying food and calculate money saved|Research and compare 3 high-yield savings accounts for better interest;###

  EXAMPLE 5 - FITNESS CATEGORY:
  Input: "I want to build muscle and gain weight" (fitness, intense intensity)
  Output:
  Tue Jul 30|Eat 200g lean ground beef with 300g rice and vegetables|Consume 500ml protein shake with banana and peanut butter|Perform 4 sets of 8 deadlifts with progressive weight increase|Track total calorie intake and aim for 3200+ calories today;###
  Wed Jul 31|Consume 8 whole eggs with toast and avocado for breakfast|Do 5 sets of 6 squats focusing on proper form|Eat 150g almonds as snack between meals|Measure and record bicep and chest circumference;###

  EXAMPLE 6 - STUDY CATEGORY:
  Input: "I want to learn Spanish fluently" (study, moderate intensity)
  Output:
  Thu Aug 01|Practice Spanish conversation with native speaker for 30 minutes|Complete lesson 5 of Duolingo focusing on past tense verbs|Write 20 sentences using new vocabulary words in context;###
  Fri Aug 02|Watch Spanish Netflix show with Spanish subtitles for 45 minutes|Create flashcards for 30 irregular Spanish verbs|Record yourself speaking Spanish for 10 minutes and analyze pronunciation;###


  YOUR TASK:
  Enhanced Goal: ${enhancedGoal}
  Category: ${category}
  Start Date: ${todayDate}
  End Date: ${endDate}
  Intensity: ${intensity} (${intensity === 'casual' ? '2 tasks per day' : intensity === 'moderate' ? '3 tasks per day' : '4 tasks per day'})
  Total Days: ${totalDays}
  Knowledge: "${knowledge}"

  REQUIRED DATES TO INCLUDE (${totalDays} days total):
  ${dateList.join(', ')}

  GENERATE EXACTLY ${totalDays} SCHEDULE LINES WITH ${intensity === 'casual' ? '2' : intensity === 'moderate' ? '3' : '4'} GOAL-SPECIFIC, PRACTICAL ACTIONS PER DAY
  OUTPUT ONLY THE SCHEDULE LINES WITH ;### ENDINGS
  VERIFY TASK COUNT: Each line must have ${intensity === 'casual' ? '2' : intensity === 'moderate' ? '3' : '4'} tasks separated by | symbols
  BEGIN OUTPUT NOW:`

  console.log(`[${requestId}] ===================== PROMPT =============================`);
  console.log(prompt);
  console.log(`[${requestId}] ===================================================================`);

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.5,
          num_predict: 4000,
          stop: [],
          repeat_penalty: 1.1,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawOutput = data.response || "No schedule returned";

    // Filter out the <think> reasoning section
    const thinkEndIndex = rawOutput.indexOf("</think>");
    let schedule = thinkEndIndex !== -1
      ? rawOutput.slice(thinkEndIndex + "</think>".length).trim()
      : rawOutput.trim();

    // ONLY PROCESS LINES WITH ### MARKERS
    schedule = schedule
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.includes('###')) // Only keep lines with ###
    .map((line: string) => {
      // Remove ** prefix if present
      line = line.replace(/^\*\*/, '');
      line = line.replace(/\*\*$/, '');
      
      // Fix date abbreviations with regex
      line = line.replace(/^Monday,/g, 'Mon');
      line = line.replace(/^Tuesday,/g, 'Tue');  
      line = line.replace(/^Wednesday,/g, 'Wed');
      line = line.replace(/^Thursday,/g, 'Thu');
      line = line.replace(/^Friday,/g, 'Fri');
      line = line.replace(/^Saturday,/g, 'Sat');
      line = line.replace(/^Sunday,/g, 'Sun');
      
      // Fix month abbreviations
      line = line.replace(/January/g, 'Jan');
      line = line.replace(/February/g, 'Feb');
      line = line.replace(/March/g, 'Mar');
      line = line.replace(/April/g, 'Apr');
      line = line.replace(/May/g, 'May');
      line = line.replace(/June/g, 'Jun');
      line = line.replace(/July/g, 'Jul');
      line = line.replace(/August/g, 'Aug');
      line = line.replace(/September/g, 'Sep');
      line = line.replace(/October/g, 'Oct');
      line = line.replace(/November/g, 'Nov');
      line = line.replace(/December/g, 'Dec');
      
      // Clean up the line but keep the ### marker
      line = line.replace(/\|\s*;/g, ';');
      line = line.replace(/;\s*([^;]*);/g, '|$1;');
      if (!line.includes(';###')) {
        // Ensure proper format with ;###
        line = line.replace(/;###/g, '').replace(/###/g, '');
        if (!line.endsWith(';')) line += ';';
        line += '###';
      }
      return line;
    })
    .join('\n');

    console.log(`[${requestId}] ===== CLEANED SCHEDULE =====`);
    console.log(schedule);
    console.log(`[${requestId}] ============================`);
    
    // Remove ### markers for final output
    const finalSchedule = schedule.replace(/;###/g, ';');
    
    res.json({ 
      schedule: finalSchedule,
      originalGoal: goal,
      enhancedGoal: enhancedGoal
    });
  } catch (error: any) {
    console.error(`[${requestId}] Local model error:`, error);
    res.status(500).json({ message: "Local model error", error: error.message });
  }
};