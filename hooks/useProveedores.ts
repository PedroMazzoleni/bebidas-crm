import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

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
    const { data } = await supabase.from('proveedores').select('*').order('nombre')
    setProveedores(data || [])
    setLoading(false)
  }

  const crearProveedor = async (form: ProveedorForm) => {
    const { error } = await supabase.from('proveedores').insert(form)
    if (!error) await fetchProveedores()
    return !error
  }

  const eliminarProveedor = async (id: string) => {
    const { error } = await supabase.from('proveedores').delete().eq('id', id)
    if (!error) await fetchProveedores()
    return !error
  }

  useEffect(() => { fetchProveedores() }, [])

  return { proveedores, loading, fetchProveedores, crearProveedor, eliminarProveedor }
}