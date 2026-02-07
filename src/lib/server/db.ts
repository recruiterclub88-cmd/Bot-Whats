import { createClient } from '@supabase/supabase-js';

// Ми виносимо отримання перемінних у функцію, щоб вони завжди були актуальними
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing at runtime!');
    // Замість плейсхолдера, який ламає fetch, краще повернути null і обробити це в API
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

// Для зворотної сумісності створюємо клієнт відразу, але він може бути null
export const supabaseAdmin = getSupabaseAdmin() as any;
