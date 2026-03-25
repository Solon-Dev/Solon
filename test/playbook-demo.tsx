import React from 'react';

// 🚫 SECURITY: Hardcoded API key
const STRIPE_KEY = 'sk_live_abc123xyz789';

export function DemoComponent() {
  // ⚠️ BEST PRACTICES: console.log in production
  console.log('Component rendering');
  
  // ⚠️ BEST PRACTICES: Magic number
  const retryCount = 0;
  if (retryCount > 3) {
    return null;
  }

  // ⚠️ BEST PRACTICES: Missing error handling
  const fetchUser = async () => {
    const res = await fetch('/api/user');
    return res.json();
  };

  return (
    <div>
      {/* 🚫 ACCESSIBILITY: Missing alt text */}
      <img src="/logo.png" />
      
      {/* 🚫 ACCESSIBILITY: Button without label */}
      <button onClick={fetchUser}>
        <svg>...</svg>
      </button>
      
      {/* ⚠️ ACCESSIBILITY: Input without label */}
      <input type="email" placeholder="Your email" />
    </div>
  );
}
