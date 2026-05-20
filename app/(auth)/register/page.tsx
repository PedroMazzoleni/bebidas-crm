'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { KeyRound, Briefcase } from 'lucide-react'

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear la cuenta')
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
            <div style={{ color: '#f97316', fontSize: 10, letterSpacing: '1.5px', fontWeight: 700 }}>NUEVO USUARIO</div>
          </div>
        </div>

        {step === 'master' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: '#fafafa', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
                Acceso restringido
              </h1>
              <p style={{ color: '#71717a', fontSize: 14, margin: 0 }}>
                Introduce la clave maestra para crear una cuenta
              </p>
            </div>

            <form onSubmit={handleMasterKey} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 6 }}>
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
                  background: '#ef444415', border: '1px solid #ef444430',
                  borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13,
                }}>
                  {masterError}
                </div>
              )}

              <button type="submit" style={{
                padding: '11px', background: '#f97316', border: 'none',
                borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', fontFamily: 'var(--font-sans), system-ui, sans-serif',
              }}>
                Verificar clave
              </button>
            </form>
          </>
        )}

        {step === 'register' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: '#fafafa', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
                Crear cuenta
              </h1>
              <p style={{ color: '#71717a', fontSize: 14, margin: 0 }}>
                Rellena los datos del nuevo usuario
              </p>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 6 }}>
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
                  placeholder="Mínimo 6 caracteres"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 6 }}>
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

              <div>
                <label style={{ color: '#a1a1aa', fontSize: 12, display: 'block', marginBottom: 10 }}>
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
                        border: role === r ? '2px solid #f97316' : '1px solid #3f3f46',
                        background: role === r ? 'rgba(249,115,22,0.1)' : '#18181b',
                        color: role === r ? '#f97316' : '#a1a1aa',
                        fontWeight: role === r ? 700 : 400,
                        fontSize: 14, fontFamily: 'var(--font-sans), system-ui, sans-serif',
                        transition: 'all 0.15s',
                      }}>
                      {r === 'admin'
                        ? <><KeyRound size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Admin</>
                        : <><Briefcase size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Comercial</>
                      }
                    </button>
                  ))}
                </div>
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
                fontFamily: 'var(--font-sans), system-ui, sans-serif', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          </>
        )}

        <p style={{ color: '#71717a', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" style={{ color: '#f97316', textDecoration: 'none' }}>Iniciar sesión</a>
        </p>
      </div>
    </div>
  )
}
