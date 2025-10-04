import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Improved prompt for reliable JSON output
const masterPrompt = `
You are Solon, an expert code reviewer specializing in JavaScript and TypeScript.

Analyze the following git diff and provide a thorough code review focusing on:
- Bugs and logic errors
- Edge cases and error handling
- Performance considerations
- Security vulnerabilities
- Best practices and code quality

Your response MUST be valid JSON with this exact structure:
{
  "summary": "A concise 2-3 sentence analysis of the code changes",
  "edgeCases": ["edge case 1", "edge case 2"],
  "unitTests": {
    "filePath": "path/to/test/file.test.js",
    "code": "complete unit test code with assertions"
  }
}

Requirements:
- Provide actionable, specific feedback
- Identify actual issues, not just style preferences
- Generate complete, runnable unit tests using Jest syntax
- If no significant issues found, acknowledge good practices
- Return ONLY the JSON object, no markdown or additional text

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
      model: "claude-sonnet-4-20250514", // Latest Claude Sonnet 4.5 model
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
// Check if we got an error result
    if ('error' in analysis) {
      return NextResponse.json(analysis, { status: 500 });
    }
    
    // Format the review as markdown
    const formatted = `### 🛡️ Solon AI Review

**Summary:** 
${analysis.summary}

**Edge Cases:**
${analysis.edgeCases.map(ec => `- ${ec}`).join('\n')}

**Suggested Unit Tests:**
\`\`\`typescript
// ${analysis.unitTests.filePath}
${analysis.unitTests.code}
\`\`\``;
    
    // Return successful analysis with formatted version
    return NextResponse.json({
      summary: analysis.summary,
      edgeCases: analysis.edgeCases,
      unitTests: analysis.unitTests,
      formatted: formatted
    });
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
