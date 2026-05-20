import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { getUser } from '../../../../../lib/getUser'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const comercial = await prisma.comercial.findUnique({ where: { id } })
  if (!comercial) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const pedidos = await prisma.pedido.findMany({
    where: { comercial_id: id },
    include: { cliente: { select: { nombre_cliente: true, zona: true } } },
  })

  const totalVentas = pedidos.reduce((s, p) => s + p.total, 0)
  const totalDeuda = pedidos
    .filter(p => p.estado === 'pendiente')
    .reduce((s, p) => s + p.total, 0)

  const zonaMap: Record<string, { total: number; numPedidos: number }> = {}
  for (const p of pedidos) {
    const zona = p.cliente?.zona || 'Sin zona'
    if (!zonaMap[zona]) zonaMap[zona] = { total: 0, numPedidos: 0 }
    zonaMap[zona].total += p.total
    zonaMap[zona].numPedidos += 1
  }
  const ventasPorZona = Object.entries(zonaMap)
    .map(([zona, v]) => ({ zona, ...v }))
    .sort((a, b) => b.total - a.total)

  const totalClientes = await prisma.cliente.count({ where: { comercial_clie: id } })

  return NextResponse.json({
    comercial,
    totalVentas,
    totalDeuda,
    totalPedidos: pedidos.length,
    totalClientes,
    ventasPorZona,
    pedidosRecientes: pedidos
      .sort((a, b) => b.num_pedido - a.num_pedido)
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        num_pedido: p.num_pedido,
        fecha: p.fecha,
        estado: p.estado,
        total: p.total,
        cliente: p.cliente?.nombre_cliente ?? '—',
      })),
  })
}
