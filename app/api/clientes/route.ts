import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUser } from '../../../lib/getUser'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const comercialId = searchParams.get('comercial_id')
  const where = comercialId ? { comercial_clie: comercialId } : {}

  const clientes = await prisma.cliente.findMany({
    where,
    include: { comercial: { select: { nombre: true } } },
    orderBy: { nombre_cliente: 'asc' },
  })

  return NextResponse.json(clientes.map(c => ({
    ...c,
    comerciales: c.comercial ? { nombre: c.comercial.nombre } : undefined,
    comercial: undefined,
  })))
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { nombre_cliente, telf, direccion, zona, comercial_clie } = await req.json()
  const cliente = await prisma.cliente.create({
    data: {
      nombre_cliente,
      telf: telf || '',
      direccion: direccion || '',
      zona: zona || '',
      comercial_clie: comercial_clie || null,
    },
  })
  return NextResponse.json(cliente)
}
