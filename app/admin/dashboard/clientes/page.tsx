'use client'

import { useState } from 'react'
import { useClientes, ClienteForm } from '../../../../hooks/useClientes'
import { useComerciales } from '../../../../hooks/useComerciales'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import ClientesTable from '../../../../components/ClientesTable'
import Modal from '../../../../components/ui/Modal'
import { FormField, SelectField, SearchBar, PageHeader } from '../../../../components/ui/FormComponents'

const emptyForm: ClienteForm = { nombre_cliente: '', telf: '', direccion: '', comercial_clie: '' }

export default function ClientesPage() {
  const { userName } = useAuth('admin')
  const { clientes, loading, crearCliente, eliminarCliente } = useClientes()
  const { comerciales } = useComerciales()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ClienteForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await crearCliente(form)
    setForm(emptyForm)
    setShowModal(false)
    setSaving(false)
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return
    await eliminarCliente(id)
  }

  const filtered = clientes.filter(c =>
    c.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
    c.telf?.includes(search)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Clientes"
          subtitle={`${clientes.length} clientes registrados`}
          onNew={() => setShowModal(true)}
          newLabel="+ Nuevo cliente"
        />

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o teléfono..." />

        {loading
          ? <p style={{ color: '#6b7280' }}>Cargando...</p>
          : <ClientesTable clientes={filtered} onEliminar={handleEliminar} />
        }

        {showModal && (
          <Modal title="Nuevo cliente" onClose={() => setShowModal(false)}
            onSave={handleSave} saving={saving} disabled={!form.nombre_cliente}>
            <div style={{ display: 'grid', gap: 14 }}>
              <FormField label="Nombre" required value={form.nombre_cliente}
                onChange={v => setForm({ ...form, nombre_cliente: v })} placeholder="Nombre del cliente" />
              <FormField label="Teléfono" value={form.telf}
                onChange={v => setForm({ ...form, telf: v })} placeholder="600 000 000" />
              <FormField label="Dirección" value={form.direccion}
                onChange={v => setForm({ ...form, direccion: v })} placeholder="Calle, ciudad..." />
              <SelectField
                label="Comercial asignado"
                value={form.comercial_clie}
                onChange={v => setForm({ ...form, comercial_clie: v })}
                options={comerciales.map(c => ({ value: c.id, label: c.nombre }))}
                placeholder="Sin asignar"
              />
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}