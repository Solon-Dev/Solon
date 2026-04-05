# Solon AI - Team Playbooks Feature Implementation

## Context
I'm building Solon AI, an AI-powered code review tool for GitHub PRs. I need to implement a "Team Playbooks" feature that automatically checks PRs against team-specific standards (Accessibility, Security, Best Practices).

**Current Stack:**
- Next.js with TypeScript
- Vercel deployment
- GitHub Actions for PR triggers
- Anthropic Claude API (claude-3-haiku-20240307)
- GitHub App integration

**Current Architecture:**
- GitHub Actions workflow triggers on PR events
- Calls Vercel API endpoint `/api/review`
- API endpoint fetches PR data, generates Claude analysis, posts comment
- User brings their own Anthropic API key

## Feature Requirements

### Goal
Allow teams to enable preset "playbooks" that enforce:
1. **Accessibility** - WCAG compliance checks
2. **Security** - Common vulnerability detection
3. **Best Practices** - Code quality standards

### Technical Requirements

**Phase 1 - Preset Playbooks (MVP):**
- Create 3 preset playbooks with defined rules
- Each rule has: id, category, description, severity level, and examples
- Update Claude prompt to check PR against enabled playbooks
- Format playbook results in PR comment with clear pass/fail indicators
- Allow users to select which playbooks to enable (store in config or database)

**Phase 2 - Future (don't implement yet):**
- Custom `.solon/rules.yaml` file support
- Per-repository playbook configuration

## Implementation Tasks

### 1. Create Playbook Type System

Create `lib/playbooks/types.ts`:
- Define `PlaybookRule` interface with: id, category, description, severity ('blocking' | 'warning' | 'info'), optional examples array
- Define `Playbook` interface with: name, description, rules array
- Export these types

### 2. Create Preset Playbooks

Create `lib/playbooks/presets.ts`:

**ACCESSIBILITY_PLAYBOOK** should include rules for:
- Interactive elements must have accessible labels (aria-label, aria-labelledby, or visible text)
- Images must have alt text (empty string for decorative)
- Color contrast requirements (4.5:1 for normal text, 3:1 for large)
- Keyboard navigation support
- Visible focus indicators
- Semantic HTML usage (nav, main, article, etc.)
- Form inputs must have associated labels

**SECURITY_PLAYBOOK** should include rules for:
- No hardcoded secrets, API keys, passwords
- Input validation and sanitization
- Parameterized queries (SQL injection prevention)
- XSS prevention (escape user content)
- Authentication checks on protected routes/APIs
- HTTPS enforcement for sensitive operations
- Secure session management
- CORS configuration review

**BEST_PRACTICES_PLAYBOOK** should include rules for:
- Single responsibility principle
- Error handling for async operations
- No magic numbers (use named constants)
- Remove console.log statements
- Meaningful variable/function names
- DRY principle violations
- Proper TypeScript types (avoid `any`)
- Component/function size (not too large)

Export `ALL_PLAYBOOKS` array with all three playbooks.

### 3. Update Claude AI Prompt

Modify the existing PR analysis function to:

**Accept playbooks parameter:**
```typescript
async function generatePRAnalysis(
  prData: PRData,
  selectedPlaybooks: Playbook[]
)
```

**Update prompt structure:**
```
You are analyzing a GitHub Pull Request. Provide comprehensive code review.

[IF PLAYBOOKS ENABLED]
CRITICAL: Check this PR against these team standards:

[For each playbook]
  ### {Playbook Name} Standards
  [For each rule]
    - **[SEVERITY]** {description}
      {examples if available}

For each standard:
1. Review if PR code affects this area
2. Check for compliance  
3. If violations: cite file/line numbers and suggest fixes
4. Use emojis: ✅ (passing), ⚠️ (warning), 🚫 (blocking)

[END IF]

PR Details:
Title: {title}
Description: {description}
Files Changed: {count}

Code Changes:
{diff}

Provide analysis in this format:

## 📋 Summary
[Brief overview]

## 🎯 Team Standards Check
[If playbooks enabled: show results by playbook with pass/fail for each rule]
[If no playbooks: "[No team playbooks selected]"]

## ⚠️ Potential Issues  
[Edge cases, bugs, logic issues]

## 🧪 Suggested Tests
[Unit tests to add]
```

**Output Formatting:**
- Playbook results should clearly show each rule check
- Use checkboxes: ✅ Passing, ⚠️ Warning, 🚫 Blocking
- Include file/line citations for violations
- Provide code snippet fixes when possible

### 4. Playbook Storage & Selection

For MVP, create a simple way to specify playbooks:

**Option A - GitHub Action Input (easiest for MVP):**
Update `.github/workflows/solon-review.yml` to accept playbook selection:
```yaml
with:
  anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
  playbooks: 'accessibility,security,best-practices'
```

**Option B - Config File (slightly better):**
Support optional `.solon.config.json` in repo root:
```json
{
  "playbooks": ["accessibility", "security", "best-practices"]
}
```

If file doesn't exist, default to all playbooks enabled.

Create `lib/config/loadPlaybookConfig.ts` to read this file.

Choose Option B if possible, fallback to Option A if simpler.

### 5. Update API Route

Update `/api/review` endpoint to:
1. Load playbook configuration (from config file or default to all)
2. Get selected playbooks from `ALL_PLAYBOOKS`
3. Pass selected playbooks to `generatePRAnalysis()`
4. Ensure playbook results are included in GitHub comment

### 6. Testing

Create a demo PR in your test repo that intentionally violates several rules:
- Missing alt text on image
- Hardcoded API key
- console.log statements
- Missing error handling

Run Solon AI review and verify:
- All violations are detected
- File/line numbers are cited
- Fixes are suggested
- Formatting is clear and readable

## File Structure

Expected new/modified files:
```
lib/
  playbooks/
    types.ts          [NEW]
    presets.ts        [NEW]
  config/
    loadPlaybookConfig.ts  [NEW - if using config file]
  ai/
    generateAnalysis.ts    [MODIFY - update Claude prompt]
api/
  review.ts         [MODIFY - load and pass playbooks]
.solon.config.json  [NEW - optional config file in root]
```

## Success Criteria

- [ ] Three preset playbooks created with comprehensive rules
- [ ] Claude prompt updated to check against playbook rules  
- [ ] PR comments show clear playbook results section
- [ ] Violations include file/line citations and suggested fixes
- [ ] Configuration method implemented (file or workflow input)
- [ ] Tested with demo PR showing violations detected

## Important Notes

- Keep the prompt focused - don't make it too long or Claude will lose focus
- Use clear severity indicators (blocking should be obvious)
- Provide actionable fixes, not just problems
- Format output to be skimmable (developers scan quickly)
- Don't break existing functionality (summary, issues, tests sections)

## Current Code Location

My existing Solon AI code is at: [provide your repo path or indicate if this is a new directory]

The main API endpoint that needs updating is: `pages/api/review.ts` or `app/api/review/route.ts` depending on your Next.js structure.

## Implementation Approach

Please:
1. Create all new files with complete implementations
2. Show me the updates needed for existing files (with clear before/after)
3. Use TypeScript strict mode
4. Include helpful code comments
5. Follow existing code style in the project
6. Prioritize simplicity for MVP - we can enhance later

Start with the playbook definitions and type system, then move to prompt updates, then configuration loading.
