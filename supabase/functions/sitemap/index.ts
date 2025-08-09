import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const baseUrl = req.headers.get('origin') || 'https://fineleshydmsyjcvffye.supabase.co'
    
    // Fetch all published content
    const [blogPosts, projects, docs] = await Promise.all([
      supabaseClient
        .from('blog_posts')
        .select('slug, title_pt, title_en, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false }),
      
      supabaseClient
        .from('projects')
        .select('slug, name_pt, name_en, updated_at')
        .order('updated_at', { ascending: false }),
      
      supabaseClient
        .from('docs')
        .select('slug, title_pt, title_en, updated_at')
        .eq('published', true)
        .order('updated_at', { ascending: false }),
    ])

    const currentDate = new Date().toISOString()

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`

    // Add blog posts
    if (blogPosts.data) {
      for (const post of blogPosts.data) {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
      }
    }

    // Add projects
    if (projects.data) {
      for (const project of projects.data) {
        sitemap += `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${project.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      }
    }

    // Add docs
    if (docs.data) {
      for (const doc of docs.data) {
        sitemap += `
  <url>
    <loc>${baseUrl}/docs/${doc.slug}</loc>
    <lastmod>${doc.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      }
    }

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})