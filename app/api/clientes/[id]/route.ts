import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { nombre_cliente, telf, direccion, zona, comercial_clie } = await req.json()
  const cliente = await prisma.cliente.update({
    where: { id },
    data: { nombre_cliente, telf: telf || '', direccion: direccion || '', zona: zona || '', comercial_clie: comercial_clie || null },
  })
  return NextResponse.json(cliente)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.cliente.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
