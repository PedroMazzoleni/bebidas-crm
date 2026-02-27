'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Sidebar from '../../../components/sidebar';

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Comercial');
  const [stats, setStats] = useState({ misPedidos: 0, misClientes: 0, pendientes: 0, totalVentas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('full_name, role').eq('id', user.id).single();
      if (!profile) { router.push('/login'); return; }
      if (profile.role === 'admin') { router.push('/admin/dashboard'); return; }

      setUserName(profile.full_name || 'Comercial');

      // Find comercial record linked to this user by name (simple approach)
      const { data: comercial } = await supabase
        .from('comerciales').select('id, ventas').eq('nombre', profile.full_name).single();

      if (comercial) {
        const [pedidos, clientes, pendientes] = await Promise.all([
          supabase.from('pedidos').select('id', { count: 'exact', head: true }).eq('comercial_id', comercial.id),
          supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('comercial_clie', comercial.id),
          supabase.from('pedidos').select('id', { count: 'exact', head: true }).eq('comercial_id', comercial.id).eq('estado', 'pendiente'),
        ]);
        setStats({
          misPedidos: pedidos.count || 0,
          misClientes: clientes.count || 0,
          pendientes: pendientes.count || 0,
          totalVentas: comercial.ventas || 0,
        });
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const cards = [
    { label: 'Mis pedidos', value: stats.misPedidos, icon: '📦', color: '#3b82f6', href: '/user/dashboard/pedidos' },
    { label: 'Pendientes', value: stats.pendientes, icon: '⏳', color: '#f59e0b', href: '/user/dashboard/pedidos' },
    { label: 'Mis clientes', value: stats.misClientes, icon: '👥', color: '#10b981', href: '/user/dashboard/clientes' },
    { label: 'Mis ventas', value: `€${stats.totalVentas.toFixed(2)}`, icon: '💰', color: '#8b5cf6', href: '/user/dashboard/pedidos' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b12', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: '#f9fafb', fontSize: 28, fontWeight: 700, margin: 0 }}>Hola, {userName} 👋</h1>
          <p style={{ color: '#6b7280', marginTop: 6, fontSize: 15 }}>Panel de comercial</p>
        </div>

        {loading ? <p style={{ color: '#6b7280' }}>Cargando...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700 }}>
            {cards.map(card => (
              <div key={card.label}
                onClick={() => router.push(card.href)}
                style={{
                  background: '#0f1117', border: '1px solid #1e2130',
                  borderRadius: 12, padding: '28px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = card.color;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e2130';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>{card.label}</div>
                    <div style={{ color: '#f9fafb', fontSize: 34, fontWeight: 700 }}>{card.value}</div>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: card.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}