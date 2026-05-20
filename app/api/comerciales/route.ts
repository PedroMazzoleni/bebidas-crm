import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUser } from '../../../lib/getUser'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const nombre = searchParams.get('nombre')
  const where = nombre ? { nombre } : {}

  const comerciales = await prisma.comercial.findMany({
    where,
    orderBy: { nombre: 'asc' },
  })
  return NextResponse.json(comerciales)
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { nombre, telf, comision_asignada } = await req.json()
  const comercial = await prisma.comercial.create({
    data: { nombre, telf: telf || '', comision_asignada: parseFloat(comision_asignada) || 0 },
  })
  return NextResponse.json(comercial)
}
