import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Metrics tracking will be disabled.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our metrics data
export interface MetricsEvent {
  id?: string;
  created_at?: string;
  event_type: 'visit' | 'click';
  url: string;
  pathname: string;
  user_agent?: string;
  referrer?: string;
  event_data?: Record<string, any>;
}
