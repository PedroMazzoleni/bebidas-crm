'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1) Login con email y password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setErrorMsg(authError?.message || 'No se pudo iniciar sesión');
        return;
      }

      const userId = authData.user.id;

      // 2) Leer el perfil del usuario para saber el rol
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error(profileError);
        setErrorMsg('No se pudo obtener el perfil del usuario');
        return;
      }

      const role = profile.role;

      // 3) Redirigir según el rol
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        // cliente o comercial
        router.push('/user/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
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
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        {errorMsg && (
          <p style={{ color: 'red', fontSize: 14 }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, background: '#000', color: '#fff', borderRadius: 4 }}
        >
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
      </p>
    </main>
  );
}