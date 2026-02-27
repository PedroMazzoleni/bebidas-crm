'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import Sidebar from '../../../../components/sidebar';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      setUserName(profile?.full_name || 'Comercial');

      const { data: comercial } = await supabase
        .from('comerciales').select('id').eq('nombre', profile?.full_name).single();

      if (comercial) {
        const { data } = await supabase
          .from('clientes').select('*')
          .eq('comercial_clie', comercial.id)
          .order('nombre_cliente');
        setClientes(data || []);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const filtered = clientes.filter(c =>
    c.nombre_cliente.toLowerCase().includes(search.toLowerCase())
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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#f9fafb', fontSize: 26, fontWeight: 700, margin: 0 }}>Mis Clientes</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>{clientes.length} clientes asignados</p>
        </div>

        <input
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20, maxWidth: 400 }}
        />

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ background: '#0f1117', border: '1px solid #1e2130', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2130' }}>
                  {['Nombre', 'Teléfono', 'Dirección', 'Total compras'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#6b7280', fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1e2130' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#e5e7eb', fontWeight: 500 }}>{c.nombre_cliente}</td>
                    <td style={{ padding: '14px 20px', color: '#9ca3af' }}>{c.telf || '—'}</td>
                    <td style={{ padding: '14px 20px', color: '#9ca3af' }}>{c.direccion || '—'}</td>
                    <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 600 }}>€{(c.total_compras || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#4b5563' }}>No tienes clientes asignados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}