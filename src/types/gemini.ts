import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';



const API_KEY = import.meta.env.VITE_API_KEY || "" ; 

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateLessonPlan(prompt: LessonPlan): Promise<string> {
  if (!prompt || !prompt.topic || !prompt.gradeLevel) {
    throw new Error('Missing required lesson plan parameters');
  }

  try {
    const model: GenerativeModel = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
      
    const promptText = `
    Create a detailed lesson plan with the following structure. Format the response in clear sections.

    LESSON PLAN FOR: ${prompt.topic}
    GRADE LEVEL: ${prompt.gradeLevel}
    MAIN CONCEPT: ${prompt.mainConcept || prompt.topic}

    Structure your response exactly like this:

    SECTION 1: MATERIALS NEEDED
    • List each material on a new line
    • Include all necessary supplies
    • Specify any technology requirements

    SECTION 2: LEARNING OBJECTIVES
    • List each objective on a new line
    • Include both cognitive and practical objectives
    • Ensure objectives are measurable

    SECTION 3: LESSON TIMELINE
    Create a table with these columns:
    Duration | Activity | Instructions | Teacher Notes

    SECTION 4: ASSESSMENT METHODS
    • Describe assessment strategies
    • Include both formative and summative assessments

    SECTION 5: ADDITIONAL NOTES
    • Include preparation requirements
    • List any safety considerations
    • Note any differentiation strategies

    Format each section clearly and separate them with section headers.
    `;

    const result = await model.generateContent(promptText);
    const response = result.response.text();
    return response;

  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw error;
  }
}

export interface LessonPlan {
    
    topic: string;
    subject?: string;
    gradeLevel: string;
    mainConcept?: string;
    subtopics?: string;
    
    
    materials?: string;
    objectives?: string;
    
    
    springboardTime?: string;
    springboardNotes?: string;
    
    introTime?: string;
    introNotes?: string;
    
    reviewTime?: string;
    reviewNotes?: string;
    
    discussionTime?: string;
    discussionNotes?: string;
    
    activityTime?: string;
    activityNotes?: string;
    
    assessmentTime?: string;
    assessmentNotes?: string;
    
    otherTime?: string;
    otherNotes?: string;
    
    
    notes?: string;
    date?:string;
  }