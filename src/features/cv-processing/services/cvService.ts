import { genAI } from '../../../services/gemini';

// Official un-bundled stable minified worker build path matching version 4.x
const PDF_WORKER_SRC: string =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs';

// Strict interface contract detailing the structured layout returned by the AI resume parser
export interface ExtractedCvMetrics {
  education: string;
  experience: string;
  skills: string[];
}

/**
 * 1. Extracts plain raw text contents out of a local binary PDF file blob
 */
export async function parsePdfText(file: File): Promise<string> {
  // FIX: Cast the URL import to standard 'any' to bypass local compiler path lookup checks
  const pdfjs: any = await import(
    /* @ts-ignore */
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs'
  );
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

  const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText: string = '';

  // Iterate through every page inside the document layout grid
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageItems: string = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageItems + '\n';
  }

  return fullText;
}

/**
 * 2. Transmits unstructured text to Gemini to parse out real data matching our layout
 */
export async function extractCvMetricsWithAi(
  rawCvText: string,
): Promise<ExtractedCvMetrics> {
  const prompt: string = `
    You are an expert AI human resources assistant and ATS resume data parsing engine.
    Analyze the following raw text extracted from an applicant's CV document:

    ---
    ${rawCvText}
    ---

    Extract the primary educational qualification history, overall professional experiences, and a flat array list mapping out all technical/domain skills.

    Return ONLY a raw JSON object matching this exact schema layout without markdown code fence blocks:
    {
      "education": "Most prominent degree title and associated institution name",
      "experience": "Concise paragraph or list summarizing historical professional roles or internship involvements",
      "skills": ["SkillA", "SkillB", "SkillC", "SkillD"]
    }
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    if (!response.text) {
      throw new Error(
        'ATS parsing engine returned an empty data payload response structure.',
      );
    }

    // FIX: Combined regex into a single line to fix the unterminated literal syntax error
    const cleanText: string = response.text
      .replace(/^```json\s+|\s+```$/g, '')
      .trim();
    const parsedData: ExtractedCvMetrics = JSON.parse(cleanText);
    return parsedData;
  } catch (error) {
    console.error('Gemini ATS Ingestion Error:', error);
    // FIX: Re-throwing guarantees all conditional execution branches resolve or terminate explicitly
    throw error;
  }
}
