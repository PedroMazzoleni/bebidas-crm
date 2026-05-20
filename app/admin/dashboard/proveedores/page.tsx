'use client'

import { useState } from 'react'
import { useProveedores, emptyProveedorForm, ProveedorForm, Proveedor } from '../../../../hooks/useProveedores'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import Modal from '../../../../components/ui/Modal'
import { FormField, SearchBar, PageHeader, DeleteButton } from '../../../../components/ui/FormComponents'
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles'
import { Edit2 } from 'lucide-react'

export default function ProveedoresPage() {
  const { userName } = useAuth('admin')
  const { proveedores, loading, crearProveedor, actualizarProveedor, eliminarProveedor } = useProveedores()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ProveedorForm>(emptyProveedorForm)
  const [saving, setSaving] = useState(false)

  const f = (key: keyof ProveedorForm) => ({
    value: form[key],
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })

  const openCrear = () => {
    setEditId(null)
    setForm(emptyProveedorForm)
    setShowModal(true)
  }

  const openEditar = (p: Proveedor) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, direccion: p.direccion, mail: p.mail, tipo_iva: p.tipo_iva, nif: p.nif, telefono: p.telefono })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editId) {
      await actualizarProveedor(editId, form)
    } else {
      await crearProveedor(form)
    }
    setForm(emptyProveedorForm)
    setShowModal(false)
    setSaving(false)
  }

  const filtered = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.nif?.includes(search)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Proveedores"
          subtitle={`${proveedores.length} proveedores registrados`}
          onNew={openCrear}
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
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1c1c1e'}
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
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => openEditar(p)}
                          style={{ background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.primary, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                        >
                          <Edit2 size={12} /> Editar
                        </button>
                        <DeleteButton onClick={() => { if (confirm('¿Eliminar?')) eliminarProveedor(p.id) }} />
                      </div>
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
          <Modal
            title={editId ? 'Editar proveedor' : 'Nuevo proveedor'}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            saving={saving}
            disabled={!form.nombre}
            width={480}
          >
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
