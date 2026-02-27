import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

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
    let query = supabase
      .from('pedidos')
      .select('*, clientes(nombre_cliente), comerciales(nombre)')
      .order('num_pedido', { ascending: false })

    if (filtroComercialId) {
      query = query.eq('comercial_id', filtroComercialId)
    }

    const { data } = await query
    setPedidos(data || [])
    setLoading(false)
  }

  const crearPedido = async (form: PedidoForm, lineas: LineaPedido[]) => {
    const total = lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0)

    const { data: pedido, error } = await supabase.from('pedidos').insert({
      cliente_id: form.cliente_id,
      comercial_id: form.comercial_id || null,
      fecha: form.fecha || new Date().toISOString().split('T')[0],
      estado: form.estado,
      total,
    }).select().single()

    if (error || !pedido) return false

    const lineasValidas = lineas.filter(l => l.producto_id && l.cantidad > 0)
    if (lineasValidas.length > 0) {
      await supabase.from('lineas_pedido').insert(
        lineasValidas.map(l => ({
          pedido_id: pedido.id,
          producto_id: l.producto_id,
          cantidad: l.cantidad,
          precio_venta: l.precio_venta,
        }))
      )
    }

    await fetchPedidos()
    return true
  }

  const cambiarEstado = async (id: string, estado: string) => {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    await fetchPedidos()
  }

  useEffect(() => { fetchPedidos() }, [filtroComercialId])

  return { pedidos, loading, fetchPedidos, crearPedido, cambiarEstado }
}