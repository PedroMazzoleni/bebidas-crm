import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { nombre, marca, categoria, stock, precio_venta, precio_compra, proveedor_id, fecha_caducidad } = await req.json()
  const producto = await prisma.producto.update({
    where: { id },
    data: {
      nombre,
      marca: marca || '',
      categoria: categoria || '',
      stock: parseInt(stock) || 0,
      precio_venta: parseFloat(precio_venta) || 0,
      precio_compra: parseFloat(precio_compra) || 0,
      proveedor_id: proveedor_id || null,
      fecha_caducidad: fecha_caducidad || null,
    },
  })
  return NextResponse.json(producto)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.producto.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
