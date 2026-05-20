'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Users, Warehouse, Wine, Briefcase, LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'comercial';
  userName: string;
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Inicio', Icon: LayoutDashboard },
  { href: '/admin/dashboard/pedidos', label: 'Pedidos', Icon: Package },
  { href: '/admin/dashboard/clientes', label: 'Clientes', Icon: Users },
  { href: '/admin/dashboard/proveedores', label: 'Proveedores', Icon: Warehouse },
  { href: '/admin/dashboard/productos', label: 'Productos', Icon: Wine },
  { href: '/admin/dashboard/comerciales', label: 'Comerciales', Icon: Briefcase },
];

const comercialLinks = [
  { href: '/user/dashboard', label: 'Inicio', Icon: LayoutDashboard },
  { href: '/user/dashboard/pedidos', label: 'Pedidos', Icon: Package },
  { href: '/user/dashboard/clientes', label: 'Clientes', Icon: Users },
  { href: '/user/dashboard/productos', label: 'Productos', Icon: Wine },
];

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === 'admin' ? adminLinks : comercialLinks;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#111113',
      borderRight: '1px solid #27272a',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #27272a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            overflow: 'hidden',
            flexShrink: 0,
            background: '#1c1009',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image src="/logo.png" alt="Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ color: '#fafafa', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px' }}>BEBIDAS</div>
            <div style={{ color: '#f97316', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px' }}>CRM</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: 10, color: '#52525b', fontWeight: 700, letterSpacing: '1.5px', padding: '0 10px 8px' }}>
          MENÚ
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                marginBottom: 2,
                background: isActive ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                color: isActive ? '#f97316' : '#71717a',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#1c1c1e';
                  (e.currentTarget as HTMLElement).style.color = '#d4d4d8';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#71717a';
                }
              }}>
                <link.Icon size={16} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid #27272a',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px', borderRadius: 8,
          background: '#1c1c1e', marginBottom: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#e4e4e7', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ color: '#52525b', fontSize: 11 }}>{role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '8px 10px',
          background: 'transparent', border: '1px solid #27272a',
          borderRadius: 8, color: '#71717a', fontSize: 13,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = '#1c1c1e';
          (e.currentTarget as HTMLElement).style.color = '#ef4444';
          (e.currentTarget as HTMLElement).style.borderColor = '#ef444440';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = '#71717a';
          (e.currentTarget as HTMLElement).style.borderColor = '#27272a';
        }}>
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
