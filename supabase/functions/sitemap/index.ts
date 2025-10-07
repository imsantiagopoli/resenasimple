import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = new URL(req.url).origin.replace("/functions/v1/sitemap", "");
    const productionUrl = "https://tu-dominio.com";

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/blog", priority: "0.9", changefreq: "daily" },
      { url: "/politicas-de-privacidad", priority: "0.5", changefreq: "monthly" },
      { url: "/terminos-y-condiciones", priority: "0.5", changefreq: "monthly" },
    ];

    const { data: articles } = await supabase
      .from("blog_articles")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false });

    const articlePages = (articles || []).map((article: any) => ({
      url: `/blog/${article.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: new Date(article.updated_at).toISOString().split("T")[0],
    }));

    const allPages = [...staticPages, ...articlePages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page: any) => `  <url>
    <loc>${productionUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});