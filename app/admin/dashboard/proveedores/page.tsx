'use client'

import { useState } from 'react'
import { useProveedores, emptyProveedorForm, ProveedorForm } from '../../../../hooks/useProveedores'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import Modal from '../../../../components/ui/Modal'
import { FormField, SearchBar, PageHeader, DeleteButton } from '../../../../components/ui/FormComponents'
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles'

export default function ProveedoresPage() {
  const { userName } = useAuth('admin')
  const { proveedores, loading, crearProveedor, eliminarProveedor } = useProveedores()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ProveedorForm>(emptyProveedorForm)
  const [saving, setSaving] = useState(false)

  const f = (key: keyof ProveedorForm) => ({
    value: form[key],
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })

  const handleSave = async () => {
    setSaving(true)
    await crearProveedor(form)
    setForm(emptyProveedorForm)
    setShowModal(false)
    setSaving(false)
  }

  const filtered = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.nif?.includes(search)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Proveedores"
          subtitle={`${proveedores.length} proveedores registrados`}
          onNew={() => setShowModal(true)}
          newLabel="+ Nuevo proveedor"
        />

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o NIF..." />

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {['Nombre', 'NIF', 'Teléfono', 'Email', 'Dirección', 'Tipo IVA', ''].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.nombre}</td>
                    <td style={tdStyle}>{p.nif || '—'}</td>
                    <td style={tdStyle}>{p.telefono || '—'}</td>
                    <td style={tdStyle}>{p.mail || '—'}</td>
                    <td style={tdStyle}>{p.direccion || '—'}</td>
                    <td style={tdStyle}>
                      {p.tipo_iva
                        ? <span style={{ background: '#1e2d4a', color: colors.primary, padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>{p.tipo_iva}</span>
                        : '—'}
                    </td>
                    <td style={tdStyle}>
                      <DeleteButton onClick={() => { if (confirm('¿Eliminar?')) eliminarProveedor(p.id) }} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: colors.textDim }}>No hay proveedores</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <Modal title="Nuevo proveedor" onClose={() => setShowModal(false)}
            onSave={handleSave} saving={saving} disabled={!form.nombre} width={480}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Nombre" required placeholder="Nombre del proveedor" {...f('nombre')} />
              </div>
              <FormField label="NIF" placeholder="B12345678" {...f('nif')} />
              <FormField label="Tipo IVA" placeholder="21%, 10%, 4%..." {...f('tipo_iva')} />
              <FormField label="Teléfono" placeholder="900 000 000" {...f('telefono')} />
              <FormField label="Email" type="email" placeholder="info@proveedor.com" {...f('mail')} />
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Dirección" placeholder="Calle, ciudad..." {...f('direccion')} />
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}