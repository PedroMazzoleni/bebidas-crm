'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link'; 

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      router.push('/login');
    } catch (err) {
      console.error(err);
      setErrorMsg('Error inesperado al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        
        <label>
          Nombre completo
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Rol
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          >
            <option value="admin">Admin</option>
            <option value="cliente">Cliente</option>
            <option value="comercial">Comercial</option>
          </select>
        </label>

        {errorMsg && (
          <p style={{ color: 'red', fontSize: 14 }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, background: '#000', color: '#fff', borderRadius: 4 }}
        >
          {loading ? 'Creando cuenta…' : 'Registrarse'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
      ¿Ya tienes cuenta?{' '}
  <Link href="/login">Ir al login</Link>
    </p>
    </main>
  );
}