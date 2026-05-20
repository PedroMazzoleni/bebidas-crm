'use client'

import { useState } from 'react'
import { usePedidos, emptyPedidoForm, emptyLinea, LineaPedido, PedidoForm, Pedido } from '../../../../hooks/usePedidos'
import { useClientes } from '../../../../hooks/useClientes'
import { useComerciales } from '../../../../hooks/useComerciales'
import { useProductos } from '../../../../hooks/useProductos'
import { useAuth } from '../../../../hooks/useAuth'
import Sidebar from '../../../../components/sidebar'
import PedidosTable from '../../../../components/PedidosTable'
import Modal from '../../../../components/ui/Modal'
import { SelectField, SearchBar, PageHeader } from '../../../../components/ui/FormComponents'
import { inputStyle, colors } from '../../../../components/ui/styles'

export default function PedidosPage() {
  const { userName } = useAuth('admin')
  const { pedidos, loading, crearPedido, cambiarEstado, actualizarPedido } = usePedidos()
  const { clientes } = useClientes()
  const { comerciales } = useComerciales()
  const { productos } = useProductos()

  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<PedidoForm>(emptyPedidoForm)
  const [lineas, setLineas] = useState<LineaPedido[]>([{ ...emptyLinea }])
  const [saving, setSaving] = useState(false)

  const openCrear = () => {
    setEditId(null)
    setForm(emptyPedidoForm)
    setLineas([{ ...emptyLinea }])
    setShowModal(true)
  }

  const openEditar = async (p: Pedido) => {
    setEditId(p.id)
    setForm({ cliente_id: p.cliente_id, comercial_id: p.comercial_id, fecha: p.fecha, estado: p.estado })
    // Fetch full pedido to get lineas
    const res = await fetch(`/api/pedidos/${p.id}`)
    const full = await res.json()
    setLineas(
      full.lineas?.map((l: { producto_id: string; cantidad: number; precio_venta: number }) => ({
        producto_id: l.producto_id,
        cantidad: l.cantidad,
        precio_venta: l.precio_venta,
      })) ?? [{ ...emptyLinea }]
    )
    setShowModal(true)
  }

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    setForm({ ...form, cliente_id: clienteId, comercial_id: cliente?.comercial_clie || '' })
  }

  const handleSave = async () => {
    setSaving(true)
    if (editId) {
      await actualizarPedido(editId, form, lineas)
    } else {
      await crearPedido(form, lineas)
    }
    setShowModal(false)
    setSaving(false)
  }

  const handleProductoChange = (idx: number, productoId: string) => {
    const prod = productos.find(p => p.id === productoId)
    const updated = [...lineas]
    updated[idx] = { ...updated[idx], producto_id: productoId, precio_venta: prod?.precio_venta || 0 }
    setLineas(updated)
  }

  const total = lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0)

  const filtered = pedidos.filter(p => {
    const matchSearch = p.clientes?.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
      String(p.num_pedido).includes(search)
    const matchEstado = filterEstado ? p.estado === filterEstado : true
    return matchSearch && matchEstado
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="admin" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>

        <PageHeader
          title="Pedidos"
          subtitle={`${pedidos.length} pedidos en total`}
          onNew={openCrear}
          newLabel="+ Nuevo pedido"
        />

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por cliente o nº pedido..." />
          <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
            style={{ ...inputStyle, maxWidth: 180, marginBottom: 0 }}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {loading
          ? <p style={{ color: '#6b7280' }}>Cargando...</p>
          : <PedidosTable pedidos={filtered} onCambiarEstado={cambiarEstado} onEditar={openEditar} />
        }

        {showModal && (
          <Modal
            title={editId ? 'Editar pedido' : 'Nuevo pedido'}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            saving={saving}
            disabled={!form.cliente_id || lineas.every(l => !l.producto_id)}
            width={560}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <SelectField label="Cliente" value={form.cliente_id}
                  onChange={handleClienteChange}
                  options={clientes.map(c => ({ value: c.id, label: c.nombre_cliente }))}
                  placeholder="Seleccionar cliente *" />
              </div>
              <div>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Comercial asignado</label>
                <div style={{
                  padding: '10px 12px', background: '#1c1c1e',
                  border: `1px solid ${colors.border2}`, borderRadius: 8,
                  color: form.comercial_id ? colors.text : colors.textDim, fontSize: 14,
                }}>
                  {form.comercial_id
                    ? comerciales.find(c => c.id === form.comercial_id)?.nombre
                    : 'Se asignará al seleccionar cliente'}
                </div>
              </div>
              <SelectField label="Estado" value={form.estado}
                onChange={v => setForm({ ...form, estado: v })}
                options={[
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'confirmado', label: 'Confirmado' },
                  { value: 'entregado', label: 'Entregado' },
                  { value: 'cancelado', label: 'Cancelado' },
                ]} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Productos</div>
              {lineas.map((linea, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: 8, marginBottom: 8 }}>
                  <select value={linea.producto_id} onChange={e => handleProductoChange(idx, e.target.value)} style={inputStyle}>
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <input type="number" min="1" value={linea.cantidad} placeholder="Cant."
                    onChange={e => { const u = [...lineas]; u[idx] = { ...u[idx], cantidad: parseInt(e.target.value) || 1 }; setLineas(u) }}
                    style={inputStyle} />
                  <input type="number" value={linea.precio_venta} placeholder="€"
                    onChange={e => { const u = [...lineas]; u[idx] = { ...u[idx], precio_venta: parseFloat(e.target.value) || 0 }; setLineas(u) }}
                    style={inputStyle} />
                  <button onClick={() => setLineas(lineas.filter((_, i) => i !== idx))}
                    style={{ background: 'transparent', border: `1px solid #374151`, borderRadius: 6, color: colors.danger, cursor: 'pointer', fontSize: 16 }}>×</button>
                </div>
              ))}
              <button onClick={() => setLineas([...lineas, { ...emptyLinea }])} style={{
                background: 'transparent', border: `1px dashed ${colors.border2}`,
                borderRadius: 8, color: colors.textDim, padding: '8px 16px',
                cursor: 'pointer', fontSize: 13, width: '100%', fontFamily: 'var(--font-sans), system-ui, sans-serif',
              }}>+ Añadir producto</button>
            </div>

            <div style={{ textAlign: 'right', color: colors.text, fontWeight: 700, fontSize: 16, marginTop: 12 }}>
              Total: €{total.toFixed(2)}
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}
