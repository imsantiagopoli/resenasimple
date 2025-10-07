import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit2, Trash2, Eye, Calendar, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (user) {
      loadArticles();
    }
  }, [user]);

  const loadArticles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, published, published_at, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (err) {
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Error al eliminar el artículo');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'published') return article.published;
    if (filter === 'draft') return !article.published;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#161616]">Artículos del Blog</h1>
            <p className="text-gray-600 mt-2">
              Gestiona todos tus artículos de blog
            </p>
          </div>
          <button
            onClick={() => navigate('/article/new')}
            className="flex items-center px-6 py-3 bg-[#075E54] text-white rounded-lg hover:bg-[#064740] transition-colors duration-200"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Artículo
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-[#075E54] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({articles.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'published'
                    ? 'bg-[#075E54] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Publicados ({articles.filter(a => a.published).length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'draft'
                    ? 'bg-[#075E54] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Borradores ({articles.filter(a => !a.published).length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#075E54]"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay artículos
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'published' && 'No tienes artículos publicados todavía'}
                {filter === 'draft' && 'No tienes borradores guardados'}
                {filter === 'all' && 'Comienza creando tu primer artículo'}
              </p>
              <button
                onClick={() => navigate('/article/new')}
                className="inline-flex items-center px-6 py-3 bg-[#075E54] text-white rounded-lg hover:bg-[#064740] transition-colors duration-200"
              >
                <Plus size={20} className="mr-2" />
                Crear Primer Artículo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#161616] truncate">
                          {article.title}
                        </h3>
                        {article.published ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={14} className="mr-1" />
                            Borrador
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          <span>
                            {article.published && article.published_at
                              ? `Publicado el ${formatDate(article.published_at)}`
                              : `Creado el ${formatDate(article.created_at)}`}
                          </span>
                        </div>
                        <span>Slug: /{article.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {article.published && (
                        <button
                          onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                          className="p-2 text-gray-600 hover:text-[#075E54] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="Ver artículo"
                        >
                          <Eye size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/article/${article.slug}`)}
                        className="p-2 text-gray-600 hover:text-[#075E54] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticlesPage;
