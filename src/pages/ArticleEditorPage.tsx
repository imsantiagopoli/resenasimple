import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Trash2, Image, ExternalLink,
  FileText, Tag, Clock, TrendingUp, Globe, Share2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import RichTextEditor from '../components/RichTextEditor';

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  focus_keyword: string;
  reading_time: number;
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
    published: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    focus_keyword: '',
    reading_time: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (slug && user) {
      loadArticle();
    }
  }, [slug, user]);

  useEffect(() => {
    calculateReadingTime();
  }, [formData.content]);

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
        published: data.published,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        og_title: data.og_title || '',
        og_description: data.og_description || '',
        og_image_url: data.og_image_url || '',
        canonical_url: data.canonical_url || '',
        focus_keyword: data.focus_keyword || '',
        reading_time: data.reading_time || 0
      });
    } catch (err) {
      console.error('Error loading article:', err);
      alert('Error al cargar el artículo');
      navigate('/article');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = () => {
    const text = formData.content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / 200);
    setFormData(prev => ({ ...prev, reading_time: minutes }));
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
        published_at: publish ? new Date().toISOString() : null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords || null,
        og_title: formData.og_title || null,
        og_description: formData.og_description || null,
        og_image_url: formData.og_image_url || null,
        canonical_url: formData.canonical_url || null,
        focus_keyword: formData.focus_keyword || null,
        reading_time: formData.reading_time
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        featured_image_url: publicUrl,
        og_image_url: prev.og_image_url || publicUrl
      }));

      alert('Imagen subida exitosamente');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const autoFillSEO = () => {
    setFormData(prev => ({
      ...prev,
      meta_title: prev.meta_title || prev.title,
      meta_description: prev.meta_description || prev.excerpt,
      og_title: prev.og_title || prev.title,
      og_description: prev.og_description || prev.excerpt,
      og_image_url: prev.og_image_url || prev.featured_image_url
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#075E54]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/article')}
                className="inline-flex items-center text-gray-600 hover:text-[#075E54] transition-colors duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-[#161616]">Editor de Artículo</h1>
            </div>

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
                Guardar
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-[#075E54] text-white rounded-lg hover:bg-[#064740] transition-colors duration-200 disabled:opacity-50 font-medium"
              >
                {saving ? 'Guardando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'content'
                        ? 'border-[#075E54] text-[#075E54]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FileText size={18} className="inline mr-2" />
                    Contenido
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'seo'
                        ? 'border-[#075E54] text-[#075E54]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp size={18} className="inline mr-2" />
                    SEO
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'preview'
                        ? 'border-[#075E54] text-[#075E54]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Eye size={18} className="inline mr-2" />
                    Vista Previa
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Título del Artículo *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Escribe un título atractivo y descriptivo..."
                        className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Slug (URL) *
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2 text-sm">/blog/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="url-del-articulo"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Solo letras minúsculas, números y guiones. SEO amigable.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Imagen Destacada
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.featured_image_url}
                          onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                          placeholder="https://ejemplo.com/imagen.jpg o sube una imagen"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Subir imagen"
                        >
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#075E54]"></div>
                          ) : (
                            <Image size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Sube una imagen (máx 5MB) o pega una URL. Formato: JPG, PNG, GIF, WebP
                      </p>
                      {formData.featured_image_url && (
                        <div className="mt-3">
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
                            <img
                              src={formData.featured_image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.featured_image_alt}
                            onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                            placeholder="Texto alternativo de la imagen (Alt text para SEO)"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Describe la imagen para SEO y accesibilidad. Ej: "Persona trabajando en computadora portátil"
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Extracto / Resumen *
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Escribe un resumen atractivo que capture la atención del lector..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent resize-none"
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          Este texto aparecerá en las tarjetas de artículos y en las meta descripciones
                        </p>
                        <p className={`text-xs ${formData.excerpt.length > 160 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {formData.excerpt.length} caracteres {formData.excerpt.length > 160 && '(Ideal: 120-160)'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contenido del Artículo *
                      </label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          Usa el editor para dar formato a tu contenido
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formData.reading_time} min de lectura
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-semibold text-[#161616] flex items-center">
                          <TrendingUp size={20} className="mr-2" />
                          Optimización SEO
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Mejora el posicionamiento de tu artículo en buscadores
                        </p>
                      </div>
                      <button
                        onClick={autoFillSEO}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Auto-llenar desde contenido
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <AlertCircle size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-1">
                            Consejos SEO
                          </h4>
                          <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Meta título: 50-60 caracteres para mejor visualización en Google</li>
                            <li>• Meta descripción: 120-160 caracteres para evitar truncamiento</li>
                            <li>• Usa tu palabra clave principal en título y primeros párrafos</li>
                            <li>• Las imágenes Open Graph mejoran el CTR en redes sociales</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Tag size={16} className="mr-2" />
                        Palabra Clave Principal
                      </label>
                      <input
                        type="text"
                        value={formData.focus_keyword}
                        onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                        placeholder="ej: marketing digital, recetas veganas, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        La palabra clave principal por la que quieres posicionar este artículo
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Meta Título
                        </label>
                        <input
                          type="text"
                          value={formData.meta_title}
                          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                          placeholder="Título optimizado para SEO"
                          maxLength={60}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                        />
                        <p className={`text-xs mt-1 ${formData.meta_title.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                          {formData.meta_title.length}/60 caracteres
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Keywords (separadas por comas)
                        </label>
                        <input
                          type="text"
                          value={formData.meta_keywords}
                          onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                          placeholder="palabra1, palabra2, palabra3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          5-10 palabras clave relacionadas
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meta Descripción
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        placeholder="Descripción atractiva que aparecerá en los resultados de búsqueda..."
                        rows={3}
                        maxLength={160}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent resize-none"
                      />
                      <p className={`text-xs mt-1 ${formData.meta_description.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                        {formData.meta_description.length}/160 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Globe size={16} className="mr-2" />
                        URL Canónica (Opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.canonical_url}
                        onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                        placeholder="https://tudominio.com/blog/articulo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Útil si este contenido existe en otra URL para evitar contenido duplicado
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-[#161616] mb-4 flex items-center">
                        <Share2 size={18} className="mr-2" />
                        Open Graph (Redes Sociales)
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Cómo se verá tu artículo cuando se comparta en Facebook, Twitter, LinkedIn, etc.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            OG: Título
                          </label>
                          <input
                            type="text"
                            value={formData.og_title}
                            onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                            placeholder="Título para redes sociales"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            OG: Descripción
                          </label>
                          <textarea
                            value={formData.og_description}
                            onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                            placeholder="Descripción atractiva para redes sociales..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            OG: Imagen
                          </label>
                          <input
                            type="url"
                            value={formData.og_image_url}
                            onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                            placeholder="https://ejemplo.com/imagen-og.jpg"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Tamaño recomendado: 1200x630px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Vista Previa en Buscador
                      </h3>
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="text-xs text-gray-500 mb-1">
                          {window.location.origin}/blog/{formData.slug}
                        </div>
                        <div className="text-xl text-blue-600 font-medium mb-1">
                          {formData.meta_title || formData.title || 'Título del artículo'}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {formData.meta_description || formData.excerpt || 'Descripción del artículo...'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Vista Previa en Redes Sociales
                      </h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-w-lg">
                        {(formData.og_image_url || formData.featured_image_url) && (
                          <div className="aspect-video w-full bg-gray-100">
                            <img
                              src={formData.og_image_url || formData.featured_image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="text-xs text-gray-500 uppercase mb-1">
                            {window.location.hostname}
                          </div>
                          <div className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {formData.og_title || formData.title || 'Título del artículo'}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {formData.og_description || formData.excerpt || 'Descripción del artículo...'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Vista Previa del Artículo
                      </h3>
                      <div className="border border-gray-200 rounded-lg p-8 bg-white">
                        {formData.featured_image_url && (
                          <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
                            <img
                              src={formData.featured_image_url}
                              alt={formData.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h1 className="text-4xl font-bold text-[#161616] mb-4">
                          {formData.title || 'Título del artículo'}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                          {formData.excerpt || 'Extracto del artículo...'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                          <Clock size={16} className="mr-1" />
                          {formData.reading_time} minutos de lectura
                        </div>
                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || '<p>Contenido del artículo...</p>' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-[#161616] mb-4">Estado del Artículo</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    formData.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formData.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo de lectura</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.reading_time} min
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Checklist SEO</h4>
                  <div className="space-y-2">
                    <CheckItem checked={!!formData.title} label="Título del artículo" />
                    <CheckItem checked={!!formData.excerpt} label="Extracto/resumen" />
                    <CheckItem checked={!!formData.content && formData.content.length > 300} label="Contenido sustancial" />
                    <CheckItem checked={!!formData.meta_title} label="Meta título" />
                    <CheckItem checked={!!formData.meta_description} label="Meta descripción" />
                    <CheckItem checked={!!formData.focus_keyword} label="Palabra clave" />
                    <CheckItem checked={!!formData.featured_image_url} label="Imagen destacada" />
                    <CheckItem checked={!!formData.og_title && !!formData.og_description} label="Open Graph completo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
  <div className="flex items-center">
    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
      checked ? 'bg-green-500' : 'bg-gray-300'
    }`}>
      {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </div>
    <span className={`text-xs ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

export default ArticleEditorPage;
