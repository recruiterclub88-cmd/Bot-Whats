import { createClient } from '@supabase/supabase-js';

// Функція для отримання Supabase клієнта з детальним логуванням
export function getSupabaseAdmin() {
  // Отримуємо змінні з process.env
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Детальне логування для діагностики
  console.log('[Supabase Init] Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPrefix: supabaseUrl?.substring(0, 20),
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
  });

  if (!supabaseUrl || !supabaseKey) {
    const error = `Missing Supabase credentials: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`;
    console.error('❌ [Supabase Init]', error);
    throw new Error(error);
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

// Ліниве ініціалізація - створюємо клієнт тільки при першому використанні
let _supabaseAdmin: any = null;

export const supabaseAdmin: any = new Proxy({}, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = getSupabaseAdmin();
    }
    return (_supabaseAdmin as any)[prop];
  }
});
