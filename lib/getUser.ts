import { cookies } from 'next/headers'
import { verifyToken, TokenPayload } from './auth'

export async function getUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyToken(token)
}
