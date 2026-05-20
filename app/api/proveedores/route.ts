import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUser } from '../../../lib/getUser'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const proveedores = await prisma.proveedor.findMany({ orderBy: { nombre: 'asc' } })
  return NextResponse.json(proveedores)
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { nombre, direccion, mail, tipo_iva, nif, telefono } = await req.json()
  const proveedor = await prisma.proveedor.create({
    data: {
      nombre,
      direccion: direccion || '',
      mail: mail || '',
      tipo_iva: tipo_iva || '',
      nif: nif || '',
      telefono: telefono || '',
    },
  })
  return NextResponse.json(proveedor)
}
