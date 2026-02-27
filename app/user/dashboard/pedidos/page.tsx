'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import Sidebar from '../../../../components/sidebar';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      setUserName(profile?.full_name || 'Comercial');

      const { data: comercial } = await supabase
        .from('comerciales').select('id').eq('nombre', profile?.full_name).single();

      if (comercial) {
        setComercialId(comercial.id);
        const { data } = await supabase
          .from('pedidos')
          .select('*, clientes(nombre_cliente)')
          .eq('comercial_id', comercial.id)
          .order('num_pedido', { ascending: false });
        setPedidos(data || []);

        const { data: clis } = await supabase.from('clientes').select('id, nombre_cliente').eq('comercial_clie', comercial.id);
        setClientes(clis || []);
      }
      const { data: prods } = await supabase.from('productos').select('id, nombre, precio_venta').order('nombre');
      setProductos(prods || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSave = async () => {
    if (!form.cliente_id || !comercialId) return;
    setSaving(true);
    const total = lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0);
    const { data: pedido } = await supabase.from('pedidos').insert({
      cliente_id: form.cliente_id,
      comercial_id: comercialId,
      fecha: form.fecha || new Date().toISOString().split('T')[0],
      estado: form.estado,
      total,
    }).select().single();

    if (pedido) {
      const lineasValidas = lineas.filter(l => l.producto_id && l.cantidad > 0);
      if (lineasValidas.length > 0) {
        await supabase.from('lineas_pedido').insert(lineasValidas.map(l => ({
          pedido_id: pedido.id, producto_id: l.producto_id,
          cantidad: l.cantidad, precio_venta: l.precio_venta,
        })));
      }
    }

    setForm({ cliente_id: '', fecha: '', estado: 'pendiente' });
    setLineas([{ producto_id: '', cantidad: 1, precio_venta: 0 }]);
    setShowModal(false);

    // Refresh
    const { data } = await supabase.from('pedidos').select('*, clientes(nombre_cliente)')
      .eq('comercial_id', comercialId).order('num_pedido', { ascending: false });
    setPedidos(data || []);
    setSaving(false);
  };

  const estadoColor: Record<string, string> = {
    pendiente: '#f59e0b', confirmado: '#3b82f6', entregado: '#10b981', cancelado: '#ef4444',
  };

  const filtered = pedidos.filter(p =>
    p.clientes?.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
    String(p.num_pedido).includes(search)
  );

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: '#0f1117',
    border: '1px solid #2d3348', borderRadius: 8, color: '#e5e7eb',
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#f9fafb', fontSize: 26, fontWeight: 700, margin: 0 }}>Mis Pedidos</h1>
            <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>{pedidos.length} pedidos</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: '#3b82f6', border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>+ Nuevo pedido</button>
        </div>

        <input
          placeholder="Buscar por cliente o nº pedido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20, maxWidth: 400 }}
        />

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ background: '#0f1117', border: '1px solid #1e2130', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2130' }}>
                  {['Nº Pedido', 'Fecha', 'Cliente', 'Total', 'Estado'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#6b7280', fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1e2130' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#3b82f6', fontWeight: 700 }}>#{p.num_pedido}</td>
                    <td style={{ padding: '14px 20px', color: '#9ca3af' }}>{p.fecha}</td>
                    <td style={{ padding: '14px 20px', color: '#e5e7eb', fontWeight: 500 }}>{p.clientes?.nombre_cliente || '—'}</td>
                    <td style={{ padding: '14px 20px', color: '#f9fafb', fontWeight: 600 }}>€{(p.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        background: estadoColor[p.estado] + '20', color: estadoColor[p.estado],
                        padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                      }}>{p.estado}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#4b5563' }}>No tienes pedidos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#0f1117', border: '1px solid #2d3348', borderRadius: 16, padding: 32, width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ color: '#f9fafb', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 24 }}>Nuevo pedido</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>Cliente *</label>
                  <select value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} style={inputStyle}>
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_cliente}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>Estado</label>
                  <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={inputStyle}>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Productos</div>
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
                      style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 6, color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                ))}
                <button onClick={() => setLineas([...lineas, { producto_id: '', cantidad: 1, precio_venta: 0 }])}
                  style={{ background: 'transparent', border: '1px dashed #2d3348', borderRadius: 8, color: '#6b7280', padding: '8px 16px', cursor: 'pointer', fontSize: 13, width: '100%', fontFamily: "'DM Sans', sans-serif" }}>
                  + Añadir producto
                </button>
              </div>

              <div style={{ textAlign: 'right', color: '#f9fafb', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
                Total: €{lineas.reduce((sum, l) => sum + l.cantidad * l.precio_venta, 0).toFixed(2)}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #2d3348', borderRadius: 8, color: '#9ca3af', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.cliente_id} style={{ flex: 1, padding: '10px', background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: saving ? 0.7 : 1 }}>
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