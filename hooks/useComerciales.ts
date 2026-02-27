import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Comercial {
  id: string
  nombre: string
  telf: string
  ventas: number
  comision_asignada: number
}

export interface ComercialForm {
  nombre: string
  telf: string
  comision_asignada: string
}

export const emptyComercialForm: ComercialForm = {
  nombre: '', telf: '', comision_asignada: '',
}

export function useComerciales() {
  const [comerciales, setComerciales] = useState<Comercial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComerciales = async () => {
    const { data } = await supabase.from('comerciales').select('*').order('nombre')
    setComerciales(data || [])
    setLoading(false)
  }

  const crearComercial = async (form: ComercialForm) => {
    const { error } = await supabase.from('comerciales').insert({
      nombre: form.nombre,
      telf: form.telf,
      comision_asignada: parseFloat(form.comision_asignada) || 0,
    })
    if (!error) await fetchComerciales()
    return !error
  }

  const eliminarComercial = async (id: string) => {
    const { error } = await supabase.from('comerciales').delete().eq('id', id)
    if (!error) await fetchComerciales()
    return !error
  }

  useEffect(() => { fetchComerciales() }, [])

  return { comerciales, loading, fetchComerciales, crearComercial, eliminarComercial }
}