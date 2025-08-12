// src/lib/utils/supabase.js
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// Use fallback values during build/development
let supabaseUrl = 'https://placeholder.supabase.co'
let supabaseAnonKey = 'placeholder-key'

// Try to import environment variables, but handle gracefully if they don't exist
try {
  if (browser) {
    // In browser, we can safely access these
    supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || supabaseUrl
    supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey
  }
} catch (error) {
  console.warn('Environment variables not available, using placeholders')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// Poem related functions
export async function getAllPoems() {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching poems:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching poems:', error)
    return []
  }
}

export async function getPoemBySubdomain(subdomain) {
  try {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('subdomain', subdomain)
      .single()
    
    if (error) {
      console.error('Error fetching poem:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching poem:', error)
    return null
  }
}

export async function createPoem(poemData) {
  try {
    const { data, error } = await supabase
      .from('poems')
      .insert([poemData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating poem:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error creating poem:', error)
    throw error
  }
}

export async function createSubdomain(subdomainData) {
  try {
    const { data, error } = await supabase
      .from('subdomains')
      .insert([subdomainData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating subdomain:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error creating subdomain:', error)
    throw error
  }
}

export async function checkSubdomainExists(subdomain) {
  try {
    const { data, error } = await supabase
      .from('subdomains')
      .select('subdomain')
      .eq('subdomain', subdomain)
      .single()
    
    return !error && data
  } catch (error) {
    console.error('Error checking subdomain:', error)
    return false
  }
}

export async function incrementViews(poemId) {
  try {
    const { error } = await supabase
      .rpc('increment_views', { poem_id: poemId })
    
    if (error) {
      console.error('Error incrementing views:', error)
    }
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}
