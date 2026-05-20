'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/useAuth'
import { useProveedores } from '../../../../../hooks/useProveedores'
import { useProductos, ProductoForm } from '../../../../../hooks/useProductos'
import Sidebar from '../../../../../components/sidebar'
import Modal from '../../../../../components/ui/Modal'
import { FormField, SelectField } from '../../../../../components/ui/FormComponents'
import { colors, thStyle, tdStyle } from '../../../../../components/ui/styles'
import { ArrowLeft, Package, TrendingUp, DollarSign, ShoppingBag, Users, Edit2 } from 'lucide-react'

interface Stats {
  producto: {
    id: string; nombre: string; marca: string; categoria: string
    stock: number; precio_venta: number; precio_compra: number
    fecha_caducidad: string | null; proveedorNombre: string | null
    proveedor_id: string | null
  }
  totalVendido: number
  ingresos: number
  beneficio: number
  numPedidos: number
  topComerciales: Array<{ nombre: string; unidades: number; ingresos: number }>
  ventasMes: Array<{ mes: string; unidades: number; ingresos: number }>
  pedidosRecientes: Array<{
    id: string; num_pedido: number; fecha: string; estado: string
    cliente: string; comercial: string; cantidad: number; subtotal: number
  }>
}

const estadoBadge: Record<string, { bg: string; color: string }> = {
  pendiente:  { bg: 'rgba(234,179,8,0.15)',  color: '#eab308' },
  confirmado: { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' },
  entregado:  { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  cancelado:  { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
}

function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: colors.textDim, fontSize: 12, marginBottom: 6 }}>{label}</div>
          <div style={{ color: colors.text, fontSize: 26, fontWeight: 700 }}>{value}</div>
          {sub && <div style={{ color: colors.textDim, fontSize: 12, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function ProductoDetailPage() {
  const { userName } = useAuth('admin')
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { proveedores } = useProveedores()
  const { actualizarProducto } = useProductos()

  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState<ProductoForm | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchStats = () => {
    if (!id) return
    fetch(`/api/productos/${id}/stats`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
  }

  useEffect(() => { fetchStats() }, [id])

  const openEdit = () => {
    if (!stats) return
    setForm({
      nombre: stats.producto.nombre,
      marca: stats.producto.marca,
      categoria: stats.producto.categoria,
      stock: String(stats.producto.stock),
      precio_venta: String(stats.producto.precio_venta),
      precio_compra: String(stats.producto.precio_compra),
      proveedor_id: stats.producto.proveedor_id ?? '',
      fecha_caducidad: stats.producto.fecha_caducidad ?? '',
    })
    setShowEdit(true)
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    await actualizarProducto(id, form)
    setShowEdit(false)
    setSaving(false)
    fetchStats()
  }

  const f = (key: keyof ProductoForm) => ({
    value: form?.[key] ?? '',
    onChange: (v: string) => setForm(prev => prev ? { ...prev, [key]: v } : prev),
  })

  const maxComercial = stats?.topComerciales[0]?.unidades ?? 1
  const maxMes = Math.max(...(stats?.ventasMes.map(m => m.unidades) ?? [1]))

  const margen = stats
    ? ((stats.producto.precio_venta - stats.producto.precio_compra) / stats.producto.precio_venta * 100)
    : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <button
          onClick={() => router.push('/admin/dashboard/productos')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 14, marginBottom: 28, padding: 0 }}
        >
          <ArrowLeft size={16} /> Volver a productos
        </button>

        {loading ? (
          <p style={{ color: colors.textDim }}>Cargando...</p>
        ) : !stats ? (
          <p style={{ color: colors.danger }}>Producto no encontrado</p>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={26} color={colors.primary} />
                </div>
                <div>
                  <h1 style={{ color: colors.text, fontSize: 24, fontWeight: 700, margin: 0 }}>{stats.producto.nombre}</h1>
                  <p style={{ color: colors.textDim, fontSize: 14, margin: '4px 0 0' }}>
                    {stats.producto.marca || '—'} · <span style={{ background: 'rgba(249,115,22,0.12)', color: colors.primary, padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{stats.producto.categoria}</span>
                    {stats.producto.proveedorNombre && <> · {stats.producto.proveedorNombre}</>}
                  </p>
                </div>
              </div>
              <button
                onClick={openEdit}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: colors.primary, border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                <Edit2 size={15} /> Editar producto
              </button>
            </div>

            {/* Info rápida */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '16px 24px' }}>
              <div>
                <div style={{ color: colors.textDim, fontSize: 12 }}>Stock actual</div>
                <div style={{ color: stats.producto.stock < 10 ? colors.danger : colors.success, fontWeight: 700, fontSize: 18 }}>{stats.producto.stock} uds</div>
              </div>
              <div>
                <div style={{ color: colors.textDim, fontSize: 12 }}>Precio compra / venta</div>
                <div style={{ color: colors.text, fontWeight: 600, fontSize: 16 }}>€{stats.producto.precio_compra.toFixed(2)} → €{stats.producto.precio_venta.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ color: colors.textDim, fontSize: 12 }}>Margen por unidad</div>
                <div style={{ color: colors.success, fontWeight: 700, fontSize: 18 }}>
                  {margen.toFixed(1)}% · €{(stats.producto.precio_venta - stats.producto.precio_compra).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
              <StatCard label="Unidades vendidas" value={stats.totalVendido.toLocaleString()} icon={<Package size={18} />} color={colors.primary} />
              <StatCard label="Ingresos generados" value={`€${stats.ingresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} icon={<TrendingUp size={18} />} color={colors.success} />
              <StatCard label="Beneficio neto" value={`€${stats.beneficio.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} sub={`Margen ${margen.toFixed(1)}%`} icon={<DollarSign size={18} />} color={colors.cyan} />
              <StatCard label="Pedidos" value={stats.numPedidos} icon={<ShoppingBag size={18} />} color={colors.warning} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>

              {/* Top comerciales */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Users size={16} color={colors.primary} />
                  <h2 style={{ color: colors.text, fontSize: 15, fontWeight: 600, margin: 0 }}>Top comerciales</h2>
                </div>
                {stats.topComerciales.length === 0 ? (
                  <p style={{ color: colors.textDim, fontSize: 14 }}>Sin ventas registradas</p>
                ) : stats.topComerciales.map((c, i) => (
                  <div key={c.nombre} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? colors.warning : colors.border, color: i === 0 ? '#000' : colors.textDim, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                        <span style={{ color: colors.text, fontSize: 14, fontWeight: 500 }}>{c.nombre}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: colors.success, fontSize: 14, fontWeight: 600 }}>€{c.ingresos.toFixed(2)}</span>
                        <span style={{ color: colors.textDim, fontSize: 12, marginLeft: 8 }}>{c.unidades} uds</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: colors.border, borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${(c.unidades / maxComercial) * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#f97316,#eab308)' : colors.border2, borderRadius: 3, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Ventas por mes */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <TrendingUp size={16} color={colors.cyan} />
                  <h2 style={{ color: colors.text, fontSize: 15, fontWeight: 600, margin: 0 }}>Ventas por mes</h2>
                </div>
                {stats.ventasMes.length === 0 ? (
                  <p style={{ color: colors.textDim, fontSize: 14 }}>Sin datos</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                    {stats.ventasMes.map(m => {
                      const height = Math.max(4, (m.unidades / maxMes) * 100)
                      const [year, monthNum] = m.mes.split('-')
                      const label = MESES[parseInt(monthNum) - 1] + ' ' + year.slice(2)
                      return (
                        <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: colors.textDim, fontSize: 10 }}>{m.unidades}</span>
                          <div style={{ width: '100%', height: `${height}%`, background: 'linear-gradient(180deg,#f97316,#dc2626)', borderRadius: '3px 3px 0 0', minHeight: 4 }} title={`${m.unidades} uds · €${m.ingresos.toFixed(2)}`} />
                          <span style={{ color: colors.textDim, fontSize: 10, whiteSpace: 'nowrap' }}>{label}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Pedidos recientes */}
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${colors.border}` }}>
                <h2 style={{ color: colors.text, fontSize: 15, fontWeight: 600, margin: 0 }}>Historial de pedidos</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    {['#', 'Cliente', 'Comercial', 'Fecha', 'Estado', 'Cant.', 'Subtotal'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.pedidosRecientes.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: colors.textDim }}>Sin pedidos</td></tr>
                  ) : stats.pedidosRecientes.map(p => {
                    const badge = estadoBadge[p.estado] ?? { bg: 'rgba(113,113,122,0.2)', color: colors.textMuted }
                    return (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ ...tdStyle, color: colors.textDim, fontSize: 13 }}>#{p.num_pedido}</td>
                        <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.cliente}</td>
                        <td style={tdStyle}>{p.comercial}</td>
                        <td style={{ ...tdStyle, color: colors.textDim, fontSize: 13 }}>{p.fecha}</td>
                        <td style={tdStyle}>
                          <span style={{ background: badge.bg, color: badge.color, padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                            {p.estado}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: colors.text, fontWeight: 600 }}>{p.cantidad}</td>
                        <td style={{ ...tdStyle, color: colors.success, fontWeight: 600 }}>€{p.subtotal.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal edición */}
        {showEdit && form && (
          <Modal title="Editar producto" onClose={() => setShowEdit(false)}
            onSave={handleSave} saving={saving} disabled={!form.nombre} width={480}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Nombre" required placeholder="Nombre del producto" {...f('nombre')} />
              </div>
              <FormField label="Marca" placeholder="Marca" {...f('marca')} />
              <FormField label="Categoría" placeholder="Ej: Cerveza, Refresco..." {...f('categoria')} />
              <FormField label="Stock" type="number" placeholder="0" {...f('stock')} />
              <FormField label="Precio compra (€)" type="number" placeholder="0.00" {...f('precio_compra')} />
              <FormField label="Precio venta (€)" type="number" placeholder="0.00" {...f('precio_venta')} />
              <FormField label="Fecha caducidad" type="date" {...f('fecha_caducidad')} />
              <div style={{ gridColumn: '1 / -1' }}>
                <SelectField label="Proveedor" value={form.proveedor_id}
                  onChange={v => setForm(prev => prev ? { ...prev, proveedor_id: v } : prev)}
                  options={proveedores.map(p => ({ value: p.id, label: p.nombre }))}
                  placeholder="Sin proveedor" />
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}
