import { NextResponse } from 'next/server';
import { loadEnabledPlaybooks } from '@/lib/config/loadPlaybookConfig';
import { Playbook } from '@/lib/playbooks/types';
import {
  detectLanguageFromDiff,
  getLanguageConfig,
  getLanguageBestPractices,
  getLanguageSecurityConsiderations,
  type LanguageConfig
} from '@/utils/languageDetector';

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Generate the master prompt with optional playbook integration and language awareness
 */
function buildMasterPrompt(playbooks: Playbook[], langConfig: LanguageConfig): string {
  const hasPlaybooks = playbooks.length > 0;

  let playbooksSection = '';
  if (hasPlaybooks) {
    playbooksSection = `
CRITICAL: Check this PR against the following team standards:

${playbooks.map(playbook => `
### ${playbook.name} Standards
${playbook.description}

${playbook.rules.map(rule => {
  const severityEmoji = rule.severity === 'blocking' ? '🚫' : rule.severity === 'warning' ? '⚠️' : 'ℹ️';
  let ruleText = `- **[${severityEmoji} ${rule.severity.toUpperCase()}]** ${rule.description}`;

  if (rule.examples) {
    if (rule.examples.violation) {
      ruleText += `\n  ❌ Violation: \`${rule.examples.violation}\``;
    }
    if (rule.examples.correct) {
      ruleText += `\n  ✅ Correct: \`${rule.examples.correct}\``;
    }
  }

  return ruleText;
}).join('\n')}
`).join('\n')}

For each standard:
1. Review if the PR code affects this area
2. Check for compliance with the rule
3. If violations found: cite specific file names and line numbers, explain the issue, and suggest fixes
4. Use these status indicators:
   - ✅ Passing (no violations found)
   - ⚠️ Warning (minor issues or suggestions)
   - 🚫 Blocking (must be fixed before merge)
`;
  }

  const bestPractices = getLanguageBestPractices(langConfig.language);
  const securityConsiderations = getLanguageSecurityConsiderations(langConfig.language);

  // Build test file path example based on language
  const testFileExample = langConfig.language === 'rust'
    ? 'src/lib.rs or tests/integration_test.rs'
    : langConfig.language === 'python'
    ? `tests/test_module${langConfig.testFileExtension}`
    : `path/to/test/file${langConfig.testFileExtension}`;

  return `
You are Solon, an expert code reviewer specializing in ${langConfig.expertise}.

${hasPlaybooks ? playbooksSection : ''}

Analyze the following git diff and provide a thorough code review focusing on:
- Bugs and logic errors
- Edge cases and error handling
- Performance considerations
- Security vulnerabilities
- Best practices and code quality

Language-specific considerations for ${langConfig.expertise}:${bestPractices}

Security focus areas:${securityConsiderations}

Your response MUST be valid JSON with this exact structure:
{
  "summary": "A concise 2-3 sentence analysis of the code changes",
  ${hasPlaybooks ? '"playbookResults": "Formatted markdown section with playbook check results. For each playbook, show rule-by-rule compliance status with file/line citations for violations",' : ''}
  "edgeCases": ["edge case 1", "edge case 2"],
  "unitTests": {
    "filePath": "${testFileExample}",
    "code": "complete unit test code with assertions using ${langConfig.testFramework}"
  }
}

Requirements:
- Provide actionable, specific feedback
- Identify actual issues, not just style preferences
- Generate complete, runnable unit tests using ${langConfig.testFramework} syntax and idioms
- For ${langConfig.language} code, follow ${langConfig.language}-specific conventions and best practices
- If no significant issues found, acknowledge good practices
${hasPlaybooks ? '- For playbookResults: Format as clear markdown with headings, checkboxes, and code examples. Include file paths and line numbers for all violations. Use \\n for line breaks within the string value' : ''}
- Return ONLY valid JSON - use escaped newlines (\\n) not literal newlines in string values
- Return ONLY the JSON object, no markdown or additional text

Git diff to analyze:
<diff>
{raw_git_diff_string}
</diff>
`;
}

interface ReviewResult {
  summary: string;
  playbookResults?: string; // Optional - only present when playbooks are enabled
  edgeCases: string[];
  unitTests: {
    filePath: string;
    code: string;
  };
}

interface ErrorResult {
  error: string;
  details?: string;
  stack?: string;
}

// This function now ONLY handles fetching and parsing from the API
async function callClaudeAPI(diff: string, playbooks: Playbook[], langConfig: LanguageConfig): Promise<ReviewResult | ErrorResult> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        error: "ANTHROPIC_API_KEY environment variable is not set",
        details: "Configuration error"
      };
    }

    const masterPrompt = buildMasterPrompt(playbooks, langConfig);
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
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: 0.1,
        messages: [{ role: "user", content: finalPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { 
        error: `Anthropic API error: ${response.status}`,
        details: errorText
      };
    }

    const data = await response.json();
    
    const responseBlock = data.content[0];
    if (responseBlock.type !== 'text') {
      return { 
        error: "Unexpected response type from Claude API",
        details: `Got type: ${responseBlock.type}`
      };
    }

    const responseText = responseBlock.text.trim();
    
    // Robust JSON extraction logic
    const openBrace = responseText.indexOf('{');
    if (openBrace === -1) {
      return { 
        error: "No JSON object found in Claude response",
        details: responseText.substring(0, 200)
      };
    }
    
    let braceCount = 0;
    let closeBrace = -1;
    let inString = false;
    let escaped = false;
    
    for (let i = openBrace; i < responseText.length; i++) {
      const char = responseText[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }
      } else {
        if (char === '"') {
          inString = true;
        } else if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            closeBrace = i;
            break;
          }
        }
      }
    }
    
    if (closeBrace === -1) {
      return { 
        error: "Malformed JSON in Claude response",
        details: responseText.substring(0, 200)
      };
    }
    
    const jsonContent = responseText.substring(openBrace, closeBrace + 1);

    const analysis = JSON.parse(jsonContent);
    
    // Validate the structure of the parsed JSON
    if (
      typeof analysis !== 'object' ||
      typeof analysis.summary !== 'string' ||
      !Array.isArray(analysis.edgeCases) ||
      typeof analysis.unitTests !== 'object'
    ) {
      return { 
        error: "Invalid JSON structure from Claude API",
        details: JSON.stringify(analysis)
      };
    }
    
    return analysis as ReviewResult;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    // Log error internally but do not return stack trace
    console.error('Claude API analysis failed:', error);
    return { 
      error: `Claude API analysis failed: ${errorMessage}`
    };
  }
}


// The POST handler now manages all HTTP request and response logic
export async function POST(request: Request): Promise<Response> {
  try {
    // Return diagnostic info first
    const diagnostics = {
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      runtime: process.env.VERCEL_REGION || 'local',
      nodeVersion: process.version
    };

    const body = await request.json();
    const { diff } = body;

    if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Valid diff string is required',
          diagnostics
        },
        { status: 400 }
      );
    }

    // Detect the programming language from the diff
    const detectedLanguage = detectLanguageFromDiff(diff);
    const langConfig = getLanguageConfig(detectedLanguage);
    console.log(`Detected language: ${detectedLanguage}`);

    // Load enabled playbooks from configuration
    const playbooks = await loadEnabledPlaybooks();
    console.log(`Loaded ${playbooks.length} playbooks:`, playbooks.map(p => p.name).join(', '));

    // Get the result from the API utility function
    const analysis = await callClaudeAPI(diff, playbooks, langConfig);
    
    // Check if the utility function returned an error object
    if ('error' in analysis) {
      // Ensure stack is not leaked even if it was present
      const errorResult = analysis as ErrorResult;
      // Reconstruct the object without stack to avoid lint errors and leakage
      const safeAnalysis = {
        error: errorResult.error,
        details: errorResult.details
      };

      return NextResponse.json({
        ...safeAnalysis,
        diagnostics
      }, { status: 500 });
    }
    
    // --- Formatting logic now lives in the POST handler ---
    let formatted = `### 🛡️ Solon AI Review

**Summary:** ${analysis.summary}
`;

    // Add playbook results section if present
    if (analysis.playbookResults) {
      formatted += `
## 🎯 Team Standards Check

${analysis.playbookResults}
`;
    }

    formatted += `
**Edge Cases:**
${analysis.edgeCases.map(ec => `- ${ec}`).join('\n')}

**Suggested Unit Tests:**
\`\`\`${langConfig.syntaxHighlight}
// ${analysis.unitTests.filePath}
${analysis.unitTests.code}
\`\`\`

---
*Detected Language: ${langConfig.expertise} | Test Framework: ${langConfig.testFramework}*
`;

    // Return a successful response with the original and formatted data
    return NextResponse.json({
      summary: analysis.summary,
      playbookResults: analysis.playbookResults,
      edgeCases: analysis.edgeCases,
      unitTests: analysis.unitTests,
      formatted: formatted,
      diagnostics
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Log the full error and stack trace to server console
    console.error('Internal server error in analyze route:', error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: errorMessage,
        // stack: removed to prevent information leakage
        diagnostics: {
          timestamp: new Date().toISOString(),
          hasApiKey: !!process.env.ANTHROPIC_API_KEY
        }
      }, 
      { status: 500 }
    );
  }
}
