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
    
    // Fetch published blog posts with authors
    const { data: blogPosts } = await supabaseClient
      .from('blog_posts')
      .select(`
        slug,
        title_pt,
        title_en,
        content_pt,
        content_en,
        published_at,
        updated_at,
        author:authors(name)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(50)

    if (!blogPosts) {
      throw new Error('Failed to fetch blog posts')
    }

    const currentDate = new Date().toISOString()

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Monynha Softwares Blog</title>
    <description>Leading software development company specializing in cutting-edge web applications, mobile solutions, and futuristic technologies.</description>
    <link>${baseUrl}</link>
    <language>pt-BR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <managingEditor>contact@monynhasoftwares.com (Monynha Softwares)</managingEditor>
    <webMaster>contact@monynhasoftwares.com (Monynha Softwares)</webMaster>
    <category>Software Development</category>
    <category>Web Development</category>
    <category>Technology</category>`

    for (const post of blogPosts) {
      const title = post.title_pt || post.title_en || 'Untitled'
      const content = post.content_pt || post.content_en || ''
      const description = content.substring(0, 300).replace(/<[^>]*>/g, '') + '...'
      const author = post.author?.name || 'Monynha Softwares'
      const pubDate = new Date(post.published_at || post.updated_at).toUTCString()

      rss += `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>contact@monynhasoftwares.com (${author})</author>
      <category>Blog</category>
    </item>`
    }

    rss += `
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})