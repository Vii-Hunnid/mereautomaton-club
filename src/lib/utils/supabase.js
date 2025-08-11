// src/lib/utils/supabase.js
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

// Poem related functions
export async function getAllPoems() {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching poems:', error)
    return []
  }
  
  return data
}

export async function getPoemBySubdomain(subdomain) {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('is_public', true)
    .single()
  
  if (error) {
    console.error('Error fetching poem:', error)
    return null
  }
  
  return data
}

export async function createPoem(poemData) {
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
}

export async function createSubdomain(subdomainData) {
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
}

export async function checkSubdomainExists(subdomain) {
  const { data, error } = await supabase
    .from('subdomains')
    .select('subdomain')
    .eq('subdomain', subdomain)
    .single()
  
  return !error && data
}

export async function incrementViews(poemId) {
  const { error } = await supabase
    .rpc('increment_views', { poem_id: poemId })
  
  if (error) {
    console.error('Error incrementing views:', error)
  }
}
