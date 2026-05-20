'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/sidebar';
import { colors, thStyle, tdStyle } from '../../../../components/ui/styles';

interface Cliente {
  id: string;
  nombre_cliente: string;
  telf: string;
  direccion: string;
  total_compras: number;
}

export default function UserClientesPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Comercial');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
          const clientesRes = await fetch(`/api/clientes?comercial_id=${stats.comercialId}`);
          if (clientesRes.ok) setClientes(await clientesRes.json());
        }
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const filtered = clientes.filter(c =>
    c.nombre_cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: colors.text, fontSize: 26, fontWeight: 700, margin: 0 }}>Mis Clientes</h1>
          <p style={{ color: colors.textDim, marginTop: 4, fontSize: 14 }}>{clientes.length} clientes asignados</p>
        </div>

        <input
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 400, marginBottom: 20,
            padding: '10px 12px', background: colors.surface,
            border: `1px solid ${colors.border2}`, borderRadius: 8,
            color: colors.text, fontSize: 14,
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            boxSizing: 'border-box',
          }}
        />

        {loading ? <p style={{ color: colors.textDim }}>Cargando...</p> : (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {['Nombre', 'Teléfono', 'Dirección', 'Total compras'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${colors.border}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1c1c1e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{c.nombre_cliente}</td>
                    <td style={tdStyle}>{c.telf || '—'}</td>
                    <td style={tdStyle}>{c.direccion || '—'}</td>
                    <td style={{ ...tdStyle, color: colors.success, fontWeight: 600 }}>€{(c.total_compras || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: colors.textDim }}>No tienes clientes asignados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
