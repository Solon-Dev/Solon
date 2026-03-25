# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

The Solon AI team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

**security@solon-ai.dev**

If you prefer, you can also use GitHub's private vulnerability reporting:

1. Go to the [Security tab](https://github.com/Solon-Dev/Solon/security)
2. Click "Report a vulnerability"
3. Fill out the form with details

### What to Include

Please include the following information in your report:

- **Type of issue** (e.g., SQL injection, XSS, authentication bypass)
- **Full path of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

### What to Expect

After you submit a vulnerability report, here's what happens:

1. **Acknowledgment** - We'll confirm receipt within 48 hours
2. **Investigation** - We'll investigate and validate the issue (typically 3-5 business days)
3. **Fix Development** - We'll develop a fix and create a patch
4. **Disclosure** - We'll coordinate disclosure timeline with you
5. **Credit** - You'll be credited in the security advisory (unless you prefer anonymity)

### Security Best Practices for Users

When using Solon AI:

1. **Never commit API keys** - Always use environment variables
2. **Rotate keys regularly** - Update your Anthropic API key periodically
3. **Use GitHub Secrets** - Store sensitive values in GitHub Actions secrets
4. **Monitor usage** - Check your Anthropic dashboard for unexpected API usage
5. **Keep dependencies updated** - Run `npm audit` and update packages regularly

### Scope

The following are **in scope** for vulnerability reports:

- ✅ Authentication/authorization issues
- ✅ Injection vulnerabilities (SQL, XSS, etc.)
- ✅ Sensitive data exposure
- ✅ API security issues
- ✅ Denial of Service (DoS)
- ✅ GitHub Actions workflow security

The following are **out of scope**:

- ❌ Social engineering attacks
- ❌ Physical attacks
- ❌ Issues in third-party dependencies (report to the maintainer)
- ❌ Issues requiring physical access to servers

### Bug Bounty Program

We don't currently offer a bug bounty program, but we deeply appreciate responsible disclosure and will:

- Credit you in our security advisories
- Acknowledge your contribution in our CHANGELOG
- Provide swag/stickers (when available)

### Security Updates

Security updates will be released as soon as possible and announced via:

- GitHub Security Advisories
- Release notes
- Repository README

### Questions

If you have questions about this policy, please open a discussion in the [Discussions tab](https://github.com/Solon-Dev/Solon/discussions).

---

**Thank you for helping keep Solon AI and our users safe!** 🔒
