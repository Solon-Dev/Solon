# 🛡️ Solon AI - AI-Powered Code Reviews for Every Pull Request

**Solon AI** automatically reviews your pull requests using Claude AI, catching bugs, identifying edge cases, and generating unit tests before human review.

> 🎉 **Free Forever** with Bring Your Own API Key (BYOK)

[![Install on GitHub](https://img.shields.io/badge/Install-GitHub%20App-blue)](https://github.com/apps/solon-ai)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange)](https://anthropic.com)

---

## ✨ Features

- 🤖 **Automated PR Analysis** - Reviews every pull request automatically
- 🐛 **Bug Detection** - Identifies logic errors and potential issues  
- 🎯 **Edge Case Discovery** - Finds scenarios you might have missed
- ✅ **Unit Test Generation** - Automatically generates Jest test suites
- ⚡ **Fast Reviews** - Get feedback in 10-30 seconds
- 💬 **Clear Summaries** - Plain-English explanations of changes
- 🔒 **Your API Key, Your Control** - Pay only for what you use

---

## 🚀 Setup (Takes 3 Minutes)

### Step 1: Get Your Anthropic API Key (FREE $5 Credit)

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-...`)

**💡 Anthropic gives you $5 free credit = ~80 free code reviews!**

---

### Step 2: Add API Key to Your Repository

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ANTHROPIC_API_KEY`
5. Value: Paste your API key
6. Click **Add secret**

---

### Step 3: Install Solon AI

1. Visit [github.com/apps/solon-ai](https://github.com/apps/solon-ai)
2. Click **Install**
3. Select repositories to enable
4. Click **Install**

---

### Step 4: Open a Pull Request

That's it! Solon AI will automatically review your next PR.

**Within 30 seconds, you'll see a comment from `solon-ai[bot]` with:**
- 📝 Summary of changes
- 🎯 Edge cases to consider
- ✅ Suggested unit tests

---

## 💰 Pricing

### Free Tier (BYOK) 🎉

**Cost:** Pay Anthropic directly (~$0.03-0.06 per review)

**What You Get:**
- ✅ Unlimited PR reviews
- ✅ All features included
- ✅ No monthly fees
- ✅ No vendor lock-in

**Typical Monthly Costs:**
- **Small team** (50 PRs): ~$2-3/month
- **Medium team** (200 PRs): ~$10-12/month  
- **Large team** (500 PRs): ~$25-30/month

**Plus:** Get $5 free credit from Anthropic to start!

---

## 🛠️ Supported Languages

Currently optimized for:
- ✅ JavaScript
- ✅ TypeScript

**Coming Soon:** Python, Go, Java, Ruby

---

## 📸 Real Review Example
```markdown
🛡️ Solon AI Review

Summary: The calculateDiscount function implements basic discount logic 
but lacks validation for edge cases.

Edge Cases:
- Handling negative or zero prices
- Handling discount percentages outside 0-100 range

Suggested Unit Tests:
describe('calculateDiscount', () => {
  it('should calculate correct discount', () => {
    expect(calculateDiscount(100, 20)).toEqual(80);
  });
  
  it('should handle edge cases', () => {
    expect(calculateDiscount(-100, 20)).toEqual(-80);
  });
});
```

---

## 🔒 Security & Privacy

- ✅ Your API key stays in YOUR repository secrets
- ✅ Code diffs sent only to Anthropic's API (not stored by us)
- ✅ No tracking, no analytics, no data collection

**We never see your code or API key.**

See [Privacy Policy](PRIVACY.md) | [Terms of Service](TERMS.md)

---

## ❓ FAQ

**Why BYOK?**
You control costs, privacy, and your API key. No monthly fees.

**How much does it cost?**
~$0.03-0.06 per review. 100 PRs/month = $3-6/month.

**Can I use on private repos?**
Yes! Works with both public and private repositories.

---

## 🤝 Support

- 🐛 [Report bugs](https://github.com/Solon-Dev/Solon/issues)
- 💡 [Request features](https://github.com/Solon-Dev/Solon/issues)
- ⭐ Star this repo!

---

**Built with ❤️ using Claude AI by Anthropic**

[Install Solon AI](https://github.com/apps/solon-ai) | [Documentation](https://github.com/Solon-Dev/Solon/wiki) | [Support](https://github.com/Solon-Dev/Solon/issues)
