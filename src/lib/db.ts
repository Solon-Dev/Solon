import { neon } from '@neondatabase/serverless'

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(process.env.DATABASE_URL)
}

export const db = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof neon>]
  },
})
