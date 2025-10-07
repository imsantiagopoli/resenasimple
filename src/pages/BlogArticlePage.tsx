import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setArticle(data);
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#075E54]"></div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-[#161616] mb-4">
            Artículo no encontrado
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-6 py-3 bg-[#075E54] text-white rounded-lg hover:bg-[#064740] transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-gray-600 hover:text-[#075E54] mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al blog
        </button>

        {article.featured_image_url && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-5xl font-bold text-[#161616] mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar size={20} className="mr-2" />
              <span className="text-lg">
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Share2 size={18} className="mr-2" />
              Compartir
            </button>
          </div>

          <p className="text-xl text-gray-600 mt-6 leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        <div className="border-t border-gray-200 pt-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#161616] prose-a:text-[#075E54] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#161616] prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-[#075E54] hover:text-[#064740] font-medium transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Ver más artículos
          </button>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
