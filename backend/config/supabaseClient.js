import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://oiggljhfyqkzhvpnhayb.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_H2JKYwAjW-Ot71gzQt4m7g_M7oExb4b';

export const supabase = createClient(supabaseUrl, supabaseKey);
