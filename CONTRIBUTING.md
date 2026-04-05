# Contributing to Solon AI

First off, thank you for considering contributing to Solon AI! 🎉

It's people like you that make Solon AI such a great tool. We welcome contributions from everyone, whether it's:

- 🐛 Reporting a bug
- 💡 Suggesting a new feature
- 📝 Improving documentation
- 🔧 Submitting a bug fix
- ✨ Implementing a new feature

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git
- An Anthropic API key (free $5 credit available)

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Solon.git
   cd Solon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   # Add your ANTHROPIC_API_KEY to .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Verify everything works**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

### Project Structure

```
Solon/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   └── analyze/  # Main analysis endpoint
│   │   └── page.tsx      # Landing page
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── docs/                 # Documentation
├── .github/
│   └── workflows/        # CI/CD workflows
├── tests/                # Test files
└── public/               # Static assets
```

## Development Workflow

### 1. Create a Branch

Create a branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run build
npm run build

# Test locally
npm run dev
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add support for Python language detection"
git commit -m "fix: resolve edge case in diff parsing"
git commit -m "docs: update installation instructions"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub!

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated (if needed)
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. Automated checks run (CI/CD)
2. Solon AI reviews your code (dogfooding! 🐕)
3. Maintainers review the PR
4. Address any feedback
5. PR gets merged!

**Note:** We may ask you to make changes before merging. This is normal and helps maintain code quality!

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use `const` over `let` when possible
- Prefer functional patterns over imperative
- Use async/await over promises
- Add JSDoc comments for public APIs

**Example:**
```typescript
/**
 * Detects the primary programming language from a git diff
 * @param diff - The git diff string to analyze
 * @returns The detected language or 'javascript' as default
 */
export function detectLanguageFromDiff(diff: string): string {
  // Implementation
}
```

### Code Style

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for strings
- **Semicolons:** Use them
- **Line length:** Max 100 characters (soft limit)
- **Imports:** Organize by external → internal → relative

### React/Next.js

- Use functional components with hooks
- Use `"use client"` directive only when needed
- Keep components small and focused
- Prefer composition over inheritance

### API Design

- RESTful conventions
- Proper HTTP status codes
- Consistent error responses
- Validate input thoroughly

## Testing Guidelines

### Writing Tests

```typescript
import { describe, it, expect } from '@jest/globals';

describe('detectLanguageFromDiff', () => {
  it('should detect TypeScript from .ts files', () => {
    const diff = '+++ b/src/utils/helper.ts';
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should handle empty diffs', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });

  it('should detect Python from .py files', () => {
    const diff = '+++ b/main.py';
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Test happy paths and edge cases
- Test error handling
- Mock external dependencies (API calls, etc.)

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- detectLanguage.test.ts

# Watch mode
npm test -- --watch
```

## Documentation

### When to Update Docs

Update documentation when you:

- Add a new feature
- Change existing behavior
- Fix a bug that affects user experience
- Add/change API endpoints
- Update configuration options

### Where to Update

- **README.md** - Main project overview, quick start
- **docs/** - Detailed guides and tutorials
- **CLAUDE.md** - Developer context for AI assistants
- **Code comments** - Complex logic, business rules
- **API docs** - Endpoint changes

## Community

### Getting Help

- 💬 [GitHub Discussions](https://github.com/Solon-Dev/Solon/discussions) - Ask questions
- 🐛 [GitHub Issues](https://github.com/Solon-Dev/Solon/issues) - Report bugs
- 📧 Email: support@solon-ai.dev

### Ways to Contribute

#### 🐛 Found a Bug?

1. Check if it's already reported in [Issues](https://github.com/Solon-Dev/Solon/issues)
2. If not, open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

#### 💡 Have an Idea?

1. Check [Discussions](https://github.com/Solon-Dev/Solon/discussions) first
2. Open a discussion to gather feedback
3. If approved, create an issue
4. Implement and submit a PR!

#### 📝 Improve Documentation?

Documentation improvements are always welcome! Even fixing typos helps.

#### 🌍 Translate?

We'd love to support more languages. Open an issue to discuss!

## Good First Issues

New to the project? Look for issues labeled:

- `good first issue` - Perfect for newcomers
- `help wanted` - We'd love your help!
- `documentation` - Improve our docs

## Feature Requests

We love new ideas! Before submitting:

1. **Search existing issues** - Maybe it's already proposed
2. **Open a discussion** - Gather community feedback
3. **Explain the use case** - Why is this needed?
4. **Provide examples** - Show how it would work
5. **Consider alternatives** - Are there other approaches?

## Recognition

Contributors will be:

- Added to our contributors list
- Mentioned in release notes
- Featured in our README (for significant contributions)

## Questions?

Don't hesitate to ask! Open a [Discussion](https://github.com/Solon-Dev/Solon/discussions) or reach out to the maintainers.

---

**Thank you for contributing to Solon AI!** 🚀

Every contribution, no matter how small, makes a difference. We're excited to work with you!
