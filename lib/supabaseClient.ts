'use client'; // 👈 Muy importante: este archivo pasa a ser SOLO de cliente

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Comprobaciones para tener mensajes claros si falta algo
if (!supabaseUrl) {
  throw new Error('Falta NEXT_PUBLIC_SUPABASE_URL. Revisa tu archivo .env.local');
}

if (!supabaseKey) {
  throw new Error('Falta NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa tu archivo .env.local');
}

// Cliente de Supabase para usar en el NAVEGADOR (login, registro, etc.)
export const supabase = createClient(supabaseUrl, supabaseKey);