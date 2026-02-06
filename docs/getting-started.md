# Getting Started

This guide walks you through your first Solon AI code review and shows you how to make the most of AI-powered feedback.

## Your First Code Review

### Step 1: Create a Test Branch

```bash
# Create a new branch
git checkout -b feature/test-solon-ai

# Make a simple code change
echo "function greet(name) { return 'Hello ' + name; }" > greeting.js

# Commit and push
git add greeting.js
git commit -m "Add greeting function"
git push origin feature/test-solon-ai
```

### Step 2: Open a Pull Request

1. Go to your repository on GitHub
2. Click **"Pull requests"** → **"New pull request"**
3. Select your branch
4. Add title: "Test Solon AI code review"
5. Click **"Create pull request"**

### Step 3: Wait for Review

- GitHub Action triggers automatically
- Solon AI analyzes your changes
- Review appears in 20-40 seconds
- Look for a comment from **solon-ai[bot]**

### Step 4: Read the Review

A typical Solon AI review contains:

```markdown
## 🤖 Solon AI Code Review

### Overview
Analyzed 1 file with 1 function addition.

### Code Quality Analysis
✅ Function is simple and readable
⚠️ Missing input validation for `name` parameter
💡 Consider handling null/undefined cases

### Potential Issues
1. **Missing validation** - `greeting.js:1`
   - Function doesn't validate input
   - Could return "Hello undefined" or "Hello null"
   - Recommendation: Add type checking

### Suggested Tests
```javascript
describe('greet', () => {
  it('should return greeting with name', () => {
    expect(greet('Alice')).toBe('Hello Alice');
  });

  it('should handle empty string', () => {
    expect(greet('')).toBe('Hello ');
  });

  it('should handle undefined', () => {
    expect(greet()).toBe('Hello undefined');
  });
});
```

### Summary
Minor issues found. Consider adding input validation.
```

## Understanding Review Sections

### Overview
Quick summary of what was analyzed:
- Number of files changed
- Lines added/removed
- Primary changes detected

### Code Quality Analysis
General feedback on code structure, readability, and patterns:
- ✅ **Positive findings** - Good practices identified
- ⚠️ **Warnings** - Potential improvements
- 💡 **Suggestions** - Enhancement ideas

### Potential Issues
Specific problems that could cause bugs:
- **Severity levels:** Critical, High, Medium, Low
- **Location:** File name and line number
- **Recommendation:** How to fix

### Suggested Tests
Unit test examples covering:
- Happy path scenarios
- Edge cases
- Error conditions
- Boundary values

### Summary
Overall assessment and priority recommendations.

## Acting on Reviews

### Prioritizing Feedback

**Must Fix (Critical/High):**
- Security vulnerabilities
- Logic errors that break functionality
- Memory leaks or performance issues

**Should Fix (Medium):**
- Input validation issues
- Missing error handling
- Poor code organization

**Nice to Have (Low):**
- Style improvements
- Minor optimizations
- Documentation suggestions

### Example: Addressing Feedback

Original code with issues:
```javascript
// greeting.js
function greet(name) {
  return 'Hello ' + name;
}
```

After addressing Solon AI feedback:
```javascript
// greeting.js
/**
 * Greets a user by name
 * @param {string} name - The name to greet
 * @returns {string} Greeting message
 */
function greet(name) {
  if (!name || typeof name !== 'string') {
    return 'Hello stranger';
  }
  return `Hello ${name.trim()}`;
}

module.exports = { greet };
```

Changes made:
- ✅ Added input validation
- ✅ Handles null/undefined cases
- ✅ Uses template literals
- ✅ Trims whitespace
- ✅ Added JSDoc comments
- ✅ Exported for testing

### Responding to Reviews

You can reply to Solon AI comments:

**Ask for clarification:**
> "@solon-ai Can you explain why this is a security risk?"

**Disagree respectfully:**
> "Thanks for the suggestion, but we intentionally allow undefined here because..."

**Request more context:**
> "@solon-ai Can you suggest an alternative approach?"

Note: V1 doesn't support interactive responses, but future versions will!

## Real-World Examples

### Example 1: API Endpoint Review

**Your code:**
```javascript
app.post('/api/users', (req, res) => {
  const user = req.body;
  db.users.insert(user);
  res.send({ success: true });
});
```

**Solon AI finds:**
- ❌ No input validation
- ❌ No error handling
- ❌ Potential SQL injection
- ❌ No authentication check
- ⚠️ Synchronous database call blocks event loop

**After fixes:**
```javascript
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Use parameterized query
    const user = await db.users.insert({
      name: sanitize(name),
      email: email.toLowerCase()
    });

    res.status(201).json({ success: true, userId: user.id });
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Example 2: React Component Review

**Your code:**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));

  return <div>{user.name}</div>;
}
```

**Solon AI finds:**
- ❌ Fetch in component body causes infinite loop
- ❌ No error handling
- ❌ Crashes if user is null
- ⚠️ No loading state
- 💡 Missing cleanup for unmounted component

**After fixes:**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();

        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
```

## Tips for Best Results

### 1. Keep PRs Focused
- **Ideal size:** 100-400 lines changed
- **One concern:** Single feature or bug fix
- **Why:** Smaller PRs get more detailed, accurate reviews

### 2. Write Clear PR Descriptions
Good description helps Solon AI understand context:
```markdown
## What
Adds user authentication middleware

## Why
Required for securing admin endpoints

## Changes
- New authenticateToken middleware
- JWT token validation
- Error handling for expired tokens
```

### 3. Commit Clean Code
- Run linter before committing
- Remove console.logs
- Fix obvious typos
- Why: AI focuses on logic, not formatting

### 4. Review Incrementally
- Read reviews as they come
- Fix issues in new commits
- Don't wait until the end

### 5. Combine with Human Review
Solon AI complements, doesn't replace, human reviewers:
- **AI catches:** Syntax, patterns, common bugs
- **Humans catch:** Architecture, business logic, UX

## Common Workflow

```
1. Write code
2. Self-review (quick check)
3. Open PR
4. Solon AI reviews (30 seconds)
5. Address AI feedback
6. Push fixes
7. Request human review
8. Merge
```

## Next Steps

Now that you understand the basics:

- **[Understanding Reviews](understanding-reviews.md)** - Deep dive into review interpretation
- **[Best Practices](best-practices.md)** - Optimize your workflow
- **[Configuration](configuration.md)** - Customize review behavior

## Quick Reference

### Review Speed
- Small PR (< 100 lines): ~20 seconds
- Medium PR (100-400 lines): ~30 seconds
- Large PR (400-1000 lines): ~45 seconds

### When Reviews Trigger
- Opening new PR
- Pushing new commits to PR
- Synchronizing PR with base branch

### What Gets Reviewed
- JavaScript files (.js, .jsx)
- TypeScript files (.ts, .tsx)
- Files in `src/`, `lib/`, `app/` directories
- Excludes: tests, build files, node_modules

---

**Ready to dive deeper?** Check out [Understanding Reviews](understanding-reviews.md) →
