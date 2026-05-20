import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const comercial = await prisma.comercial.findFirst({ where: { nombre: user.full_name } })
  if (!comercial) {
    return NextResponse.json({ misPedidos: 0, misClientes: 0, pendientes: 0, totalVentas: 0, comercialId: null })
  }

  const [misPedidos, misClientes, pendientes] = await Promise.all([
    prisma.pedido.count({ where: { comercial_id: comercial.id } }),
    prisma.cliente.count({ where: { comercial_clie: comercial.id } }),
    prisma.pedido.count({ where: { comercial_id: comercial.id, estado: 'pendiente' } }),
  ])

  return NextResponse.json({
    misPedidos, misClientes, pendientes,
    totalVentas: comercial.ventas,
    comercialId: comercial.id,
  })
}
