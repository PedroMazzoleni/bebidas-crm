'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg('No se pudieron cargar los usuarios');
      } else {
        setProfiles(data || []);
      }

      setLoading(false);
    };

    fetchProfiles();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Panel de Administración</h1>
      <p>Listado básico de usuarios (profiles)</p>

      {loading && <p>Cargando usuarios...</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {!loading && !errorMsg && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: 20,
            fontSize: 14,
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Nombre</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Rol</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Estado</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Creado</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{p.full_name || '(sin nombre)'}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{p.role}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{p.status}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  {new Date(p.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
``