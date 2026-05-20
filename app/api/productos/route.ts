import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUser } from '../../../lib/getUser'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const productos = await prisma.producto.findMany({
    include: { proveedor: { select: { nombre: true } } },
    orderBy: { nombre: 'asc' },
  })

  return NextResponse.json(productos.map(p => ({
    ...p,
    proveedores: p.proveedor ? { nombre: p.proveedor.nombre } : undefined,
    proveedor: undefined,
  })))
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { nombre, marca, categoria, stock, precio_venta, precio_compra, proveedor_id, fecha_caducidad } = await req.json()
  const producto = await prisma.producto.create({
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
