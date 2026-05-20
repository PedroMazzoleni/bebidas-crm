import { useState, useEffect } from 'react'

export interface Producto {
  id: string
  nombre: string
  marca: string
  categoria: string
  stock: number
  precio_venta: number
  precio_compra: number
  proveedor_id?: string | null
  fecha_caducidad?: string | null
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
    const res = await fetch('/api/productos')
    const data = await res.json()
    setProductos(data || [])
    setLoading(false)
  }

  const crearProducto = async (form: ProductoForm) => {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchProductos()
    return res.ok
  }

  const actualizarProducto = async (id: string, form: ProductoForm) => {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchProductos()
    return res.ok
  }

  const eliminarProducto = async (id: string) => {
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchProductos()
    return res.ok
  }

  useEffect(() => { fetchProductos() }, [])

  return { productos, loading, fetchProductos, crearProducto, actualizarProducto, eliminarProducto }
}
