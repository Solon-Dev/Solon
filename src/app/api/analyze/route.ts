import { NextResponse } from 'next/server';

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

// This function now ONLY handles fetching and parsing from the API
async function callClaudeAPI(diff: string): Promise<ReviewResult | ErrorResult> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);
    
    // Use fetch instead of SDK to avoid Vercel compatibility issues
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        temperature: 0.1,
        messages: [{ role: "user", content: finalPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const responseBlock = data.content[0];
    if (responseBlock.type !== 'text') {
      throw new Error("Unexpected response type from Claude API");
    }

    const responseText = responseBlock.text.trim();
    
    // Robust JSON extraction logic
    const openBrace = responseText.indexOf('{');
    if (openBrace === -1) {
      throw new Error("No JSON object found in Claude response");
    }
    
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
    
    const analysis = JSON.parse(jsonContent);
    
    // Validate the structure of the parsed JSON
    if (
      typeof analysis !== 'object' ||
      typeof analysis.summary !== 'string' ||
      !Array.isArray(analysis.edgeCases) ||
      typeof analysis.unitTests !== 'object' ||
      typeof analysis.unitTests.filePath !== 'string' ||
      typeof analysis.unitTests.code !== 'string'
    ) {
      throw new Error("Invalid JSON structure from Claude API");
    }
    
    return analysis as ReviewResult;

  } catch (error) {
    // Proper error handling, logging generic soft error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { 
      error: `Claude API analysis failed: ${errorMessage}` 
    };
  }
}


// The POST handler now manages all HTTP request and response logic
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { diff } = body;
    
    if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid diff string is required' }, 
        { status: 400 }
      );
    }
    
    // Get the result from the API utility function
    const analysis = await callClaudeAPI(diff);
    
    // Check if the utility function returned an error object
    if ('error' in analysis) {
      return NextResponse.json(analysis, { status: 500 });
    }
    
    // --- Formatting logic now lives in the POST handler ---
    const formatted = `### 🛡️ Solon AI Review

**Summary:** ${analysis.summary}

**Edge Cases:**
${analysis.edgeCases.map(ec => `- ${ec}`).join('\n')}

**Suggested Unit Tests:**
\`\`\`typescript
// ${analysis.unitTests.filePath}
${analysis.unitTests.code}
\`\`\`
`;

    // Return a successful response with the original and formatted data
    return NextResponse.json({
      summary: analysis.summary,
      edgeCases: analysis.edgeCases,
      unitTests: analysis.unitTests,
      formatted: formatted
    });

  } catch (error) {
    console.error("POST handler error:", error);
    
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
