'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import Sidebar from '../../../components/sidebar'
import { StatCard } from '../../../components/ui/FormComponents'
import { colors } from '../../../components/ui/styles'
import { supabase } from '../../../lib/supabaseClient'

interface Stats {
  totalPedidos: number
  pedidosPendientes: number
  totalClientes: number
  totalProductos: number
  totalProveedores: number
  totalComerciales: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { userName, ready } = useAuth('admin')
  const [stats, setStats] = useState<Stats>({
    totalPedidos: 0, pedidosPendientes: 0, totalClientes: 0,
    totalProductos: 0, totalProveedores: 0, totalComerciales: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    const fetchStats = async () => {
      const [pedidos, pendientes, clientes, productos, proveedores, comerciales] = await Promise.all([
        supabase.from('pedidos').select('id', { count: 'exact', head: true }),
        supabase.from('pedidos').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente'),
        supabase.from('clientes').select('id', { count: 'exact', head: true }),
        supabase.from('productos').select('id', { count: 'exact', head: true }),
        supabase.from('proveedores').select('id', { count: 'exact', head: true }),
        supabase.from('comerciales').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        totalPedidos: pedidos.count || 0,
        pedidosPendientes: pendientes.count || 0,
        totalClientes: clientes.count || 0,
        totalProductos: productos.count || 0,
        totalProveedores: proveedores.count || 0,
        totalComerciales: comerciales.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [ready])

  const cards = [
    { label: 'Pedidos totales', value: stats.totalPedidos, icon: '📦', color: colors.primary, href: '/admin/dashboard/pedidos' },
    { label: 'Pendientes', value: stats.pedidosPendientes, icon: '⏳', color: colors.warning, href: '/admin/dashboard/pedidos' },
    { label: 'Clientes', value: stats.totalClientes, icon: '👥', color: colors.success, href: '/admin/dashboard/clientes' },
    { label: 'Productos', value: stats.totalProductos, icon: '🍶', color: colors.purple, href: '/admin/dashboard/productos' },
    { label: 'Proveedores', value: stats.totalProveedores, icon: '🏭', color: colors.danger, href: '/admin/dashboard/proveedores' },
    { label: 'Comerciales', value: stats.totalComerciales, icon: '👤', color: colors.cyan, href: '/admin/dashboard/comerciales' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: colors.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Bienvenido, {userName} 👋
          </h1>
          <p style={{ color: colors.textDim, marginTop: 6, fontSize: 15 }}>
            Panel de administración — resumen general
          </p>
        </div>

        {loading ? <p style={{ color: colors.textDim }}>Cargando datos...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {cards.map(card => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                color={card.color}
                onClick={() => router.push(card.href)}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          <h2 style={{ color: '#e5e7eb', fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Acciones rápidas</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: '+ Nuevo pedido', href: '/admin/dashboard/pedidos' },
              { label: '+ Nuevo cliente', href: '/admin/dashboard/clientes' },
              { label: '+ Nuevo producto', href: '/admin/dashboard/productos' },
            ].map(action => (
              <button key={action.label} onClick={() => router.push(action.href)} style={{
                padding: '10px 20px', background: '#1e2130', border: '1px solid #2d3348',
                borderRadius: 8, color: '#e5e7eb', fontSize: 14, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#252b3d'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1e2130'}>
                {action.label}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}