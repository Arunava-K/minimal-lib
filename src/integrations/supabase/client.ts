// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hcgmianxhnvgjbbsxjcm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ21pYW54aG52Z2piYnN4amNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTQ3MTksImV4cCI6MjA2Mjg3MDcxOX0.wEQh6yhq2toXMXZ2yuXyMMzumqUYKlNvCpvpBH3PIfc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);