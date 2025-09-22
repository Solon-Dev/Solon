import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

const masterPrompt = `You are Solon, a world-class Staff Software Engineer and an expert in Quality Assurance and TypeScript. Your task is to perform a critical and insightful code review on a pull request. You are rigorous, practical, and focus on what truly matters for software quality.

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
`; // Paste your full master prompt here

async function callVertexAI(diff: string) {
  try {
    console.log("--- Vercel Function Triggered ---");
    const vertex_ai = new VertexAI({
      project: process.env.GCLOUD_PROJECT!,
      location: 'us-central1',
    });

    const model = vertex_ai.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);
    console.log("--- Calling Gemini API... ---");

    const result = await model.generateContent(finalPrompt);

    // --- THIS IS THE NEW, CRITICAL LOG ---
    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(JSON.stringify(result.response, null, 2));
    console.log("--- END RAW GEMINI RESPONSE ---");
    // ---------------------------------

    const response = result.response;
    const responseText = response.candidates![0].content.parts[0].text!;

    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonSubstring = responseText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);

  } catch (error) {
    console.error("!!! VERTEX AI CALL FAILED !!!", error);
    return { error: "Failed to get analysis from Vertex AI." };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const diff = body.diff;

    // Add a new environment variable in Vercel for your Project ID
    if (!process.env.GCLOUD_PROJECT) {
       throw new Error("GCLOUD_PROJECT environment variable not set");
    }

    if (!diff) {
      return NextResponse.json({ error: 'Diff is required.' }, { status: 400 });
    }

    const analysis = await callVertexAI(diff);

    if (analysis.error) {
       return NextResponse.json(analysis, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
