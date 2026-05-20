import { useState, useEffect } from 'react'

export interface Proveedor {
  id: string
  nombre: string
  direccion: string
  mail: string
  tipo_iva: string
  nif: string
  telefono: string
}

export interface ProveedorForm {
  nombre: string
  direccion: string
  mail: string
  tipo_iva: string
  nif: string
  telefono: string
}

export const emptyProveedorForm: ProveedorForm = {
  nombre: '', direccion: '', mail: '', tipo_iva: '', nif: '', telefono: '',
}

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProveedores = async () => {
    const res = await fetch('/api/proveedores')
    const data = await res.json()
    setProveedores(data || [])
    setLoading(false)
  }

  const crearProveedor = async (form: ProveedorForm) => {
    const res = await fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchProveedores()
    return res.ok
  }

  const actualizarProveedor = async (id: string, form: ProveedorForm) => {
    const res = await fetch(`/api/proveedores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchProveedores()
    return res.ok
  }

  const eliminarProveedor = async (id: string) => {
    const res = await fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchProveedores()
    return res.ok
  }

  useEffect(() => { fetchProveedores() }, [])

  return { proveedores, loading, fetchProveedores, crearProveedor, actualizarProveedor, eliminarProveedor }
}
