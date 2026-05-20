'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/sidebar';
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles';

interface Pedido {
  id: string;
  num_pedido: number;
  fecha: string;
  estado: string;
  total: number;
  clientes?: { nombre_cliente: string };
}

export default function UserPedidosPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Comercial');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [comercialId, setComercialId] = useState<string | null>(null);
  const [clientes, setClientes] = useState<{ id: string; nombre_cliente: string }[]>([]);
  const [productos, setProductos] = useState<{ id: string; nombre: string; precio_venta: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ cliente_id: '', fecha: '', estado: 'pendiente' });
  const [lineas, setLineas] = useState([{ producto_id: '', cantidad: 1, precio_venta: 0 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) { router.push('/login'); return; }
      const me = await meRes.json();
      setUserName(me.full_name || 'Comercial');

      const statsRes = await fetch('/api/stats/user');
      if (statsRes.ok) {
        const stats = await statsRes.json();
        if (stats.comercialId) {
          setComercialId(stats.comercialId);
          const [pedidosRes, clientesRes] = await Promise.all([
            fetch(`/api/pedidos?comercial_id=${stats.comercialId}`),
            fetch(`/api/clientes?comercial_id=${stats.comercialId}`),
          ]);
          if (pedidosRes.ok) setPedidos(await pedidosRes.json());
          if (clientesRes.ok) setClientes(await clientesRes.json());
        }
      }

      const prodsRes = await fetch('/api/productos');
      if (prodsRes.ok) setProductos(await prodsRes.json());
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSave = async () => {
    if (!form.cliente_id || !comercialId) return;
    setSaving(true);
    const total = lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0);
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: form.cliente_id,
        comercial_id: comercialId,
        fecha: form.fecha || new Date().toISOString().split('T')[0],
        estado: form.estado,
        total,
        lineas: lineas.filter(l => l.producto_id && l.cantidad > 0),
      }),
    });

    if (res.ok) {
      const pedidosRes = await fetch(`/api/pedidos?comercial_id=${comercialId}`);
      if (pedidosRes.ok) setPedidos(await pedidosRes.json());
    }

    setForm({ cliente_id: '', fecha: '', estado: 'pendiente' });
    setLineas([{ producto_id: '', cantidad: 1, precio_venta: 0 }]);
    setShowModal(false);
    setSaving(false);
  };

  const estadoColor: Record<string, string> = {
    pendiente: '#eab308', confirmado: '#f97316', entregado: '#22c55e', cancelado: '#ef4444',
  };

  const filtered = pedidos.filter(p =>
    p.clientes?.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
    String(p.num_pedido).includes(search)
  );

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: colors.surface,
    border: `1px solid ${colors.border2}`, borderRadius: 8, color: colors.text,
    fontSize: 14, fontFamily: 'var(--font-sans), system-ui, sans-serif', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: colors.text, fontSize: 26, fontWeight: 700, margin: 0 }}>Mis Pedidos</h1>
            <p style={{ color: colors.textDim, marginTop: 4, fontSize: 14 }}>{pedidos.length} pedidos</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: colors.primary, border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-sans), system-ui, sans-serif',
          }}>+ Nuevo pedido</button>
        </div>

        <input
          placeholder="Buscar por cliente o nº pedido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20, maxWidth: 400 }}
        />

        {loading ? <p style={{ color: colors.textDim }}>Cargando...</p> : (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {['Nº Pedido', 'Fecha', 'Cliente', 'Total', 'Estado'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1c1c1e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: colors.primary, fontWeight: 700 }}>#{p.num_pedido}</td>
                    <td style={tdStyle}>{p.fecha}</td>
                    <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.clientes?.nombre_cliente || '—'}</td>
                    <td style={{ ...tdStyle, color: colors.text, fontWeight: 600 }}>€{(p.total || 0).toFixed(2)}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: estadoColor[p.estado] + '20', color: estadoColor[p.estado],
                        padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                      }}>{p.estado}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: colors.textDim }}>No tienes pedidos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: colors.surface, border: `1px solid ${colors.border2}`, borderRadius: 16, padding: 32, width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 24 }}>Nuevo pedido</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Cliente *</label>
                  <select value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} style={inputStyle}>
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_cliente}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Estado</label>
                  <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={inputStyle}>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Productos</div>
                {lineas.map((linea, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: 8, marginBottom: 8 }}>
                    <select value={linea.producto_id}
                      onChange={e => {
                        const prod = productos.find(p => p.id === e.target.value);
                        const updated = [...lineas];
                        updated[idx] = { ...updated[idx], producto_id: e.target.value, precio_venta: prod?.precio_venta || 0 };
                        setLineas(updated);
                      }}
                      style={inputStyle}>
                      <option value="">Producto</option>
                      {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                    <input type="number" min="1" value={linea.cantidad}
                      onChange={e => { const u = [...lineas]; u[idx].cantidad = parseInt(e.target.value) || 1; setLineas(u); }}
                      style={inputStyle} placeholder="Cant." />
                    <input type="number" value={linea.precio_venta}
                      onChange={e => { const u = [...lineas]; u[idx].precio_venta = parseFloat(e.target.value) || 0; setLineas(u); }}
                      style={inputStyle} placeholder="€" />
                    <button onClick={() => setLineas(lineas.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.danger, cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                ))}
                <button onClick={() => setLineas([...lineas, { producto_id: '', cantidad: 1, precio_venta: 0 }])}
                  style={{ background: 'transparent', border: `1px dashed ${colors.border2}`, borderRadius: 8, color: colors.textDim, padding: '8px 16px', cursor: 'pointer', fontSize: 13, width: '100%', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
                  + Añadir producto
                </button>
              </div>

              <div style={{ textAlign: 'right', color: colors.text, fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
                Total: €{lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0).toFixed(2)}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${colors.border2}`, borderRadius: 8, color: colors.textMuted, cursor: 'pointer', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.cliente_id} style={{ flex: 1, padding: '10px', background: colors.primary, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans), system-ui, sans-serif', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Guardando...' : 'Crear pedido'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
