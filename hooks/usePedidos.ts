import { useState, useEffect } from 'react'

export interface Pedido {
  id: string
  num_pedido: number
  fecha: string
  estado: string
  total: number
  cliente_id: string
  comercial_id: string
  clientes?: { nombre_cliente: string }
  comerciales?: { nombre: string }
}

export interface LineaPedido {
  producto_id: string
  cantidad: number
  precio_venta: number
}

export interface PedidoForm {
  cliente_id: string
  comercial_id: string
  fecha: string
  estado: string
}

export const emptyPedidoForm: PedidoForm = {
  cliente_id: '', comercial_id: '', fecha: '', estado: 'pendiente',
}

export const emptyLinea: LineaPedido = {
  producto_id: '', cantidad: 1, precio_venta: 0,
}

export function usePedidos(filtroComercialId?: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPedidos = async () => {
    const url = filtroComercialId
      ? `/api/pedidos?comercial_id=${filtroComercialId}`
      : '/api/pedidos'
    const res = await fetch(url)
    const data = await res.json()
    setPedidos(data || [])
    setLoading(false)
  }

  const crearPedido = async (form: PedidoForm, lineas: LineaPedido[]) => {
    const total = lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0)
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, total, lineas }),
    })
    if (res.ok) await fetchPedidos()
    return res.ok
  }

  const cambiarEstado = async (id: string, estado: string) => {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    await fetchPedidos()
  }

  const actualizarPedido = async (id: string, form: PedidoForm, lineas: LineaPedido[]) => {
    const res = await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lineas }),
    })
    if (res.ok) await fetchPedidos()
    return res.ok
  }

  useEffect(() => { fetchPedidos() }, [filtroComercialId])

  return { pedidos, loading, fetchPedidos, crearPedido, cambiarEstado, actualizarPedido }
}
