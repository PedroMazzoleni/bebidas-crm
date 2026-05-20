'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/useAuth'
import Sidebar from '../../../../../components/sidebar'
import { colors, thStyle, tdStyle } from '../../../../../components/ui/styles'
import { TrendingUp, AlertCircle, Users, ShoppingBag, MapPin, ArrowLeft } from 'lucide-react'

interface Stats {
  comercial: { id: string; nombre: string; telf: string; comision_asignada: number }
  totalVentas: number
  totalDeuda: number
  totalPedidos: number
  totalClientes: number
  ventasPorZona: Array<{ zona: string; total: number; numPedidos: number }>
  pedidosRecientes: Array<{
    id: string
    num_pedido: number
    fecha: string
    estado: string
    total: number
    cliente: string
  }>
}

const estadoBadge: Record<string, { bg: string; color: string }> = {
  pendiente: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  pagado: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  cancelado: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>{label}</div>
          <div style={{ color: colors.text, fontSize: 28, fontWeight: 700 }}>{value}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function ComercialDetailPage() {
  const { userName } = useAuth('admin')
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/comerciales/${id}/stats`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
  }, [id])

  const maxZona = stats?.ventasPorZona[0]?.total ?? 1

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <button
          onClick={() => router.push('/admin/dashboard/comerciales')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 14, marginBottom: 28, padding: 0 }}
        >
          <ArrowLeft size={16} /> Volver a comerciales
        </button>

        {loading ? (
          <p style={{ color: colors.textDim }}>Cargando...</p>
        ) : !stats ? (
          <p style={{ color: colors.danger }}>Comercial no encontrado</p>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #dc2626)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 22,
              }}>
                {stats.comercial.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ color: colors.text, fontSize: 26, fontWeight: 700, margin: 0 }}>{stats.comercial.nombre}</h1>
                <p style={{ color: colors.textDim, fontSize: 14, margin: '4px 0 0' }}>
                  {stats.comercial.telf || 'Sin teléfono'} · Comisión: {stats.comercial.comision_asignada}%
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              <StatCard label="Total ventas" value={`€${stats.totalVentas.toFixed(2)}`} icon={<TrendingUp size={20} />} color={colors.success} />
              <StatCard label="Deuda pendiente" value={`€${stats.totalDeuda.toFixed(2)}`} icon={<AlertCircle size={20} />} color={colors.danger} />
              <StatCard label="Clientes" value={stats.totalClientes} icon={<Users size={20} />} color={colors.cyan} />
              <StatCard label="Pedidos totales" value={stats.totalPedidos} icon={<ShoppingBag size={20} />} color={colors.primary} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, marginBottom: 32 }}>
              {/* Ventas por zona */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <MapPin size={16} color={colors.primary} />
                  <h2 style={{ color: colors.text, fontSize: 16, fontWeight: 600, margin: 0 }}>Ventas por zona</h2>
                </div>
                {stats.ventasPorZona.length === 0 ? (
                  <p style={{ color: colors.textDim, fontSize: 14 }}>Sin datos de zonas</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {stats.ventasPorZona.map(z => (
                      <div key={z.zona}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: colors.text, fontSize: 14, fontWeight: 500 }}>{z.zona}</span>
                          <span style={{ color: colors.success, fontSize: 14, fontWeight: 600 }}>€{z.total.toFixed(2)}</span>
                        </div>
                        <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(z.total / maxZona) * 100}%`,
                            background: 'linear-gradient(90deg, #f97316, #22c55e)',
                            borderRadius: 3,
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <div style={{ color: colors.textDim, fontSize: 12, marginTop: 3 }}>{z.numPedidos} pedido{z.numPedidos !== 1 ? 's' : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pedidos recientes */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
                  <h2 style={{ color: colors.text, fontSize: 16, fontWeight: 600, margin: 0 }}>Pedidos recientes</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                      {['#', 'Cliente', 'Fecha', 'Estado', 'Total'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.pedidosRecientes.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: colors.textDim }}>Sin pedidos</td></tr>
                    ) : stats.pedidosRecientes.map(p => {
                      const badge = estadoBadge[p.estado] ?? { bg: 'rgba(113,113,122,0.2)', color: colors.textMuted }
                      return (
                        <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ ...tdStyle, color: colors.textDim, fontSize: 13 }}>#{p.num_pedido}</td>
                          <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.cliente}</td>
                          <td style={{ ...tdStyle, color: colors.textDim, fontSize: 13 }}>{p.fecha}</td>
                          <td style={tdStyle}>
                            <span style={{ background: badge.bg, color: badge.color, padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                              {p.estado}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, color: colors.success, fontWeight: 600 }}>€{p.total.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
