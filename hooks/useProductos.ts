import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Producto {
  id: string
  nombre: string
  marca: string
  categoria: string
  stock: number
  precio_venta: number
  precio_compra: number
  proveedor_id?: string
  fecha_caducidad?: string
  proveedores?: { nombre: string }
}

export interface ProductoForm {
  nombre: string
  marca: string
  categoria: string
  stock: string
  precio_venta: string
  precio_compra: string
  proveedor_id: string
  fecha_caducidad: string
}

export const emptyProductoForm: ProductoForm = {
  nombre: '', marca: '', categoria: '', stock: '0',
  precio_venta: '', precio_compra: '', proveedor_id: '', fecha_caducidad: '',
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*, proveedores(nombre)')
      .order('nombre')
    setProductos(data || [])
    setLoading(false)
  }

  const crearProducto = async (form: ProductoForm) => {
    const { error } = await supabase.from('productos').insert({
      nombre: form.nombre,
      marca: form.marca,
      categoria: form.categoria,
      stock: parseInt(form.stock) || 0,
      precio_venta: parseFloat(form.precio_venta) || 0,
      precio_compra: parseFloat(form.precio_compra) || 0,
      proveedor_id: form.proveedor_id || null,
      fecha_caducidad: form.fecha_caducidad || null,
    })
    if (!error) await fetchProductos()
    return !error
  }

  const eliminarProducto = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) await fetchProductos()
    return !error
  }

  useEffect(() => { fetchProductos() }, [])

  return { productos, loading, fetchProductos, crearProducto, eliminarProducto }
}