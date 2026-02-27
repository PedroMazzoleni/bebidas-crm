'use client'

import { useState } from 'react'
import { useProductos, emptyProductoForm, ProductoForm } from '../../../../hooks/useProductos'
import { useProveedores } from '../../../../hooks/useProveedores'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import ProductosTable from '../../../../components/ProductosTable'
import Modal from '../../../../components/ui/Modal'
import { FormField, SelectField, SearchBar, PageHeader } from '../../../../components/ui/FormComponents'

export default function ProductosPage() {
  const { userName } = useAuth('admin')
  const { productos, loading, crearProducto, eliminarProducto } = useProductos()
  const { proveedores } = useProveedores()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ProductoForm>(emptyProductoForm)
  const [saving, setSaving] = useState(false)

  const f = (key: keyof ProductoForm) => ({
    value: form[key],
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })

  const handleSave = async () => {
    setSaving(true)
    await crearProducto(form)
    setForm(emptyProductoForm)
    setShowModal(false)
    setSaving(false)
  }

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.marca?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Productos"
          subtitle={`${productos.length} productos registrados`}
          onNew={() => setShowModal(true)}
          newLabel="+ Nuevo producto"
        />

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, marca o categoría..." />

        {loading
          ? <p style={{ color: '#6b7280' }}>Cargando...</p>
          : <ProductosTable productos={filtered} onEliminar={id => {
              if (confirm('¿Eliminar este producto?')) eliminarProducto(id)
            }} />
        }

        {showModal && (
          <Modal title="Nuevo producto" onClose={() => setShowModal(false)}
            onSave={handleSave} saving={saving} disabled={!form.nombre} width={480}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Nombre" required placeholder="Nombre del producto" {...f('nombre')} />
              </div>
              <FormField label="Marca" placeholder="Marca" {...f('marca')} />
              <FormField label="Categoría" placeholder="Ej: Cerveza, Refresco..." {...f('categoria')} />
              <FormField label="Stock inicial" type="number" placeholder="0" {...f('stock')} />
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