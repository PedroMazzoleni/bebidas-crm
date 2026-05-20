import { useState, useEffect } from 'react'

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
    const res = await fetch('/api/comerciales')
    const data = await res.json()
    setComerciales(data || [])
    setLoading(false)
  }

  const crearComercial = async (form: ComercialForm) => {
    const res = await fetch('/api/comerciales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) await fetchComerciales()
    return res.ok
  }

  const eliminarComercial = async (id: string) => {
    const res = await fetch(`/api/comerciales/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchComerciales()
    return res.ok
  }

  useEffect(() => { fetchComerciales() }, [])

  return { comerciales, loading, fetchComerciales, crearComercial, eliminarComercial }
}
