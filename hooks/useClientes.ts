import { useState, useEffect } from 'react'

export interface Cliente {
  id: string
  nombre_cliente: string
  telf: string
  direccion: string
  zona: string
  total_compras: number
  comercial_clie?: string
  comerciales?: { nombre: string }
}

export interface ClienteForm {
  nombre_cliente: string
  telf: string
  direccion: string
  zona: string
  comercial_clie: string
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClientes = async () => {
    const res = await fetch('/api/clientes')
    const data = await res.json()
    setClientes(data || [])
    setLoading(false)
  }

  const crearCliente = async (form: ClienteForm) => {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchClientes()
    return res.ok
  }

  const actualizarCliente = async (id: string, form: ClienteForm) => {
    const res = await fetch(`/api/clientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchClientes()
    return res.ok
  }

  const eliminarCliente = async (id: string) => {
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchClientes()
    return res.ok
  }

  useEffect(() => { fetchClientes() }, [])

  return { clientes, loading, fetchClientes, crearCliente, actualizarCliente, eliminarCliente }
}
