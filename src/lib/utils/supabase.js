// src/lib/utils/supabase.js
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// Initialize Supabase client
export const supabase = createClient(
  PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

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
