import { createClient } from '@supabase/supabase-js'

let supabase: any = null

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjcyMDAwMDAsImV4cCI6MTk0Mjc3NjAwMH0.placeholder'
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  // Handle build-time errors gracefully
  supabase = null
}

export { supabase }