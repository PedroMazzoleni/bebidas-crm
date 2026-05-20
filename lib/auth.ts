import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'bebidas-crm-dev-secret'

export interface TokenPayload {
  id: string
  role: string
  full_name: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}
