import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published: boolean;
}

const ArticleEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    published: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    if (slug && user) {
      loadArticle();
    }
  }, [slug, user]);

  const loadArticle = async () => {
    if (!user || !slug) return;

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        alert('Artículo no encontrado');
        navigate('/article');
        return;
      }

      setArticleId(data.id);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image_url: data.featured_image_url || '',
        published: data.published
      });
    } catch (err) {
      console.error('Error loading article:', err);
      alert('Error al cargar el artículo');
      navigate('/article');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!user) return;

    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.slug.trim()) {
      alert('El slug es requerido');
      return;
    }

    if (!formData.excerpt.trim()) {
      alert('El extracto es requerido');
      return;
    }

    if (!formData.content.trim()) {
      alert('El contenido es requerido');
      return;
    }

    setSaving(true);

    try {
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image_url: formData.featured_image_url || null,
        published: publish,
        published_at: publish ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('blog_articles')
        .update(articleData)
        .eq('id', articleId);

      if (error) throw error;

      alert(publish ? 'Artículo publicado exitosamente' : 'Cambios guardados exitosamente');

      if (formData.slug !== slug) {
        navigate(`/article/${formData.slug}`);
      }
    } catch (err: any) {
      console.error('Error saving article:', err);
      if (err.message?.includes('duplicate key')) {
        alert('Ya existe un artículo con ese slug. Por favor usa uno diferente.');
      } else {
        alert('Error al guardar el artículo');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;

    if (!confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      alert('Artículo eliminado exitosamente');
      navigate('/article');
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Error al eliminar el artículo');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#075E54]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/article')}
            className="inline-flex items-center text-gray-600 hover:text-[#075E54] transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a Artículos
          </button>

          <div className="flex items-center space-x-3">
            {formData.published && (
              <button
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Eye size={18} className="mr-2" />
                Ver Publicado
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <Trash2 size={18} className="mr-2" />
              Eliminar
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              Guardar Borrador
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-[#075E54] text-white rounded-lg hover:bg-[#064740] transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Publicar'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-[#161616] mb-8">
            Editar Artículo
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título del artículo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-del-articulo"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada (URL)
              </label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
              />
              {formData.featured_image_url && (
                <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.featured_image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve descripción del artículo que aparecerá en la lista..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.excerpt.length} caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido * (HTML/Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escribe el contenido del artículo aquí... Puedes usar HTML."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent resize-y font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Puedes usar HTML para formatear el contenido
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditorPage;
