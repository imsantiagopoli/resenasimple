import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  slug: string;
  updated_at: string;
}

const SitemapPage = () => {
  useEffect(() => {
    const generateAndServeSitemap = async () => {
      const baseUrl = 'https://resenasimple.com';

      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/politicas-de-privacidad', priority: '0.5', changefreq: 'monthly' },
        { url: '/terminos-y-condiciones', priority: '0.5', changefreq: 'monthly' },
      ];

      const { data: articles } = await supabase
        .from('blog_articles')
        .select('slug, updated_at')
        .eq('published', true)
        .order('updated_at', { ascending: false });

      const articlePages = (articles || []).map((article: Article) => ({
        url: `/blog/${article.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date(article.updated_at).toISOString().split('T')[0]
      }));

      const allPages = [...staticPages, ...articlePages];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      document.open();
      document.write(sitemapXml);
      document.close();
      document.contentType = 'application/xml';
    };

    generateAndServeSitemap();
  }, []);

  return null;
};

export default SitemapPage;
