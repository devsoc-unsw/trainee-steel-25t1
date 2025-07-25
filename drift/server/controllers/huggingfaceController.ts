import { Request, Response } from "express";
import { InferenceClient } from "@huggingface/inference";
import Schedule from "../models/Schedule";
import { addDocs, queryDocs } from "../utils/chromaRAG";
import 'dotenv/config';

// const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;

// const client = new InferenceClient(HUGGINGFACEHUB_API_KEY);

// Extract keywords from goal for better RAG retrieval
async function extractKeywords(originalGoal: string, category: string): Promise<string> {
  const keywordPrompt = `Extract 5 relevant keywords and synonyms from this goal for better search. Output ONLY comma-separated keywords.

  Examples:
  "I want to sleep earlier" → sleep, rest, bedtime, routine, health
  "I want to deadlift 300kg" → deadlift, strength, gym, powerlifting, training
  "I want to learn Spanish" → Spanish, language, vocabulary, practice, fluency
  "I want to get promoted" → promotion, career, leadership, skills, workplace

  Goal: "${originalGoal}"
  Keywords:`;

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma:2b',
        prompt: keywordPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.5,
          num_predict: 1000,
          stop: [],
          repeat_penalty: 1.1,
        }
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      return "";
    }

    const data = await response.json();
    let keywords = data.response || "";
    
    // console.log("🔍 RAW KEYWORD RESPONSE:", keywords);
    
    // First try to get content after </think>
    const thinkEndIndex = keywords.indexOf("</think>");
    if (thinkEndIndex !== -1) {
      const afterThink = keywords.slice(thinkEndIndex + "</think>".length).trim();
      if (afterThink && afterThink.length > 3) {
        keywords = afterThink;
      }
    }
    
    // If we still don't have good keywords, extract from within <think> tags
    if (!keywords || keywords.length < 5 || keywords.includes('<think>')) {
      const thinkStartIndex = keywords.indexOf("<think>");
      const thinkEndIdx = keywords.indexOf("</think>");
      
      if (thinkStartIndex !== -1 && thinkEndIdx !== -1) {
        const thinkContent = keywords.slice(thinkStartIndex + "<think>".length, thinkEndIdx);
        
        // Look for keyword patterns within the thinking
        const lines = thinkContent.split('\n');
        for (const line of lines) {
          const cleanLine = line.trim();
          // Look for lines that contain comma-separated words (likely keywords)
          if (cleanLine.includes(',') && cleanLine.split(',').length >= 3) {
            // Check if it looks like keywords (no long sentences)
            const words = cleanLine.split(',').map((w: string) => w.trim());
            const avgWordLength = words.reduce((sum: number, word: string) => sum + word.split(' ').length, 0) / words.length;
            if (avgWordLength <= 3) { // Average of 3 words or less per "keyword"
              keywords = cleanLine;
              break;
            }
          }
        }
      }
    }
    
    // Final cleanup
    keywords = keywords
      .replace(/^<think>[\s\S]*?<\/think>/g, '') // Remove any remaining think tags
      .replace(/OUTPUT ONLY KEYWORDS:/g, '')
      .replace(/Keywords:/g, '')
      .replace(/Output:/g, '')
      .replace(/^.*?:/g, '') // Remove any prefix with colon
      .replace(/^[^\w]*/g, '') // Remove leading non-word characters
      .trim();

    // NEW: Convert bulleted/line-separated keywords to comma-separated
    keywords = keywords
      .split('\n')                           // Split by lines
      .map((line: string) => line.trim())    // Trim each line
      .filter((line: string) => line.length > 0) // Remove empty lines
      .map((line: string) => {
        // Remove bullet points and dashes
        return line.replace(/^[-•*]\s*/, '').trim();
      })
      .join(', ');   
    
    // If we still have thinking artifacts, try one more extraction
    if (keywords.includes('<think>') || keywords.includes('</think>') || keywords.length < 5) {
      // Look for comma-separated patterns anywhere in the original response
      const allLines = data.response.split('\n');
      for (const line of allLines) {
        const cleanLine = line.trim();
        if (cleanLine.includes(',') && 
            !cleanLine.includes('<think>') && 
            !cleanLine.includes('</think>') &&
            !cleanLine.includes('Goal:') &&
            cleanLine.length > 10 &&
            cleanLine.length < 200) {
          keywords = cleanLine;
          break;
        }
      }
    }

    keywords = keywords.replace(/\*+/g, '') // Remove asterisks
    .replace(/[^\w\s,.\-()]/g, '') // Keep only letters, numbers, spaces, commas, periods, hyphens, parentheses
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
    
    console.log("🔍 EXTRACTED KEYWORDS:", keywords);
    return keywords;
  } catch (error) {
    console.error("Keyword extraction error:", error);
    return "";
  }
}

export const generateSchedule = async (req: Request, res: Response) => {  
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`[${requestId}] Starting generateSchedule request`);

  const { goal, startDate, endDate, intensity, category } = req.body;
  if (!goal || !startDate || !endDate || !intensity || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  

  // Override startDate to today (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split("T")[0];

  // Calculate total days and create date list
  const start = new Date(todayDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Extract keywords for better RAG retrieval
  console.log(`[${requestId}] Extracting keywords...`);
  const keywords = await extractKeywords(goal, category);

  // Create enhanced goal by appending keywords
  const enhancedGoal = keywords ? `${goal} (${keywords})` : goal;

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

  // Use enhanced goal (goal + keywords) for RAG and schedule generation
  console.log(`[${requestId}] Generating schedule with enhanced goal...`);
  await addDocs();
  const docs = await queryDocs(enhancedGoal, category); // Use enhanced goal for better RAG results
  const rawKnowledge = docs.map((doc: any) => doc.pageContent).join("\n");
  const knowledge = rawKnowledge.length > 400 ? rawKnowledge.substring(0, 400) + "..." : rawKnowledge;

  const prompt = `Generate a ${totalDays}-day schedule. Output ONLY schedule lines in this EXACT format:

DayOfWeek MonthName DayNumber|task1|task2|task3;###

RULES:
- Start immediately with first day
- NO introductions, explanations, or extra text
- Each line ends with ;###
- ${intensity === 'casual' ? '2 tasks' : intensity === 'moderate' ? '3 tasks' : '4 tasks'} per day
- Include specific quantities and numbers

IMPORTANT: Do NOT think, reason, or explain. Give your best immediate answer.

Potentially Useful Knowledge, use if applicable: "${knowledge}"


EXAMPLES:

Input: "Lose 10 pounds" (fitness, moderate)
Required Dates: Mon Jul 22, Tue Jul 23
Output:
Mon Jul 22|Eat 400g chicken|Track calories|Do 45min cardio;###
Tue Jul 23|Weigh yourself|Do 30 burpees|Walk 20 minutes;###

Input: "Pass CS exam" (study, intense)
Required Dates: Wed Jul 24
Output:
Wed Jul 24|Solve 15 problems|Make 25 flashcards|Code binary tree|Debug heap sort;###

Input: "Save $5000" (life, casual)
Required Dates: Sun Jul 28, Mon Jul 29
Output:
Sun Jul 28|Transfer $50 to savings|Cancel 2 subscriptions;###
Mon Jul 29|Research savings accounts|Track expenses;###

YOUR TASK:
Generate exactly ${totalDays} lines with ${intensity === 'casual' ? '2 tasks' : intensity === 'moderate' ? '3 tasks' : '4 tasks'} each:
Input: "${enhancedGoal}" (${category}, ${intensity} intensity)
Required Dates: ${dateList.join(', ')}
Output:`

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
        model: 'gemma:2b',
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


    // console.log(schedule)

    // ONLY PROCESS LINES WITH ### MARKERS
    schedule = schedule
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.includes('###')) // Only keep lines with ###
    .map((line: string) => {
      line = line.replace(/^.*?(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g, '$1');

      // Remove ** prefix if present
      line = line.replace(/^\*\*/, '');
      line = line.replace(/\*\*$/, '');
      
      // NEW: Remove leading dashes, numbers, and bullets
      line = line.replace(/^[-•*]\s*/, ''); // Remove leading dashes and bullets
      line = line.replace(/^\d+\.\s*/, ''); // Remove leading numbers like "1. "
      line = line.replace(/^\d+\s+/, ''); // Remove leading numbers like "1 "
      line = line.replace(/^\(\d+\)\s*/, ''); // Remove leading numbers like "(1) "
      
      // NEW: Fix double pipes - replace || with |
      line = line.replace(/\|\|+/g, '|'); // Replace multiple pipes with single pipe
      
      // NEW: Convert semicolons that should be pipes (between tasks) to pipes
      // Pattern: ;DayOfWeek MonthName Day| indicates a semicolon that should be a pipe
      line = line.replace(/;(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\|/g, '|$1 $2 $3|');
      
      // NEW: Remove semicolons that are NOT the final semicolon before ###
      // First, find the ### marker position
      const hashIndex = line.indexOf('###');
      if (hashIndex !== -1) {
        // Split into content and ending (;### or ###)
        const content = line.substring(0, hashIndex);
        const ending = line.substring(hashIndex);
        
        // Remove all semicolons from content, then add back the final one
        const cleanContent = content.replace(/;/g, '');
        line = cleanContent + ';' + ending;
      } else {
        // If no ### found, just remove all semicolons for now
        line = line.replace(/;/g, '');
      }
      
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
      
      // NEW: Fix incomplete lines (lines that end abruptly)
      if (line.includes('|') && !line.includes(';###')) {
        // If line has pipes but no proper ending, check if it's incomplete
        const parts = line.split('|');
        if (parts.length > 1 && parts[parts.length - 1].trim().length < 10) {
          // Last part is too short, likely incomplete - remove it
          parts.pop();
          line = parts.join('|');
        }
      }
      
      if (!line.includes(';###')) {
        // Ensure proper format with ;###
        line = line.replace(/;###/g, '').replace(/###/g, '');
        if (!line.endsWith(';')) line += ';';
        line += '###';
      }
      
      return line;
    })
    .filter((line: string) => {
      // NEW: Filter out incomplete or malformed lines
      const parts = line.split('|');
      
      // Must have at least 2 parts (date + at least 1 task)
      if (parts.length < 2) return false;
      
      // First part should look like a date (contains day and month)
      const datePart = parts[0].trim();
      const hasValidDate = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}$/.test(datePart);
      if (!hasValidDate) return false;
      
      return true;
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