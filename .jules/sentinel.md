## 2025-02-24 - Stack Trace Exposure in API Routes
**Vulnerability:** The API route `src/app/api/analyze/route.ts` was explicitly returning `error.stack` in the JSON response for both 500 errors and internal processing errors.
**Learning:** Next.js route handlers often need manual error handling, and it's easy to accidentally leak stack traces if one blindly returns the error object or its properties.
**Prevention:** Always sanitize error objects before returning them to the client. Use a dedicated error handler or middleware that logs the stack trace server-side but returns a generic message to the client.
