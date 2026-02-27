'use client'

import { useState } from 'react'
import { useComerciales, emptyComercialForm, ComercialForm } from '../../../../hooks/useComerciales'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import Modal from '../../../../components/ui/Modal'
import { FormField, PageHeader, DeleteButton } from '../../../../components/ui/FormComponents'
import { StatCard } from '../../../../components/ui/FormComponents'
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles'

export default function ComercialPage() {
  const { userName } = useAuth('admin')
  const { comerciales, loading, crearComercial, eliminarComercial } = useComerciales()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ComercialForm>(emptyComercialForm)
  const [saving, setSaving] = useState(false)

  const f = (key: keyof ComercialForm) => ({
    value: form[key],
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })

  const handleSave = async () => {
    setSaving(true)
    await crearComercial(form)
    setForm(emptyComercialForm)
    setShowModal(false)
    setSaving(false)
  }

  const totalVentas = comerciales.reduce((s, c) => s + (c.ventas || 0), 0)
  const comisionMedia = comerciales.length
    ? (comerciales.reduce((s, c) => s + (c.comision_asignada || 0), 0) / comerciales.length).toFixed(1)
    : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Comerciales"
          subtitle="Solo visible para administradores"
          onNew={() => setShowModal(true)}
          newLabel="+ Nuevo comercial"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard label="Total comerciales" value={comerciales.length} icon="👤" color={colors.primary} />
          <StatCard label="Ventas totales" value={`€${totalVentas.toFixed(2)}`} icon="💰" color={colors.success} />
          <StatCard label="Comisión media" value={`${comisionMedia}%`} icon="📊" color={colors.warning} />
        </div>

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {['Nombre', 'Teléfono', 'Ventas', 'Comisión', ''].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comerciales.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${colors.border}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 13,
                        }}>{c.nombre.charAt(0).toUpperCase()}</div>
                        {c.nombre}
                      </div>
                    </td>
                    <td style={tdStyle}>{c.telf || '—'}</td>
                    <td style={{ ...tdStyle, color: colors.success, fontWeight: 600 }}>€{(c.ventas || 0).toFixed(2)}</td>
                    <td style={tdStyle}>
                      <span style={{ background: '#1e2d4a', color: colors.primary, padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                        {c.comision_asignada || 0}%
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <DeleteButton onClick={() => { if (confirm('¿Eliminar?')) eliminarComercial(c.id) }} />
                    </td>
                  </tr>
                ))}
                {comerciales.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: colors.textDim }}>No hay comerciales</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <Modal title="Nuevo comercial" onClose={() => setShowModal(false)}
            onSave={handleSave} saving={saving} disabled={!form.nombre}>
            <div style={{ display: 'grid', gap: 14 }}>
              <FormField label="Nombre" required {...f('nombre')} />
              <FormField label="Teléfono" {...f('telf')} />
              <FormField label="Comisión (%)" type="number" {...f('comision_asignada')} />
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}