'use client'

import { useState } from 'react'
import { useProductos } from '../../../../hooks/useProductos'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import { SearchBar, PageHeader } from '../../../../components/ui/FormComponents'
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles'

const CATEGORIA_COLORS: Record<string, { bg: string; color: string }> = {
  'Cerveza':           { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  'Cerveza artesanal': { bg: 'rgba(249,115,22,0.15)',  color: '#f97316' },
  'Vino tinto':        { bg: 'rgba(220,38,38,0.15)',   color: '#ef4444' },
  'Vino blanco':       { bg: 'rgba(234,179,8,0.15)',   color: '#eab308' },
  'Vino rosado':       { bg: 'rgba(236,72,153,0.15)',  color: '#ec4899' },
  'Espumoso':          { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  'Destilados':        { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
  'Licor':             { bg: 'rgba(139,92,246,0.15)',  color: '#a855f7' },
  'Vermut':            { bg: 'rgba(244,63,94,0.15)',   color: '#fb7185' },
  'Agua sin gas':      { bg: 'rgba(34,211,238,0.15)',  color: '#22d3ee' },
  'Agua con gas':      { bg: 'rgba(56,189,248,0.15)',  color: '#38bdf8' },
  'Refresco':          { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  'Energética':        { bg: 'rgba(132,204,22,0.15)',  color: '#84cc16' },
  'Zumo':              { bg: 'rgba(251,146,60,0.15)',  color: '#fb923c' },
  'Sin alcohol':       { bg: 'rgba(113,113,122,0.15)', color: '#a1a1aa' },
}

const ORDEN_CATEGORIAS = [
  'Cerveza', 'Cerveza artesanal',
  'Vino tinto', 'Vino blanco', 'Vino rosado', 'Espumoso',
  'Agua sin gas', 'Agua con gas',
  'Refresco', 'Energética', 'Zumo',
  'Destilados', 'Licor', 'Vermut',
  'Sin alcohol',
]

export default function UserProductosPage() {
  const { userName } = useAuth('comercial')
  const { productos, loading } = useProductos()

  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const categoriasPresentes = ORDEN_CATEGORIAS.filter(c =>
    productos.some(p => p.categoria === c)
  )

  const filtered = productos.filter(p => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.marca?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
    return matchSearch && matchCat
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Catálogo de productos"
          subtitle={`${productos.length} productos disponibles`}
        />

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, marca o categoría..." />

        {/* Filtros */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setCategoriaActiva('Todos')}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              background: categoriaActiva === 'Todos' ? colors.primary : colors.surface,
              color: categoriaActiva === 'Todos' ? '#fff' : colors.textMuted,
              outline: categoriaActiva === 'Todos' ? 'none' : `1px solid ${colors.border}`,
            }}
          >
            Todos ({productos.length})
          </button>
          {categoriasPresentes.map(cat => {
            const s = CATEGORIA_COLORS[cat] ?? { bg: 'rgba(255,255,255,0.05)', color: colors.textMuted }
            const activo = categoriaActiva === cat
            const count = productos.filter(p => p.categoria === cat).length
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(activo ? 'Todos' : cat)}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: activo ? s.color : s.bg,
                  color: activo ? '#fff' : s.color,
                  outline: activo ? 'none' : `1px solid ${s.color}30`,
                }}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>

        {categoriaActiva !== 'Todos' && (
          <p style={{ color: colors.textDim, fontSize: 13, marginBottom: 12 }}>
            {filtered.length} productos en <span style={{ color: CATEGORIA_COLORS[categoriaActiva]?.color ?? colors.primary }}>{categoriaActiva}</span>
          </p>
        )}

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {['Nombre', 'Marca', 'Categoría', 'Stock', 'Precio venta', 'Proveedor'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: colors.textDim }}>No hay productos</td></tr>
                ) : filtered.map(p => {
                  const catStyle = CATEGORIA_COLORS[p.categoria] ?? { bg: '#1e2d4a', color: colors.primary }
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.nombre}</td>
                      <td style={tdStyle}>{p.marca || '—'}</td>
                      <td style={tdStyle}>
                        {p.categoria
                          ? <span style={{ background: catStyle.bg, color: catStyle.color, padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>{p.categoria}</span>
                          : '—'}
                      </td>
                      <td style={{ ...tdStyle, color: p.stock < 10 ? colors.danger : colors.success, fontWeight: 600 }}>
                        {p.stock} uds
                      </td>
                      <td style={{ ...tdStyle, color: colors.text, fontWeight: 600 }}>€{(p.precio_venta || 0).toFixed(2)}</td>
                      <td style={tdStyle}>{p.proveedores?.nombre || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
