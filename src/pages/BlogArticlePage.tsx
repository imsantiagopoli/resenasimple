import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

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
  meta_title?: string;
  meta_description?: string;
}

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const articleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasShownPopup || !articleContentRef.current) return;

      const scrollPosition = window.scrollY;
      const contentTop = articleContentRef.current.offsetTop;
      const contentHeight = articleContentRef.current.offsetHeight;
      const scrollThreshold = contentTop + contentHeight * 0.35;

      if (scrollPosition >= scrollThreshold) {
        setShowPromoPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownPopup]);

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
        loadRelatedArticles(data.id);
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (currentArticleId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .neq('id', currentArticleId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data) {
        setRelatedArticles(data);
      }
    } catch (err) {
      console.error('Error loading related articles:', err);
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
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt}
        image={article.featured_image_url || undefined}
        url={`https://resenasimple.com/blog/${article.slug}`}
        type="article"
      />
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

          <div className="flex items-center mt-6 pt-6 border-t border-gray-200">
            <User size={20} className="text-gray-600 mr-2" />
            <span className="text-gray-600">Por </span>
            <a
              href="https://www.linkedin.com/in/geronimoherscovich/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-[#075E54] hover:text-[#064740] font-medium transition-colors duration-200"
            >
              Gerónimo Herscovich
            </a>
          </div>
        </header>

        <div className="border-t border-gray-200 pt-8" ref={articleContentRef}>
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#161616] prose-a:text-[#075E54] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#161616] prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 mt-12 pt-12">
            <h2 className="text-3xl font-bold text-[#161616] mb-8">
              Artículos relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  onClick={() => navigate(`/blog/${relatedArticle.slug}`)}
                  className="cursor-pointer group"
                >
                  {relatedArticle.featured_image_url && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={relatedArticle.featured_image_url}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#161616] mb-2 group-hover:text-[#075E54] transition-colors duration-200">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {showPromoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowPromoPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="mb-6">
                <img
                  src="https://qxylsmbtngtvoinoozsh.supabase.co/storage/v1/object/public/assets/resenasimple.png"
                  alt="Reseña Simple"
                  className="h-12 mx-auto mb-6"
                />
                <h3 className="text-3xl font-bold text-[#161616] mb-4">
                  ¿Te gustó este artículo?
                </h3>
                <p className="text-lg text-gray-600">
                  Descubre cómo Reseña Simple puede ayudarte a conseguir más reseñas para tu negocio
                </p>
              </div>

              <button
                onClick={() => {
                  navigate('/auth?mode=register');
                  setShowPromoPopup(false);
                }}
                className="w-full bg-[#075E54] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#064740] transition-colors duration-200 mb-4"
              >
                Empezar prueba gratuita
              </button>

              <button
                onClick={() => setShowPromoPopup(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continuar leyendo
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
