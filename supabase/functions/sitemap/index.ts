import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Article {
  slug: string;
  updated_at: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const baseUrl = 'https://resenasimple.com';

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/demo', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/politicas-de-privacidad', priority: '0.5', changefreq: 'monthly' },
      { url: '/terminos-y-condiciones', priority: '0.5', changefreq: 'monthly' },
    ];

    const { data: articles } = await supabaseClient
      .from('blog_articles')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    const articlePages = (articles || []).map((article: Article) => ({
      url: `/blog/${article.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date(article.updated_at).toISOString().split('T')[0],
    }));

    const allPages = [...staticPages, ...articlePages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(sitemapXml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});