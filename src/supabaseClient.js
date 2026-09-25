import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rvquspipagnsavrtjhdl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_sYk8SETbtDTV7C8MiC4H5w_CwtAv0xo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
