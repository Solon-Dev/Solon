# Best Practices

Optimize your workflow with Solon AI and get the most valuable feedback from your code reviews.

## Writing Code for Better Reviews

### 1. Keep Pull Requests Focused

**Ideal PR size:**
- **Sweet spot:** 100-400 lines changed
- **Maximum:** 800 lines for detailed review
- **Minimum:** 20 lines (smaller gets skipped by default)

**Why it matters:**
- Smaller PRs get more detailed analysis
- Easier for AI to maintain context
- Faster review time
- More actionable feedback

**Bad PR:**
```
✗ "Refactor user system, add authentication, update UI theme"
  - 47 files changed
  - 2,847 lines added
  - Multiple unrelated concerns
```

**Good PR:**
```
✓ "Add JWT authentication middleware"
  - 3 files changed
  - 156 lines added
  - Single, focused feature
```

### 2. Structure Commits Logically

**Good commit flow:**
```bash
git commit -m "Add user authentication middleware"
git commit -m "Add JWT token validation"
git commit -m "Add authentication tests"
```

**Why:**
- Solon AI can understand progression
- Easier to isolate specific changes
- Better context for suggestions

**Avoid:**
```bash
git commit -m "WIP"
git commit -m "fix"
git commit -m "more fixes"
git commit -m "final fix hopefully"
```

### 3. Write Descriptive PR Descriptions

**Template to use:**

```markdown
## What
[Brief description of changes]

## Why
[Reason for changes - context matters!]

## How
[Approach taken]

## Testing
[How you tested]

## Notes
[Any important context for reviewers]
```

**Example:**
```markdown
## What
Add rate limiting to API endpoints

## Why
Prevent abuse and ensure fair usage across users

## How
- Implemented Redis-based rate limiter
- 100 requests per hour per user
- Returns 429 status when exceeded

## Testing
- Unit tests for rate limiter logic
- Integration tests with Redis
- Manual testing with load tool

## Notes
Rate limits configurable via environment variables
```

**Why it helps:**
Solon AI uses PR description for context, leading to more relevant feedback.

### 4. Clean Up Before Committing

**Pre-commit checklist:**
- [ ] Remove console.log statements
- [ ] Remove commented-out code
- [ ] Fix linting errors
- [ ] Remove unused imports
- [ ] Check for TODO comments

**Why:**
- AI focuses on logic, not cleanup
- Get feedback on real issues
- Professional code presentation

### 5. Follow Consistent Patterns

**Maintain consistency:**
```javascript
// If your codebase uses async/await:
async function fetchUser(id) {
  return await api.get(`/users/${id}`);
}

// Don't mix with promises:
function fetchProduct(id) {
  return api.get(`/products/${id}`).then(r => r);
}
```

**Why:**
- AI recognizes and reinforces patterns
- Easier for team maintenance
- Better code quality suggestions

## Optimizing Review Quality

### 1. Provide Context in Code

**Use comments for complex logic:**
```javascript
// Good: Explains WHY
// Using quadratic probing to resolve hash collisions
// Linear probing caused clustering with our data distribution
function probe(key, attempt) {
  return (hash(key) + attempt * attempt) % TABLE_SIZE;
}

// Bad: States WHAT (obvious from code)
// This function probes
function probe(key, attempt) {
  return (hash(key) + attempt * attempt) % TABLE_SIZE;
}
```

**Add business context:**
```javascript
// Per business rules: refunds only within 30 days
// and only for non-digital products
function canRefund(order) {
  const daysSincePurchase = (Date.now() - order.date) / (1000 * 60 * 60 * 24);
  return daysSincePurchase <= 30 && !order.isDigital;
}
```

### 2. Write Self-Documenting Code

**Good naming:**
```javascript
// Clear intent
function calculateShippingCost(weight, distance, isPriority) {
  // ...
}

// vs unclear
function calc(w, d, p) {
  // ...
}
```

**Extract magic numbers:**
```javascript
// Good
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

if (attempts >= MAX_LOGIN_ATTEMPTS) {
  lockAccount(LOCKOUT_DURATION_MS);
}

// Bad
if (attempts >= 5) {
  lockAccount(900000);
}
```

### 3. Add Type Information

**For JavaScript:**
```javascript
/**
 * Calculates discount amount
 * @param {number} price - Original price
 * @param {number} percentage - Discount percentage (0-100)
 * @returns {number} Discounted price
 */
function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100);
}
```

**For TypeScript:**
```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}
```

**Why:**
- AI gives more precise feedback
- Catches type-related issues
- Better test suggestions

### 4. Separate Concerns

**Good separation:**
```javascript
// Data fetching
async function fetchUserData(userId) {
  return await api.get(`/users/${userId}`);
}

// Validation
function validateUser(user) {
  if (!user.email) throw new Error('Email required');
  if (!isValidEmail(user.email)) throw new Error('Invalid email');
}

// Business logic
function processUser(user) {
  validateUser(user);
  return {
    ...user,
    email: user.email.toLowerCase(),
    createdAt: Date.now()
  };
}
```

**Why:**
- Each function gets focused review
- Easier to identify specific issues
- More relevant test suggestions

## Team Workflow Best Practices

### 1. Review Reviews as a Team

**Weekly review session:**
- Pick 2-3 Solon AI reviews
- Discuss: Was feedback accurate?
- Identify: Common patterns
- Action: Update configuration if needed

**Example discussion:**
```
Team Lead: "Solon keeps suggesting we split large functions"
Developer: "Yeah, but our utility functions are meant to be comprehensive"
Decision: Update config to increase function length threshold
```

### 2. Create Team Standards Document

**Based on Solon AI feedback, document:**
- Accepted patterns
- Rejected patterns
- Rationale for decisions

**Example:**
```markdown
# Team Coding Standards

## Error Handling
✓ Always use try/catch for async operations
✗ Don't use .catch() - use async/await instead
Why: Consistency and easier error tracking

## Input Validation
✓ Validate at API boundaries
✗ Don't validate internal function calls
Why: Performance - trust internal code
```

### 3. Configure for Your Stack

**Custom configuration example:**
```yaml
# .solon-ai.yml
custom_instructions: |
  Our codebase:
  - Uses React hooks exclusively (no class components)
  - Follows Airbnb style guide
  - Prefers functional programming patterns
  - Uses Zod for runtime validation
  - Testing with Vitest (not Jest)

  Code patterns:
  - Use React Query for data fetching
  - All errors logged via our Logger utility
  - Prefer named exports over default exports
```

### 4. Balance AI and Human Review

**Optimal workflow:**

```
1. Developer writes code
2. Self-review (5 mins)
3. Open PR
4. Solon AI reviews (30 seconds)
5. Developer fixes critical/high issues
6. Push fixes
7. Solon AI re-reviews
8. Request human review
9. Human reviews architecture/business logic
10. Merge
```

**Division of responsibility:**

**Solon AI catches:**
- Syntax errors
- Common bugs
- Missing error handling
- Security issues
- Test coverage gaps

**Humans review:**
- Architecture decisions
- Business logic correctness
- UX considerations
- API design
- Long-term maintainability

## Handling Different Scenarios

### New Features

**Best approach:**
1. Start with small, focused PR
2. Get AI review on core logic
3. Fix issues
4. Add tests based on suggestions
5. Add documentation
6. Larger refactors in follow-up PRs

**Example sequence:**
```
PR #1: "Add user registration endpoint (core logic)"
PR #2: "Add user registration validation"
PR #3: "Add user registration tests"
PR #4: "Add user registration documentation"
```

### Bug Fixes

**Best approach:**
1. Write failing test first
2. Open PR with test only
3. Get AI feedback on test quality
4. Implement fix
5. Push fix and verify test passes

**Why:**
- Proves bug exists
- AI validates test coverage
- Prevents regression

### Refactoring

**Best approach:**
1. Keep behavior identical
2. Change structure only
3. One refactor per PR
4. Include before/after examples in description

**Example PR description:**
```markdown
## Refactor: Extract validation logic

### Before
- Validation scattered across 5 controllers
- Duplicated code in each endpoint

### After
- Centralized in validation middleware
- Single source of truth
- Easier to maintain and test

### Behavior
No functional changes - all tests still pass
```

**Why:**
- AI can verify no behavior change
- Easier to review
- Lower risk

### Hotfixes

**Best approach:**
1. Minimal change to fix issue
2. Add test proving fix works
3. Create follow-up issue for proper solution
4. Mark PR with "hotfix" label

**Configuration:**
```yaml
# .solon-ai.yml
filters:
  # Don't skip hotfixes even if small
  min_pr_size: 1

  # Quick review for hotfixes
  skip_labels: []  # Review everything
```

## Advanced Techniques

### 1. Staged Rollouts

**For major features:**

```
Week 1: Core functionality (behind feature flag)
Week 2: Error handling and edge cases
Week 3: Performance optimization
Week 4: Documentation and examples
Week 5: Remove feature flag
```

**Each PR gets focused review:**
- Week 1 PR: Logic and architecture
- Week 2 PR: Error scenarios
- Week 3 PR: Performance patterns
- Week 4 PR: Documentation quality

### 2. Test-First Development

**Workflow:**
1. Write tests based on requirements
2. Open PR with tests (failing)
3. Solon AI reviews test coverage
4. Implement code to pass tests
5. Push implementation
6. Solon AI verifies implementation

**Benefits:**
- Better test quality from AI feedback
- Implementation focused on passing tests
- Clear requirements from tests

### 3. Incremental Improvements

**Instead of:**
```
"Refactor entire authentication system"
- 45 files changed
- 3,200 lines
```

**Do:**
```
PR #1: "Extract JWT utilities"
PR #2: "Standardize error handling"
PR #3: "Add input validation"
PR #4: "Improve test coverage"
PR #5: "Update documentation"
```

**Why:**
- Each PR gets thorough review
- Easier to identify regressions
- Can merge incrementally
- Lower risk per change

### 4. Documentation-Driven Development

**Workflow:**
1. Write API documentation first
2. Open PR with docs only
3. Get feedback on interface design
4. Implement to match docs
5. Documentation stays current

**Example:**
```javascript
/**
 * User Authentication Service
 *
 * Provides secure authentication using JWT tokens.
 *
 * @example
 * const auth = new AuthService(config);
 * const token = await auth.login(email, password);
 * const user = await auth.verifyToken(token);
 */
class AuthService {
  // Implementation follows docs
}
```

## Configuration Tuning

### For New Projects

**Start conservative:**
```yaml
version: 1
enabled: true

review:
  max_tokens: 6000  # Detailed feedback
  min_confidence: 0.6  # Cast wide net

filters:
  min_pr_size: 10
  max_pr_size: 500  # Force small PRs
```

**Why:**
- Catch issues early
- Establish good patterns
- Build team habits

### For Mature Projects

**More focused:**
```yaml
version: 1
enabled: true

review:
  max_tokens: 4000  # Faster reviews
  min_confidence: 0.8  # High confidence only

filters:
  min_pr_size: 50
  max_pr_size: 1000  # Allow larger PRs

custom_instructions: |
  Focus on:
  - Security issues
  - Performance regressions
  - Breaking API changes
```

**Why:**
- Team knows patterns
- Focus on critical issues
- Faster feedback loop

### For Different Teams

**Frontend team:**
```yaml
review:
  include_tests: true

custom_instructions: |
  Focus on:
  - React hooks usage
  - Component performance
  - Accessibility issues
  - State management patterns
```

**Backend team:**
```yaml
review:
  include_security: true

custom_instructions: |
  Focus on:
  - Database query optimization
  - API endpoint security
  - Error handling
  - Async/await patterns
```

## Measuring Success

### Metrics to Track

**Review quality:**
- Average issues per PR (should decrease over time)
- Critical issues found (should approach zero)
- False positive rate (should be < 20%)

**Team velocity:**
- Time from PR open to first review
- Time to address feedback
- PRs merged per week

**Code quality:**
- Bugs in production (should decrease)
- Test coverage (should increase)
- Code consistency (should improve)

### Setting Goals

**Month 1:**
- Get team comfortable with Solon AI
- Establish configuration baseline
- Track initial metrics

**Month 2:**
- Reduce critical issues by 50%
- Improve PR sizes (target 200-400 lines)
- Increase test coverage by 10%

**Month 3:**
- Zero critical issues
- 90% of PRs follow team patterns
- 80%+ test coverage

**Month 6:**
- Team creates internal best practices guide
- Configuration optimized for workflow
- Measurable reduction in production bugs

## Common Pitfalls to Avoid

### 1. Ignoring All Feedback

**Wrong:**
> "AI doesn't understand our context, ignore everything"

**Right:**
> "AI found a security issue and two logic bugs. Let's fix those and discuss the style suggestions as a team."

### 2. Following Blindly

**Wrong:**
> "AI said refactor, so I rewrote everything"

**Right:**
> "AI suggested refactoring. Let me evaluate if this improves maintainability for our use case."

### 3. Over-Configuring

**Wrong:**
```yaml
# 200 lines of custom rules
# Conflicting instructions
# Team can't remember rules
```

**Right:**
```yaml
# 10-20 lines of key patterns
# Clear, consistent rules
# Well documented
```

### 4. Not Iterating on Config

**Wrong:**
> "Set it once, never change it"

**Right:**
> "Monthly review of config based on team feedback and metrics"

### 5. Using as Replacement for Human Review

**Wrong:**
> "Solon AI approved it, merge without human review"

**Right:**
> "Solon AI caught the bugs. Now let's get human review on the architecture."

## Quick Wins

### Week 1
- [ ] Install Solon AI
- [ ] Run on 5 test PRs
- [ ] Fix one critical issue it found
- [ ] Share results with team

### Week 2
- [ ] Create basic configuration
- [ ] Document one team pattern
- [ ] Track metrics (issues found, time saved)

### Week 3
- [ ] Tune configuration based on feedback
- [ ] Add custom instructions
- [ ] Reduce PR sizes to 200-400 lines

### Month 1
- [ ] Zero critical issues in new PRs
- [ ] Team comfortable with workflow
- [ ] Baseline metrics established

## Resources

### Example Configurations

See [Configuration](configuration.md) for detailed examples.

### Team Templates

**PR Template:**
```markdown
## Description
[What changed]

## Context
[Why this change]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No console errors

## Checklist
- [ ] Solon AI feedback addressed
- [ ] Breaking changes documented
- [ ] Changelog updated
```

**Review Checklist:**
```markdown
## Reviewer Checklist
- [ ] Solon AI critical/high issues resolved
- [ ] Business logic makes sense
- [ ] API design is clear
- [ ] Error handling is comprehensive
- [ ] Tests cover edge cases
- [ ] Documentation is updated
```

---

**Next:** Solve common problems in [Troubleshooting](troubleshooting.md) →
