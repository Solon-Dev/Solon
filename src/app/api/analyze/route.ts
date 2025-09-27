import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Improved prompt for reliable JSON output
const masterPrompt = `
You are an expert code reviewer named Solon.
Analyze the following git diff and provide a code review.

Respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "summary": "concise review summary",
  "edgeCases": ["edge case 1", "edge case 2"],
  "unitTests": {
    "filePath": "path/to/test/file.test.js",
    "code": "test code here"
  }
}

If you cannot perform a review, use this structure:
{
  "summary": "reason why review cannot be performed",
  "edgeCases": [],
  "unitTests": {"filePath": "", "code": ""}
}

Git diff to analyze:
<diff>
{raw_git_diff_string}
</diff>
`;

interface ReviewResult {
  summary: string;
  edgeCases: string[];
  unitTests: {
    filePath: string;
    code: string;
  };
}

interface ErrorResult {
  error: string;
}

async function callClaudeAPI(diff: string): Promise<ReviewResult | ErrorResult> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);
    
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Use most widely available model
      max_tokens: 4096,
      temperature: 0.1, // Low temperature for consistent JSON output
      messages: [{ role: "user", content: finalPrompt }],
    });

    const responseBlock = response.content[0];
    if (responseBlock.type !== 'text') {
      throw new Error("Unexpected response type from Claude API");
    }

    const responseText = responseBlock.text.trim();
    
    // More robust JSON extraction
    // Try to find JSON boundaries more carefully
    const openBrace = responseText.indexOf('{');
    if (openBrace === -1) {
      throw new Error("No JSON object found in Claude response");
    }
    
    // Find the matching closing brace by counting braces
    let braceCount = 0;
    let closeBrace = -1;
    
    for (let i = openBrace; i < responseText.length; i++) {
      if (responseText[i] === '{') {
        braceCount++;
      } else if (responseText[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          closeBrace = i;
          break;
        }
      }
    }
    
    if (closeBrace === -1) {
      throw new Error("Malformed JSON in Claude response");
    }
    
    const jsonContent = responseText.substring(openBrace, closeBrace + 1);
    
    // Parse and validate JSON structure
    const parsed = JSON.parse(jsonContent);
    
    // Validate expected structure
    if (typeof parsed !== 'object' || 
        typeof parsed.summary !== 'string' ||
        !Array.isArray(parsed.edgeCases) ||
        typeof parsed.unitTests !== 'object' ||
        typeof parsed.unitTests.filePath !== 'string' ||
        typeof parsed.unitTests.code !== 'string') {
      throw new Error("Invalid JSON structure from Claude API");
    }
    
    return parsed as ReviewResult;
    
  } catch (error) {
    console.error("Claude API call failed:", error);
    
    // Return structured error instead of throwing
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { 
      error: `Claude API analysis failed: ${errorMessage}` 
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { diff } = body;
    
    // Improved validation
    if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid diff string is required' }, 
        { status: 400 }
      );
    }
    
    const analysis = await callClaudeAPI(diff);
    
    // Check if we got an error result
    if ('error' in analysis) {
      return NextResponse.json(analysis, { status: 500 });
    }
    
    // Return successful analysis
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error("POST handler error:", error);
    
    // More specific error handling
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
