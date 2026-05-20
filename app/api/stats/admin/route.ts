import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUser } from '../../../../lib/getUser'

export async function GET() {
  const user = await getUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [totalPedidos, pedidosPendientes, totalClientes, totalProductos, totalProveedores, totalComerciales] =
    await Promise.all([
      prisma.pedido.count(),
      prisma.pedido.count({ where: { estado: 'pendiente' } }),
      prisma.cliente.count(),
      prisma.producto.count(),
      prisma.proveedor.count(),
      prisma.comercial.count(),
    ])

  return NextResponse.json({
    totalPedidos, pedidosPendientes, totalClientes,
    totalProductos, totalProveedores, totalComerciales,
  })
}
