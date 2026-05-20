import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { nombre, direccion, mail, tipo_iva, nif, telefono } = await req.json()
  const proveedor = await prisma.proveedor.update({
    where: { id },
    data: { nombre, direccion: direccion || '', mail: mail || '', tipo_iva: tipo_iva || '', nif: nif || '', telefono: telefono || '' },
  })
  return NextResponse.json(proveedor)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.proveedor.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
