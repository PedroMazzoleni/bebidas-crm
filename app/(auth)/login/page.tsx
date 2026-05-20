'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Email o contraseña incorrectos')
        return
      }

      if (data.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch {
      setError('Error inesperado al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: '#18181b', border: '1px solid #3f3f46',
    borderRadius: 8, color: '#fafafa', fontSize: 14,
    fontFamily: 'var(--font-sans), system-ui, sans-serif', boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#09090b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
    }}>
      <div style={{
        width: 420, background: '#111113',
        border: '1px solid #27272a', borderRadius: 16, padding: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            overflow: 'hidden', background: '#1c1009',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ color: '#fafafa', fontWeight: 700, fontSize: 16 }}>BEBIDAS CRM</div>
            <div style={{ color: '#f97316', fontSize: 10, letterSpacing: '1.5px', fontWeight: 700 }}>PANEL DE GESTIÓN</div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: '#fafafa', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>
            Iniciar sesión
          </h1>
          <p style={{ color: '#71717a', fontSize: 14, margin: 0 }}>
            Accede a tu panel de gestión
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@empresa.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: '#ef444415', border: '1px solid #ef444430',
              borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '11px', background: '#f97316', border: 'none',
            borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ color: '#71717a', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#f97316', textDecoration: 'none' }}>Crear cuenta</a>
        </p>
      </div>
    </div>
  )
}
