// In: src/app/api/analyze/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the SDK with your API key from the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// This is the master prompt we engineered earlier.
const masterPrompt = `
You are Solon, a world-class Staff Software Engineer and an expert in Quality Assurance and TypeScript. Your task is to perform a critical and insightful code review on a pull request. You are rigorous, practical, and focus on what truly matters for software quality.

You will be provided with the output of a 'git diff' for a pull request. Your sole output MUST be a single, minified JSON object with no markdown formatting or commentary outside of the JSON structure.

Follow these steps to construct your response:

1.  **Analyze Intent:** First, quickly determine the developer's primary goal. Is this a bug fix, a new feature, a refactor, or a performance improvement? This context is crucial.

2.  **Deep Code Analysis:** Scrutinize the provided \`git diff\`. Pay close attention to:
    * **Logic Flaws:** Look for off-by-one errors, race conditions, incorrect assumptions, and mishandled state.
    * **API Changes:** Identify any changes to function signatures, component props, or exported modules. Are they breaking changes?
    * **Security & Performance:** Note any potential security vulnerabilities (like improper input handling) or performance regressions (like inefficient loops or queries).
    * **Readability & Maintainability:** Assess if the code is overly complex or difficult to understand, but do not comment on minor style issues like whitespace.

3.  **Construct the JSON Response:** Based on your analysis, build the JSON object according to the specified schema.

**Output Schema (JSON ONLY):**
\`\`\`json
{
  "summary": "A concise, one-sentence summary of the PR's purpose, written in plain English for a project manager.",
  "edgeCases": [
    "A plausible, high-impact edge case the developer may have missed. Frame it as a question starting with 'What happens if...'.",
    "Another distinct and critical edge case suggestion."
  ],
  "unitTests": {
    "isTestable": true,
    "explanation": "A brief, one-sentence explanation of the primary logic being tested.",
    "filePath": "A suggested file path for the new test file, e.g., 'src/components/Button/Button.test.tsx'.",
    "language": "typescript",
    "code": "The complete, runnable, and self-contained unit test code for the core logic, using a standard testing framework like Jest with React Testing Library, Vitest, or the equivalent. Do not use placeholder comments; the code must be functional."
  }
}
\`\`\`

--- INPUT ---
The user's code changes will be provided below inside the \`GIT_DIFF\` block.

\`\`\`GIT_DIFF
{raw_git_diff_string}
\`\`\`
`;
async function callGemini(diff: string) {
  console.log("--- Vercel Function Triggered ---");
  try {
    // Log to confirm the environment variable is loaded by Vercel
    console.log("Verifying Gemini API Key presence:", process.env.GEMINI_API_KEY ? "Key Loaded" : "KEY IS MISSING!");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);

    console.log("--- Calling Gemini API... ---");
    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const responseText = response.text();

    console.log("--- Gemini API Call Successful ---");
    console.log("Response snippet:", responseText.substring(0, 100)); // Log first 100 chars of the response

    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonSubstring = responseText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);

  } catch (error) {
    // This is the most important log. It will show us the true error.
    console.error("!!! GEMINI API CALL FAILED !!!", error);
    return { error: "Failed to get analysis from Gemini API." };
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const diff = body.diff;

    if (!diff) {
src/app/api/analyze/route.ts       return NextResponse.json({ error: 'Diff is required.' }, { status: 400 });
    }

    const analysis = await callGemini(diff); 
    
    if (analysis.error) {
  
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
