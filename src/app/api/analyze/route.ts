import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
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
  playbookResults?: string;
  edgeCases: string[];
  unitTests: {
    filePath: string;
    code: string;
  };
}

interface ErrorResult {
  error: string;
  details?: string;
}

// Updated to accept apiKey as a parameter
async function callClaudeAPI(diff: string, apiKey: string, playbooks: Playbook[], langConfig: LanguageConfig): Promise<ReviewResult | ErrorResult> {
  try {
    const masterPrompt = buildMasterPrompt(playbooks, langConfig);
    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Uses the user's key
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

    return analysis as ReviewResult;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (error instanceof Error && error.stack) {
      console.error('Claude API Error Stack:', error.stack);
    }
    return {
      error: `Claude API analysis failed: ${errorMessage}`
    };
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { diff, apiKey, repoFullName, prNumber, prTitle } = body; // Extract apiKey and PR metadata from the request body

    // 1. Validation: Ensure Diff exists
    if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid diff string is required' },
        { status: 400 }
      );
    }

    // Security: Prevent DoS by limiting diff size
    const MAX_DIFF_LENGTH = 500000;
    if (diff.length > MAX_DIFF_LENGTH) {
      return NextResponse.json(
        {
          error: `Diff too large. Maximum allowed length is ${MAX_DIFF_LENGTH} characters. Received ${diff.length} characters.`
        },
        { status: 413 }
      );
    }

    // Detect the programming language from the diff
    const detectedLanguage = detectLanguageFromDiff(diff);
    const langConfig = getLanguageConfig(detectedLanguage);
    const playbooks = await loadEnabledPlaybooks();

    // 3. Execution: Call Claude using THEIR key
    const analysis = await callClaudeAPI(diff, apiKey, playbooks, langConfig);

    if ('error' in analysis) {
      return NextResponse.json(analysis, { status: 500 });
    }

    // Formatting logic
    let formatted = `### 🛡️ Solon AI Review

**Summary:** ${analysis.summary}
`;

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

    // Persist review to DB if repo info is provided
    if (repoFullName) {
      try {
        const repoResult = await db(
          'SELECT id FROM repos WHERE full_name = $1',
          [repoFullName]
        ) as Array<{ id: number }>;
        if (repoResult.length > 0) {
          const repoId = (repoResult[0] as { id: number }).id;
          const status = (analysis.playbookResults as unknown as Array<{ violations?: Array<{ severity: string }> }>)
            ?.some((r) => r.violations?.some((v) => v.severity === 'blocking'))
            ? 'fail'
            : 'pass';
          await db(
            `INSERT INTO reviews (repo_id, pr_number, pr_title, summary, playbook_results, edge_cases, unit_tests, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              repoId,
              prNumber ?? 0,
              prTitle ?? '',
              analysis.summary,
              JSON.stringify(analysis.playbookResults ?? null),
              JSON.stringify(analysis.edgeCases),
              JSON.stringify(analysis.unitTests),
              status,
            ]
          );
        }
      } catch (dbErr) {
        // Don't fail the review if DB write fails — log and continue
        console.error('Failed to persist review to DB:', dbErr);
      }
    }

    return NextResponse.json({
      summary: analysis.summary,
      playbookResults: analysis.playbookResults,
      edgeCases: analysis.edgeCases,
      unitTests: analysis.unitTests,
      formatted: formatted
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (error instanceof Error && error.stack) {
      console.error('API Route Error Stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
