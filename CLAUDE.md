# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Solon AI** (also called Aegis) is a GitHub App that provides automated AI-powered code reviews for pull requests. It uses Anthropic's Claude API to analyze git diffs and generate comprehensive feedback including:
- Plain-English summaries of changes
- Edge case detection and potential blind spots
- Auto-generated Jest unit tests

This is a Next.js 15 application with TypeScript, deployed via Vercel, and integrates with GitHub via GitHub Actions.

## Common Commands

### Development
```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build for production with Turbopack
npm start           # Start production server
npm run lint        # Run ESLint
npm test            # Run Jest tests
```

### Testing
Since there's no jest.config.js yet, create one if needed:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Architecture

### Core Components

**API Route: `/api/analyze`** (`src/app/api/analyze/route.ts`)
- Single POST endpoint that receives git diffs from GitHub Actions
- Calls Claude API with a master prompt engineering template
- Returns structured JSON with: summary, edgeCases, and unitTests
- Includes robust JSON extraction logic to handle malformed Claude responses
- Uses `ANTHROPIC_API_KEY` environment variable

**Key Functions:**
- `callClaudeAPI(diff: string)`: Handles API communication and response parsing
- `POST(request: Request)`: HTTP request handler, validates input and formats output

**Services** (`src/services/`)
- `userService.ts`: Example service with intentional bugs for testing Solon's review capabilities

**Utilities** (`src/utils/`)
- `math.ts`: Math utilities (e.g., `calculateAverage`)
- `number.ts`: Number utilities

### GitHub Integration

**Workflow: `.github/workflows/solon.yml`**
- Triggers on PR open/synchronize events
- Uses GitHub App authentication (requires `SOLON_APP_ID` and `SOLON_PRIVATE_KEY` secrets)
- Fetches git diff between base and head
- POSTs diff to `SOLON_API_URL` (Vercel deployment)
- Creates or updates comment on PR with formatted review

**CI Workflow: `.github/workflows/ci.yml`**
- Runs on push to main and PRs
- Executes: lint → test → build

### Environment Variables
Required in `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Required in GitHub Secrets:
```
SOLON_APP_ID=<github-app-id>
SOLON_PRIVATE_KEY=<github-app-private-key>
SOLON_API_URL=https://aegis-backend.vercel.app/api/analyze
```

### Path Aliases
Use `@/` to reference the `src/` directory:
```typescript
import { calculateAverage } from '@/utils/math';
```

## Code Review Focus

When reviewing or modifying code, pay special attention to:

1. **Prompt Engineering**: The master prompt in `/api/analyze/route.ts` is critical. Changes here affect all reviews.
2. **JSON Parsing Logic**: Lines 77-102 in route.ts handle malformed Claude responses. This is fragile and important.
3. **Error Handling**: Both API route and GitHub workflow must handle failures gracefully.
4. **Response Structure**: The API contract (`ReviewResult` interface) must remain stable for the GitHub Action to work.

## Known Patterns

- **Client Components**: Use `"use client"` directive for components with interactivity
- **Next.js 15 Features**: Uses App Router, Turbopack, and React 19
- **Styling**: Currently uses inline styled-jsx in page components
- **Testing**: Uses Jest with Testing Library setup

## Deployment

- Hosted on Vercel
- Automatic deployments on push to main
- Environment variables configured in Vercel dashboard
