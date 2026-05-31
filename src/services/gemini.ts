import { GoogleGenAI } from '@google/genai';

const apiKey: string | undefined = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    'Missing VITE_GEMINI_API_KEY environment configuration variable.',
  );
}

export const genAI: GoogleGenAI = new GoogleGenAI({ apiKey: apiKey || '' });

// Contract shape matching the expected AI quiz schema structure
export interface AssessmentQuestion {
  id: number;
  skill: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

const JSON_CLEAN_REGEX: RegExp = /^```json\s+|\s+```$/g;

/**
 * Generates an automated, dynamic multi-choice quiz matching strict skill inputs
 */
export async function generateAssessmentQuestions(
  selectedSkills: string[],
): Promise<AssessmentQuestion[]> {
  const skillCount: number = selectedSkills.length;
  const questionsPerSkill: number = skillCount <= 2 ? 5 : 3;

  const prompt: string = `
    You are an expert technical interviewer. Generate an assessment exam to test professional proficiency.
    SKILLS TO TEST: ${selectedSkills.join(', ')}

    CRITICAL INSTRUCTION: Return exactly ${questionsPerSkill} high-quality MCQs for EACH skill.
    Return ONLY a raw JSON array matching this exact schema layout without markdown formatting tags or code block fences:
    [
      {
        "id": 1,
        "skill": "Skill Name",
        "question": "Clear technical scenario question?",
        "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
        "correct_option_index": 0,
        "explanation": "Brief explanation addressing why the option is correct."
      }
    ]
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    if (!response.text) {
      throw new Error(
        'Generative AI engine returned an empty text response block.',
      );
    }

    const cleanText: string = response.text
      .replace(JSON_CLEAN_REGEX, '')
      .trim();
    const parsedQuestions: AssessmentQuestion[] = JSON.parse(cleanText);
    return parsedQuestions;
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    throw new Error('Failed to compile adaptive assessment parameters.');
  }
}
