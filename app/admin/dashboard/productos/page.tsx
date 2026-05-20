'use client'

import { useState } from 'react'
import { useProductos, emptyProductoForm, ProductoForm, Producto } from '../../../../hooks/useProductos'
import { useProveedores } from '../../../../hooks/useProveedores'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import ProductosTable from '../../../../components/ProductosTable'
import Modal from '../../../../components/ui/Modal'
import { FormField, SelectField, SearchBar, PageHeader } from '../../../../components/ui/FormComponents'
import { colors } from '../../../../components/ui/styles'

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

export default function ProductosPage() {
  const { userName } = useAuth('admin')
  const { productos, loading, crearProducto, actualizarProducto, eliminarProducto } = useProductos()
  const { proveedores } = useProveedores()

  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductoForm>(emptyProductoForm)
  const [saving, setSaving] = useState(false)

  const f = (key: keyof ProductoForm) => ({
    value: form[key],
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })

  const openCrear = () => {
    setEditId(null)
    setForm(emptyProductoForm)
    setShowModal(true)
  }

  const openEditar = (p: Producto) => {
    setEditId(p.id)
    setForm({
      nombre: p.nombre,
      marca: p.marca,
      categoria: p.categoria,
      stock: String(p.stock),
      precio_venta: String(p.precio_venta),
      precio_compra: String(p.precio_compra),
      proveedor_id: p.proveedor_id ?? '',
      fecha_caducidad: p.fecha_caducidad ?? '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editId) {
      await actualizarProducto(editId, form)
    } else {
      await crearProducto(form)
    }
    setShowModal(false)
    setSaving(false)
  }

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
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Productos"
          subtitle={`${productos.length} productos registrados`}
          onNew={openCrear}
          newLabel="+ Nuevo producto"
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
            Mostrando {filtered.length} productos en <span style={{ color: CATEGORIA_COLORS[categoriaActiva]?.color ?? colors.primary }}>{categoriaActiva}</span>
          </p>
        )}

        {loading
          ? <p style={{ color: '#6b7280' }}>Cargando...</p>
          : <ProductosTable
              productos={filtered}
              onEditar={openEditar}
              onEliminar={id => { if (confirm('¿Eliminar este producto?')) eliminarProducto(id) }}
            />
        }

        {showModal && (
          <Modal
            title={editId ? 'Editar producto' : 'Nuevo producto'}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            saving={saving}
            disabled={!form.nombre}
            width={480}
          >
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
                  onChange={v => setForm({ ...form, proveedor_id: v })}
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
