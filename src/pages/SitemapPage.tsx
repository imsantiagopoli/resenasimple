import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  slug: string;
  updated_at: string;
}

const SitemapPage = () => {
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      const baseUrl = window.location.origin;

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

      setXml(sitemapXml);
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (xml) {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [xml]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sitemap XML</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {xml ? (
            <>
              <div className="mb-4">
                <p className="text-green-600 font-medium mb-2">✓ Sitemap generado exitosamente</p>
                <p className="text-sm text-gray-600">El archivo sitemap.xml se ha descargado automáticamente.</p>
              </div>
              <div className="bg-gray-50 rounded p-4 overflow-auto max-h-96">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">{xml}</pre>
              </div>
            </>
          ) : (
            <p className="text-gray-600">Generando sitemap...</p>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Instrucciones para Google Search Console</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>El archivo sitemap.xml se ha descargado automáticamente</li>
            <li>Ve a <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google Search Console</a></li>
            <li>Selecciona tu propiedad</li>
            <li>En el menú lateral, ve a "Sitemaps"</li>
            <li>Sube o ingresa la URL de tu sitemap</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
