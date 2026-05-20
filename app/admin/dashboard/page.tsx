'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import Sidebar from '../../../components/sidebar'
import { StatCard } from '../../../components/ui/FormComponents'
import { colors } from '../../../components/ui/styles'
import { Package, Clock, Users, Wine, Warehouse, Briefcase } from 'lucide-react'

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
      const res = await fetch('/api/stats/admin')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
      setLoading(false)
    }
    fetchStats()
  }, [ready])

  const cards = [
    { label: 'Pedidos totales', value: stats.totalPedidos, icon: <Package size={22} />, color: colors.primary, href: '/admin/dashboard/pedidos' },
    { label: 'Pendientes', value: stats.pedidosPendientes, icon: <Clock size={22} />, color: colors.warning, href: '/admin/dashboard/pedidos' },
    { label: 'Clientes', value: stats.totalClientes, icon: <Users size={22} />, color: colors.success, href: '/admin/dashboard/clientes' },
    { label: 'Productos', value: stats.totalProductos, icon: <Wine size={22} />, color: colors.purple, href: '/admin/dashboard/productos' },
    { label: 'Proveedores', value: stats.totalProveedores, icon: <Warehouse size={22} />, color: colors.danger, href: '/admin/dashboard/proveedores' },
    { label: 'Comerciales', value: stats.totalComerciales, icon: <Briefcase size={22} />, color: colors.cyan, href: '/admin/dashboard/comerciales' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: colors.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Bienvenido, {userName}
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
          <h2 style={{ color: colors.textMuted, fontSize: 15, fontWeight: 600, marginBottom: 16, letterSpacing: '0.5px' }}>ACCIONES RÁPIDAS</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: '+ Nuevo pedido', href: '/admin/dashboard/pedidos' },
              { label: '+ Nuevo cliente', href: '/admin/dashboard/clientes' },
              { label: '+ Nuevo producto', href: '/admin/dashboard/productos' },
            ].map(action => (
              <button key={action.label} onClick={() => router.push(action.href)} style={{
                padding: '10px 18px', background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: 8, color: colors.textMuted, fontSize: 14, cursor: 'pointer',
                fontFamily: 'var(--font-sans), system-ui, sans-serif',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#1c1c1e'
                  ;(e.currentTarget as HTMLElement).style.color = colors.text
                  ;(e.currentTarget as HTMLElement).style.borderColor = colors.border2
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = colors.surface
                  ;(e.currentTarget as HTMLElement).style.color = colors.textMuted
                  ;(e.currentTarget as HTMLElement).style.borderColor = colors.border
                }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
