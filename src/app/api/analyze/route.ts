import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// A prompt optimized for Claude's JSON output
const masterPrompt = `
You are an expert code reviewer named Solon.
Analyze the following git diff. Your response MUST be a single, minified JSON object with NO MARKDOWN formatting or any other text outside the JSON object.
The JSON object must have three keys: "summary" (a concise string), "edgeCases" (an array of two strings), and "unitTests" (an object with "filePath" and "code" strings).
If you cannot perform a review, the value of the "summary" key MUST be a string explaining the reason.

Here is the git diff:
<diff>
{raw_git_diff_string}
</diff>
`;

async function callClaudeAPI(diff: string) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("CRITICAL: ANTHROPIC_API_KEY is not set.");
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Using Claude's fastest and most cost-effective model
      max_tokens: 4096,
      messages: [{ role: "user", content: finalPrompt }],
    });

    const responseBlock = response.content[0];
if (responseBlock.type !== 'text') {
  throw new Error("Unexpected response block type from AI.");
}
const responseText = responseBlock.text;
    
    // Extract the JSON object from the response
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonSubstring = responseText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);

  } catch (error) {
    console.error("!!! CLAUDE API CALL FAILED !!!", error);
    return { error: `Failed to get analysis from Claude API: ${error}` };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const diff = body.diff;

    if (!diff) {
      return NextResponse.json({ error: 'Diff is required.' }, { status: 400 });
    }
    
    const analysis = await callClaudeAPI(diff);
    
    if (analysis.error) {
       return NextResponse.json(analysis, { status: 500 });
    }
  
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
