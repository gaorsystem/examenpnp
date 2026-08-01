import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// No llamamos a createClient si faltan las credenciales para evitar el error fatal
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('Supabase: Credenciales faltantes. La base de datos no estará disponible hasta que configures VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
}
