import { neon, NeonQueryFunction } from '@neondatabase/serverless'

// Lazily initialize the connection so that importing this module
// does not throw when DATABASE_URL is absent (e.g. during Jest runs).
let _client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!_client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    _client = neon(process.env.DATABASE_URL)
  }
  return _client
}

// Typed wrapper: always returns an array of rows so callers can use .length, .map, etc.
export async function db<T = Record<string, unknown>>(
  query: string,
  params?: unknown[]
): Promise<T[]> {
  const client = getClient()
  const result = await client(query, params)
  return result as T[]
}

