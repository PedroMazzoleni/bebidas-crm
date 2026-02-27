'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

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
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError || !authData.user) {
        setError('Email o contraseña incorrectos')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('role').eq('id', authData.user.id).single()

      if (profileError || !profile) {
        setError('No se pudo obtener el perfil del usuario')
        return
      }

      if (profile.role === 'admin') {
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
    background: '#0f1117', border: '1px solid #2d3348',
    borderRadius: 8, color: '#f9fafb', fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080b12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: 420, background: '#0f1117',
        border: '1px solid #1e2130', borderRadius: 16, padding: 40,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🍺</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>BEBIDAS CRM</div>
            <div style={{ color: '#3b82f6', fontSize: 11, letterSpacing: '1px' }}>PANEL DE GESTIÓN</div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: '#f9fafb', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>
            Iniciar sesión
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
            Accede a tu panel de gestión
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>
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
            <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>
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
              background: '#ef444420', border: '1px solid #ef444440',
              borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '11px', background: '#3b82f6', border: 'none',
            borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1,
            marginTop: 4,
          }}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Crear cuenta</a>
        </p>
      </div>
    </div>
  )
}