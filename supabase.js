import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name for PDFs
export const PDF_BUCKET = 'pdfs'

// Helper function to get public URL for a file
export const getPublicUrl = (filePath) => {
  const { data } = supabase.storage.from(PDF_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
