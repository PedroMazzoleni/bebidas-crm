import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { getUser } from '../../../../../lib/getUser'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { proveedor: { select: { nombre: true } } },
  })
  if (!producto) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const lineas = await prisma.lineaPedido.findMany({
    where: { producto_id: id },
    include: {
      pedido: {
        select: {
          id: true,
          num_pedido: true,
          fecha: true,
          estado: true,
          comercial: { select: { id: true, nombre: true } },
          cliente: { select: { nombre_cliente: true } },
        },
      },
    },
  })

  const totalVendido = lineas.reduce((s, l) => s + l.cantidad, 0)
  const ingresos = lineas.reduce((s, l) => s + l.cantidad * l.precio_venta, 0)
  const beneficio = lineas.reduce((s, l) => s + l.cantidad * (l.precio_venta - producto.precio_compra), 0)
  const numPedidos = new Set(lineas.map(l => l.pedido_id)).size

  // Top comerciales
  const comercialMap: Record<string, { nombre: string; unidades: number; ingresos: number }> = {}
  for (const l of lineas) {
    const com = l.pedido.comercial
    if (!com) continue
    if (!comercialMap[com.id]) comercialMap[com.id] = { nombre: com.nombre, unidades: 0, ingresos: 0 }
    comercialMap[com.id].unidades += l.cantidad
    comercialMap[com.id].ingresos += l.cantidad * l.precio_venta
  }
  const topComerciales = Object.values(comercialMap).sort((a, b) => b.unidades - a.unidades)

  // Ventas por mes (últimos 12 meses)
  const ventasPorMes: Record<string, { unidades: number; ingresos: number }> = {}
  for (const l of lineas) {
    const mes = l.pedido.fecha.slice(0, 7) // "YYYY-MM"
    if (!ventasPorMes[mes]) ventasPorMes[mes] = { unidades: 0, ingresos: 0 }
    ventasPorMes[mes].unidades += l.cantidad
    ventasPorMes[mes].ingresos += l.cantidad * l.precio_venta
  }
  const ventasMes = Object.entries(ventasPorMes)
    .map(([mes, v]) => ({ mes, ...v }))
    .sort((a, b) => a.mes.localeCompare(b.mes))
    .slice(-12)

  // Pedidos recientes con este producto
  const pedidosRecientes = lineas
    .sort((a, b) => b.pedido.num_pedido - a.pedido.num_pedido)
    .slice(0, 15)
    .map(l => ({
      id: l.pedido.id,
      num_pedido: l.pedido.num_pedido,
      fecha: l.pedido.fecha,
      estado: l.pedido.estado,
      cliente: l.pedido.cliente.nombre_cliente,
      comercial: l.pedido.comercial?.nombre ?? '—',
      cantidad: l.cantidad,
      precio_venta: l.precio_venta,
      subtotal: l.cantidad * l.precio_venta,
    }))

  return NextResponse.json({
    producto: {
      ...producto,
      proveedorNombre: producto.proveedor?.nombre ?? null,
    },
    totalVendido,
    ingresos,
    beneficio,
    numPedidos,
    topComerciales,
    ventasMes,
    pedidosRecientes,
  })
}
