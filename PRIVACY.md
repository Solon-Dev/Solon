# Privacy Policy - Solon AI

**Last Updated:** November 18, 2025

## Overview
Solon AI is a GitHub App that provides AI-powered code reviews. We are committed to protecting your privacy.

## Data We Collect
**None.** Solon AI does not collect, store, or retain any user data.

## How It Works
1. When you open a pull request, GitHub Actions triggers our service
2. Your code diff is sent directly from your repository to Anthropic's API using **your own API key**
3. The AI analysis is returned and posted as a comment
4. **No data passes through or is stored by Solon AI**

## Third-Party Services
- **Anthropic Claude API**: Code diffs are sent to Anthropic for analysis using your API key
- **GitHub**: Standard GitHub App permissions for reading PRs and posting comments
- **Vercel**: Hosts our API endpoint (stateless, no data storage)

## Your API Key
- Stored securely in **your** GitHub repository secrets
- Never transmitted to or accessible by Solon AI
- You maintain full control and can revoke anytime

## Data Security
- All communication uses HTTPS encryption
- No databases, no logs, no data retention
- Open source - audit our code yourself

## GDPR Compliance
We are GDPR compliant by design:
- No personal data collected
- No data processing
- No data retention
- No cookies or tracking

## Your Rights
You control all data:
- Your code stays in your repository
- Your API key stays in your secrets
- Uninstall anytime with zero data to delete

## Changes to This Policy
We will update this page if our privacy practices change.

## Contact
Questions? Open an issue: https://github.com/Solon-Dev/Solon/issues

---

**TL;DR:** We don't collect or store anything. Your code goes from your repo → Anthropic's API (using your key) → back to your repo as a comment. That's it.
