'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

type Step = 'master' | 'register'

export default function RegisterPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('master')
  const [masterKey, setMasterKey] = useState('')
  const [masterError, setMasterError] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'comercial'>('comercial')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMasterKey = (e: React.FormEvent) => {
    e.preventDefault()
    const correct = process.env.NEXT_PUBLIC_MASTER_KEY
    if (masterKey === correct) {
      setMasterError('')
      setStep('register')
    } else {
      setMasterError('Clave incorrecta. Contacta con el administrador.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

      if (signUpError || !data.user) {
        setError(signUpError?.message || 'Error al crear la cuenta')
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role,
        status: 'active',
      })

      if (profileError) {
        setError('Error al guardar el perfil')
        return
      }

      router.push('/login')
    } catch {
      setError('Error inesperado')
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
            <div style={{ color: '#3b82f6', fontSize: 11, letterSpacing: '1px' }}>NUEVO USUARIO</div>
          </div>
        </div>

        {/* STEP 1: Clave maestra */}
        {step === 'master' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: '#f9fafb', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
                Acceso restringido
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                Introduce la clave maestra para crear una cuenta
              </p>
            </div>

            <form onSubmit={handleMasterKey} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Clave maestra
                </label>
                <input
                  type="password"
                  value={masterKey}
                  onChange={e => setMasterKey(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>

              {masterError && (
                <div style={{
                  background: '#ef444420', border: '1px solid #ef444440',
                  borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13,
                }}>
                  {masterError}
                </div>
              )}

              <button type="submit" style={{
                padding: '11px', background: '#3b82f6', border: 'none',
                borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                Verificar clave
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Registro */}
        {step === 'register' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: '#f9fafb', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
                Crear cuenta
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                Rellena los datos del nuevo usuario
              </p>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nombre Apellido"
                  required
                  style={inputStyle}
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Selector de rol */}
              <div>
                <label style={{ color: '#9ca3af', fontSize: 12, display: 'block', marginBottom: 10 }}>
                  Rol del usuario
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {(['admin', 'comercial'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: '12px', borderRadius: 8, cursor: 'pointer',
                        border: role === r ? '2px solid #3b82f6' : '1px solid #2d3348',
                        background: role === r ? '#1e2d4a' : '#0f1117',
                        color: role === r ? '#3b82f6' : '#9ca3af',
                        fontWeight: role === r ? 700 : 400,
                        fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s',
                      }}>
                      {r === 'admin' ? '🔑 Admin' : '💼 Comercial'}
                    </button>
                  ))}
                </div>
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
              }}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          </>
        )}

        <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Iniciar sesión</a>
        </p>
      </div>
    </div>
  )
}