'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/sidebar';
import { Package, Clock, Users, TrendingUp } from 'lucide-react';
import { colors } from '../../../components/ui/styles';

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Comercial');
  const [stats, setStats] = useState({ misPedidos: 0, misClientes: 0, pendientes: 0, totalVentas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) { router.push('/login'); return; }
      const me = await meRes.json();
      if (me.role === 'admin') { router.push('/admin/dashboard'); return; }
      setUserName(me.full_name || 'Comercial');

      const statsRes = await fetch('/api/stats/user');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const cards = [
    { label: 'Mis pedidos', value: stats.misPedidos, icon: <Package size={22} />, color: colors.primary, href: '/user/dashboard/pedidos' },
    { label: 'Pendientes', value: stats.pendientes, icon: <Clock size={22} />, color: colors.warning, href: '/user/dashboard/pedidos' },
    { label: 'Mis clientes', value: stats.misClientes, icon: <Users size={22} />, color: colors.success, href: '/user/dashboard/clientes' },
    { label: 'Mis ventas', value: `€${stats.totalVentas.toFixed(2)}`, icon: <TrendingUp size={22} />, color: colors.purple, href: '/user/dashboard/pedidos' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <Sidebar role="comercial" userName={userName} />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: colors.text, fontSize: 28, fontWeight: 700, margin: 0 }}>Hola, {userName}</h1>
          <p style={{ color: colors.textDim, marginTop: 6, fontSize: 15 }}>Panel de comercial</p>
        </div>

        {loading ? <p style={{ color: colors.textDim }}>Cargando...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700 }}>
            {cards.map(card => (
              <div key={card.label}
                onClick={() => router.push(card.href)}
                style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 12, padding: '28px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = card.color;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>{card.label}</div>
                    <div style={{ color: colors.text, fontSize: 34, fontWeight: 700 }}>{card.value}</div>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: card.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
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
