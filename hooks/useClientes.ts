import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Cliente {
  id: string
  nombre_cliente: string
  telf: string
  direccion: string
  total_compras: number
  comercial_clie?: string
  comerciales?: { nombre: string }
}

export interface ClienteForm {
  nombre_cliente: string
  telf: string
  direccion: string
  comercial_clie: string
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*, comerciales(nombre)')
      .order('nombre_cliente')
    setClientes(data || [])
    setLoading(false)
  }

  const crearCliente = async (form: ClienteForm) => {
    const { error } = await supabase.from('clientes').insert({
      nombre_cliente: form.nombre_cliente,
      telf: form.telf,
      direccion: form.direccion,
      comercial_clie: form.comercial_clie || null,
    })
    if (!error) await fetchClientes()
    return !error
  }

  const eliminarCliente = async (id: string) => {
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (!error) await fetchClientes()
    return !error
  }

  useEffect(() => { fetchClientes() }, [])

  return { clientes, loading, fetchClientes, crearCliente, eliminarCliente }
}