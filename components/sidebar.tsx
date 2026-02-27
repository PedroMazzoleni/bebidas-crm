'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

interface SidebarProps {
  role: 'admin' | 'comercial';
  userName: string;
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Inicio', icon: '⊞' },
  { href: '/admin/dashboard/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/admin/dashboard/clientes', label: 'Clientes', icon: '👥' },
  { href: '/admin/dashboard/proveedores', label: 'Proveedores', icon: '🏭' },
  { href: '/admin/dashboard/productos', label: 'Productos', icon: '🍶' },
  { href: '/admin/dashboard/comerciales', label: 'Comerciales', icon: '👤' },
];

const comercialLinks = [
  { href: '/user/dashboard', label: 'Inicio', icon: '⊞' },
  { href: '/user/dashboard/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/user/dashboard/clientes', label: 'Clientes', icon: '👥' },
];

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === 'admin' ? adminLinks : comercialLinks;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#0f1117',
      borderRight: '1px solid #1e2130',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      fontFamily: "'DM Sans', sans-serif",
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid #1e2130',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🍺</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>BEBIDAS</div>
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600, letterSpacing: '1px' }}>CRM</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ fontSize: 10, color: '#4b5563', fontWeight: 700, letterSpacing: '1.5px', padding: '0 12px 8px' }}>
          MENÚ
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                background: isActive ? '#1e2d4a' : 'transparent',
                color: isActive ? '#3b82f6' : '#9ca3af',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#1a1f2e';
                  (e.currentTarget as HTMLElement).style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                }
              }}>
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid #1e2130',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 8,
          background: '#1a1f2e', marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#e5e7eb', fontSize: 13, fontWeight: 600 }}>{userName}</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>{role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '9px 12px',
          background: 'transparent', border: '1px solid #1e2130',
          borderRadius: 8, color: '#6b7280', fontSize: 13,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = '#1a1f2e';
          (e.currentTarget as HTMLElement).style.color = '#ef4444';
          (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = '#6b7280';
          (e.currentTarget as HTMLElement).style.borderColor = '#1e2130';
        }}>
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}