import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password, full_name, role } = await req.json()
  const existing = await prisma.profile.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  await prisma.profile.create({
    data: { email, password: hashed, full_name, role, status: 'active' },
  })
  return NextResponse.json({ success: true })
}
