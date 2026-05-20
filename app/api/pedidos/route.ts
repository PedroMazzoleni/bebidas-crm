import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUser } from '../../../lib/getUser'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const comercialId = searchParams.get('comercial_id')
  const where = comercialId ? { comercial_id: comercialId } : {}

  const pedidos = await prisma.pedido.findMany({
    where,
    include: {
      cliente: { select: { nombre_cliente: true } },
      comercial: { select: { nombre: true } },
    },
    orderBy: { num_pedido: 'desc' },
  })

  return NextResponse.json(pedidos.map(p => ({
    ...p,
    clientes: { nombre_cliente: p.cliente.nombre_cliente },
    comerciales: p.comercial ? { nombre: p.comercial.nombre } : undefined,
    cliente: undefined,
    comercial: undefined,
  })))
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cliente_id, comercial_id, fecha, estado, total, lineas } = await req.json()

  const last = await prisma.pedido.findFirst({ orderBy: { num_pedido: 'desc' } })
  const num_pedido = (last?.num_pedido || 0) + 1

  const lineasValidas = (lineas || []).filter(
    (l: { producto_id: string; cantidad: number; precio_venta: number }) =>
      l.producto_id && l.cantidad > 0
  )

  const pedido = await prisma.pedido.create({
    data: {
      num_pedido,
      cliente_id,
      comercial_id: comercial_id || null,
      fecha: fecha || new Date().toISOString().split('T')[0],
      estado: estado || 'pendiente',
      total: total || 0,
      lineas: lineasValidas.length > 0 ? {
        create: lineasValidas.map((l: { producto_id: string; cantidad: number; precio_venta: number }) => ({
          producto_id: l.producto_id,
          cantidad: l.cantidad,
          precio_venta: l.precio_venta,
        })),
      } : undefined,
    },
  })

  return NextResponse.json(pedido)
}
