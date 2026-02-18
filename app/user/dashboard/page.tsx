'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';


type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  status: string;
};

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) Obtenemos el usuario autenticado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg('No se pudo obtener el usuario autenticado');
        setLoading(false);
        return;
      }

      // 2) Cargamos su perfil
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, status')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.error(error);
        setErrorMsg('No se pudo obtener el perfil');
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <main style={{ maxWidth: 600, margin: '40px auto' }}>Cargando perfil...</main>;
  }

  if (errorMsg) {
    return (
      <main style={{ maxWidth: 600, margin: '40px auto' }}>
        <p style={{ color: 'red' }}>{errorMsg}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main style={{ maxWidth: 600, margin: '40px auto' }}>
        <p>No se encontró el perfil.</p>
      </main>
    );
  }

  const isCliente = profile.role === 'cliente';
  const isComercial = profile.role === 'comercial';

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Panel de Usuario</h1>

      <section style={{ marginTop: 20 }}>
        <h2>Datos básicos</h2>
        <p><strong>Nombre:</strong> {profile.full_name || '(sin nombre)'}</p>
        <p><strong>Rol:</strong> {profile.role}</p>
        <p><strong>Estado:</strong> {profile.status}</p>
      </section>

      {/* Diferenciar vista cliente vs comercial */}
      {isCliente && (
        <section style={{ marginTop: 30, padding: 16, background: '#f3f3f3', borderRadius: 8 }}>
          <h2>Zona para Cliente</h2>
          <p>Aquí podrías mostrar información de pedidos, facturas, etc.</p>
        </section>
      )}

      {isComercial && (
        <section style={{ marginTop: 30, padding: 16, background: '#e8f5ff', borderRadius: 8 }}>
          <h2>Zona para Comercial</h2>
          <p>Aquí podrías mostrar listado de clientes asignados, objetivos, etc.</p>
        </section>
      )}

      {profile.role === 'admin' && (
        <section style={{ marginTop: 30, padding: 16, background: '#fff3cd', borderRadius: 8 }}>
          <h2>Nota</h2>
          <p>
            Aunque este panel es para clientes/comerciales, tu rol es admin. Deberías usar el panel de administración en{' '}
            <a href="/admin/dashboard">/admin/dashboard</a>.
          </p>
        </section>
      )}
    </main>
  );
}