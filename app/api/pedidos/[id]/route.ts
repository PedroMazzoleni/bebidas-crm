import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: true,
      comercial: true,
      lineas: { include: { producto: true } },
    },
  })
  if (!pedido) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(pedido)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  // Simple state change (legacy callers pass only estado)
  if (Object.keys(body).length === 1 && body.estado) {
    const pedido = await prisma.pedido.update({ where: { id }, data: { estado: body.estado } })
    return NextResponse.json(pedido)
  }

  const { cliente_id, comercial_id, fecha, estado, lineas } = body
  const total = (lineas as { cantidad: number; precio_venta: number }[])
    .reduce((s, l) => s + l.cantidad * l.precio_venta, 0)

  await prisma.lineaPedido.deleteMany({ where: { pedido_id: id } })
  const pedido = await prisma.pedido.update({
    where: { id },
    data: {
      cliente_id,
      comercial_id: comercial_id || null,
      fecha,
      estado,
      total,
      lineas: {
        create: (lineas as { producto_id: string; cantidad: number; precio_venta: number }[]).map(l => ({
          producto_id: l.producto_id,
          cantidad: l.cantidad,
          precio_venta: l.precio_venta,
        })),
      },
    },
  })
  return NextResponse.json(pedido)
}
