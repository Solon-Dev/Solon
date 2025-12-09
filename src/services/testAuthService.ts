// Test file for Solon AI review after Next.js 15.5.7 security upgrade

export class UserAuthService {
  // Hardcoded API key - Security issue
  private apiKey = "sk-1234567890abcdef";

  // Missing error handling - Best practices issue
  async loginUser(username: string, password: string) {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }

  // SQL injection vulnerability - Security issue
  async getUserData(userId: string) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    console.log("Executing query:", query);
    return query;
  }
}
