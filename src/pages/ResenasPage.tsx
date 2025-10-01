import React, { useState, useMemo } from 'react';
import {
  Star,
  MessageCircle,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  User,
  Send,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useBusiness } from '../hooks/useBusiness';
import { useGoogleReviews } from '../hooks/useGoogleReviews';

const ResenasPage: React.FC = () => {
  const { branches } = useBusiness();
  const {
    reviews,
    loading,
    error,
    syncReviews,
    replyToReview,
    deleteReply,
    syncing,
    statistics
  } = useGoogleReviews();

  const [filters, setFilters] = useState({
    minStars: 1,
    branches: [] as string[],
    hasReply: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const uniqueBranches = useMemo(() => {
    const locationNames = [...new Set(reviews.map(r => r.location_name))];
    return locationNames;
  }, [reviews]);

  const updateFilters = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleBranch = (branch: string) => {
    setFilters(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStars = review.rating >= filters.minStars;

    const matchesBranches = filters.branches.length === 0 ||
      filters.branches.includes(review.location_name);

    const matchesReply =
      filters.hasReply === 'all' ||
      (filters.hasReply === 'with-reply' && review.review_reply) ||
      (filters.hasReply === 'no-reply' && !review.review_reply);

    const matchesSearch = searchQuery.trim() === '' ||
      review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      review.location_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStars && matchesBranches && matchesReply && matchesSearch;
  });

  const handleSync = async () => {
    await syncReviews();
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    await replyToReview(reviewId, replyText);
    setReplyingToId(null);
    setReplyText('');
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta respuesta? Esta acción también la eliminará de Google.')) {
      return;
    }

    await deleteReply(reviewId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Reseñas de Google
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Gestiona y responde a las reseñas de Google My Business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#075E54' + '20' }}
            >
              <MessageCircle size={20} style={{ color: '#075E54' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.totalReviews}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Total de Reseñas
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#f59e0b' + '20' }}
            >
              <Star size={20} style={{ color: '#f59e0b' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.averageRating}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Rating Promedio
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#10b981' + '20' }}
            >
              <CheckCircle size={20} style={{ color: '#10b981' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.repliedCount}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Respuestas Enviadas
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#3b82f6' + '20' }}
            >
              <TrendingUp size={20} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.pendingReplies}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Pendientes de Responder
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 min-w-[200px]"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              >
                <Filter size={16} />
                <span>Filtros</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterOpen && (
                <div
                  className="absolute top-full left-0 mt-1 rounded-lg border shadow-lg bg-white z-10 overflow-hidden min-w-[400px]"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                        Estrellas Mínimas
                      </h4>
                      <div className="flex items-center space-x-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={filters.minStars}
                          onChange={(e) => updateFilters('minStars', parseInt(e.target.value))}
                          className="flex-1"
                          style={{ accentColor: '#075E54' }}
                        />
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={`${
                                star <= filters.minStars
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm ml-2 font-medium" style={{ color: '#161616' }}>
                            {filters.minStars}+
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                        Ubicaciones
                      </h4>
                      <div className="space-y-2">
                        {uniqueBranches.map((branch) => (
                          <label key={branch} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.branches.includes(branch)}
                              onChange={() => toggleBranch(branch)}
                              className="text-sm"
                              style={{ accentColor: '#075E54' }}
                            />
                            <span className="text-sm flex-1" style={{ color: '#161616' }}>
                              {branch}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                        Estado de Respuesta
                      </h4>
                      <div className="space-y-2">
                        {[
                          { id: 'all', label: 'Todas' },
                          { id: 'with-reply', label: 'Con respuesta' },
                          { id: 'no-reply', label: 'Sin respuesta' }
                        ].map(option => (
                          <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="hasReply"
                              value={option.id}
                              checked={filters.hasReply === option.id}
                              onChange={(e) => updateFilters('hasReply', e.target.value)}
                              className="text-sm"
                              style={{ accentColor: '#075E54' }}
                            />
                            <span className="text-sm flex-1" style={{ color: '#161616' }}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setFilters({
                            minStars: 1,
                            branches: [],
                            hasReply: 'all'
                          });
                        }}
                        className="text-xs font-medium transition-colors duration-200"
                        style={{ color: 'rgb(107, 114, 128)' }}
                      >
                        Limpiar filtros
                      </button>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: '#075E54',
                          color: 'white'
                        }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'rgb(107, 114, 128)' }}
              />
              <input
                type="text"
                placeholder="Buscar por cliente, comentario o ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: '#075E54',
              color: 'white'
            }}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Sincronizando ubicaciones y reseñas...' : 'Sincronizar Reseñas'}</span>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Mostrando {filteredReviews.length} de {reviews.length} reseñas
          </p>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              <div className="flex items-start space-x-4">
                {review.reviewer_profile_photo_url ? (
                  <img
                    src={review.reviewer_profile_photo_url}
                    alt={review.reviewer_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#075E54' + '20' }}
                  >
                    <User size={20} style={{ color: '#075E54' }} />
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#161616' }}>
                        {review.reviewer_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={`${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          {new Date(review.review_created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgb(243, 244, 246)',
                        color: 'rgb(107, 114, 128)'
                      }}
                    >
                      {review.location_name}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {review.comment}
                    </p>
                  )}

                  {review.review_reply && (
                    <div
                      className="pl-4 border-l-2 space-y-2"
                      style={{ borderColor: '#075E54' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-medium" style={{ color: '#075E54' }}>
                            Respuesta del negocio
                          </p>
                          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                            {review.review_reply}
                          </p>
                          {review.review_reply_updated_at && (
                            <p className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                              {new Date(review.review_reply_updated_at).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteReply(review.id)}
                          className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200"
                          style={{
                            backgroundColor: 'rgb(254, 242, 242)',
                            color: 'rgb(185, 28, 28)'
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {replyingToId === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="w-full p-3 border rounded-lg text-sm resize-none"
                        style={{
                          borderColor: 'rgb(209, 213, 219)',
                          minHeight: '100px'
                        }}
                        rows={3}
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim()}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                          style={{
                            backgroundColor: '#075E54',
                            color: 'white'
                          }}
                        >
                          <Send size={14} />
                          <span>Enviar Respuesta</span>
                        </button>
                        <button
                          onClick={() => {
                            setReplyingToId(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: 'rgb(243, 244, 246)',
                            color: 'rgb(107, 114, 128)'
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {!review.review_reply && (
                        <button
                          onClick={() => setReplyingToId(review.id)}
                          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                          style={{
                            backgroundColor: '#075E54',
                            color: 'white'
                          }}
                        >
                          <MessageCircle size={14} />
                          <span>Responder</span>
                        </button>
                      )}
                      <a
                        href={`https://search.google.com/local/reviews?placeid=${review.google_location_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: 'rgb(243, 244, 246)',
                          color: 'rgb(107, 114, 128)'
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Ver en Google</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && reviews.length > 0 && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              No se encontraron reseñas
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Ajusta los filtros o la búsqueda para ver más resultados.
            </p>
          </div>
        )}

        {reviews.length === 0 && !syncing && !error && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              No hay reseñas sincronizadas
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
              Conecta tu cuenta de Google My Business en "Mi Negocio" y luego haz clic en "Sincronizar Reseñas" arriba.
            </p>
          </div>
        )}

        {reviews.length === 0 && syncing && (
          <div className="text-center py-12">
            <RefreshCw size={48} className="mx-auto mb-4 animate-spin" style={{ color: '#075E54' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              Sincronizando tus reseñas...
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Estamos cargando tus ubicaciones y reseñas desde Google My Business.
            </p>
          </div>
        )}

        {reviews.length === 0 && error && !syncing && (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'rgb(239, 68, 68)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              {error.includes('No Google OAuth token found') ? 'Conecta tu cuenta primero' : 'Error al sincronizar'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
              {error.includes('No Google OAuth token found')
                ? 'Necesitas conectar tu cuenta de Google My Business antes de sincronizar reseñas.'
                : error}
            </p>
            <button
              onClick={() => window.location.href = '/app/mi-negocio'}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: '#075E54',
                color: 'white'
              }}
            >
              <span>Ir a Mi Negocio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResenasPage;
