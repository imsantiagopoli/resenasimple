import React, { useState, useMemo } from 'react';
import {
  Star,
  MessageCircle,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Mail,
  ChevronDown,
  User,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useVotingSessions } from '../hooks/useVotingSessions';
import { useBusiness } from '../hooks/useBusiness';

const RespuestasPage: React.FC = () => {
  const { sessions, loading, error, getStatistics, getTodayStatistics } = useVotingSessions();
  const { branches } = useBusiness();

  // Applied filters (los que realmente se usan para filtrar)
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all', // all, public, private
    minStars: 1,
    branches: [] as string[],
    contact: 'all', // all, with-phone, with-email, no-contact
    dateFrom: '',
    dateTo: ''
  });

  // Temp filters (los que se modifican en el panel antes de aplicar)
  const [tempFilters, setTempFilters] = useState({
    status: 'all',
    minStars: 1,
    branches: [] as string[],
    contact: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<'date-desc' | 'date-asc' | 'rating-negative' | 'rating-positive'>('date-desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  });

  // Transform sessions data for display
  const resenas = useMemo(() => {
    return sessions.map(session => ({
      id: session.id,
      customer: session.customer_name || 'Cliente Anónimo',
      email: session.customer_email || '',
      phone: session.customer_phone || '',
      stars: session.rating,
      comment: session.comment || 'Sin comentarios',
      date: session.created_at.split('T')[0],
      time: new Date(session.created_at).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      branch: session.branch_name || 'Sucursal desconocida',
      type: session.is_public ? 'public' : 'private',
      status: session.status === 'positive_clicked'
        ? 'sent_to_google'
        : session.status === 'positive_viewed'
        ? 'reached_google_page'
        : session.status === 'negative_complete'
        ? 'retained_complete'
        : 'retained_incomplete'
    }));
  }, [sessions]);

  // Obtener sucursales únicas
  const uniqueBranches = branches.map(branch => branch.name);

  const updateTempFilters = (key: keyof typeof tempFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleBranch = (branch: string) => {
    setTempFilters(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: 'all',
      minStars: 1,
      branches: [],
      contact: 'all',
      dateFrom: '',
      dateTo: ''
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Estadísticas del resumen
  const statistics = getStatistics();
  const todayStats = getTodayStatistics();

  const filteredResenas = resenas.filter(resena => {
    // Filtro por estado
    const matchesStatus =
      appliedFilters.status === 'all' ||
      (appliedFilters.status === 'public' && resena.type === 'public') ||
      (appliedFilters.status === 'private' && resena.type === 'private');

    // Filtro por estrellas mínimas
    const matchesStars = resena.stars >= appliedFilters.minStars;

    // Filtro por sucursales
    const matchesBranches = appliedFilters.branches.length === 0 || appliedFilters.branches.includes(resena.branch);

    // Filtro por contacto
    const matchesContact =
      appliedFilters.contact === 'all' ||
      (appliedFilters.contact === 'with-phone' && resena.phone) ||
      (appliedFilters.contact === 'with-email' && resena.email) ||
      (appliedFilters.contact === 'no-contact' && !resena.phone && !resena.email);

    // Filtro por búsqueda de texto
    const matchesSearch = searchQuery.trim() === '' ||
      resena.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resena.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resena.branch.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtro por rango de fechas
    const matchesDateRange = (() => {
      if (!appliedFilters.dateFrom && !appliedFilters.dateTo) return true;
      const resenaDate = new Date(resena.date);
      const fromDate = appliedFilters.dateFrom ? new Date(appliedFilters.dateFrom) : null;
      const toDate = appliedFilters.dateTo ? new Date(appliedFilters.dateTo) : null;

      if (fromDate && resenaDate < fromDate) return false;
      if (toDate && resenaDate > toDate) return false;
      return true;
    })();

    return matchesStatus && matchesStars && matchesBranches && matchesContact && matchesSearch && matchesDateRange;
  });

  const handleWhatsApp = (phone: string, customerName: string) => {
    const message = `Hola ${customerName}, gracias por tu feedback sobre tu experiencia en Pizzería Napolitana. Nos gustaría conversar contigo para mejorar nuestro servicio.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (email: string, customerName: string) => {
    const subject = 'Seguimiento a tu experiencia en Pizzería Napolitana';
    const body = `Hola ${customerName},\n\nGracias por tomarte el tiempo de compartir tu experiencia con nosotros. Tu opinión es muy valiosa y nos ayuda a mejorar.\n\n¿Podrías contarnos un poco más sobre tu visita para poder brindarte un mejor servicio?\n\nSaludos,\nEquipo de Pizzería Napolitana`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Aplicar ordenamiento
  const sortedResenas = useMemo(() => {
    const sorted = [...filteredResenas];
    sorted.sort((a, b) => {
      switch (sortConfig) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-negative':
          return a.stars - b.stars;
        case 'rating-positive':
          return b.stars - a.stars;
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredResenas, sortConfig]);

  // Aplicar paginación
  const paginatedResenas = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return sortedResenas.slice(startIndex, endIndex);
  }, [sortedResenas, pagination]);

  const totalPages = Math.ceil(sortedResenas.length / pagination.itemsPerPage);

  const handleItemsPerPageChange = (value: number) => {
    setPagination({ currentPage: 1, itemsPerPage: value });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Respuestas Internas
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Gestiona las respuestas y comentarios internos de tus clientes
        </p>
      </div>

      {/* Resumen de Estadísticas */}
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
              {statistics.totalSessions}
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
              style={{ backgroundColor: '#3b82f6' + '20' }}
            >
              <Send size={20} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.publicSessions}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Enviadas a Google
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#10b981' + '20' }}
            >
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {statistics.positiveReviewsRate}%
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Tasa de Reseñas Positivas
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Dropdown de Ordenamiento */}
          <div className="relative">
            <select
              value={sortConfig}
              onChange={(e) => setSortConfig(e.target.value as any)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 min-w-[220px] cursor-pointer"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            >
              <option value="date-desc">Fecha (más reciente)</option>
              <option value="date-asc">Fecha (más antigua)</option>
              <option value="rating-positive">Reseña positiva</option>
              <option value="rating-negative">Reseña negativa</option>
            </select>
          </div>

          {/* Filtro */}
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
                  {/* Estado de Reseñas */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Estado
                    </h4>
                    <div className="space-y-2">
                      {[
                        { id: 'all', label: 'Todas las reseñas', count: statistics.totalSessions },
                        { id: 'public', label: 'Enviadas a Google', count: statistics.publicSessions },
                        { id: 'private', label: 'Retenidas internamente', count: statistics.totalSessions - statistics.publicSessions }
                      ].map(option => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="status"
                            value={option.id}
                            checked={tempFilters.status === option.id}
                            onChange={(e) => updateTempFilters('status', e.target.value)}
                            className="text-sm"
                            style={{ accentColor: '#075E54' }}
                          />
                          <span className="text-sm flex-1" style={{ color: '#161616' }}>
                            {option.label}
                          </span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgb(243, 244, 246)',
                              color: 'rgb(107, 114, 128)'
                            }}
                          >
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Estrellas Mínimas */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Estrellas Mínimas
                    </h4>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={tempFilters.minStars}
                        onChange={(e) => updateTempFilters('minStars', parseInt(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: '#075E54' }}
                      />
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`${
                              star <= tempFilters.minStars
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm ml-2 font-medium" style={{ color: '#161616' }}>
                          {tempFilters.minStars}+
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Sucursales */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Sucursales
                    </h4>
                    <div className="space-y-2">
                      {uniqueBranches.map((branch, index) => (
                        <label key={branch} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={tempFilters.branches.includes(branch)}
                            onChange={() => toggleBranch(branch)}
                            className="text-sm"
                            style={{ accentColor: '#075E54' }}
                          />
                          <span className="text-sm flex-1" style={{ color: '#161616' }}>
                            {branch}
                          </span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgb(243, 244, 246)',
                              color: 'rgb(107, 114, 128)'
                            }}
                          >
                            {sessions.filter(s => s.branch_name === branch).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Información de Contacto */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Información de Contacto
                    </h4>
                    <div className="space-y-2">
                      {[
                        { id: 'all', label: 'Todos los clientes', count: statistics.totalSessions },
                        { id: 'with-phone', label: 'Con teléfono', count: sessions.filter(s => s.customer_phone).length },
                        { id: 'with-email', label: 'Con email', count: sessions.filter(s => s.customer_email).length },
                        { id: 'no-contact', label: 'Sin contacto', count: sessions.filter(s => !s.customer_phone && !s.customer_email).length }
                      ].map(option => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="contact"
                            value={option.id}
                            checked={tempFilters.contact === option.id}
                            onChange={(e) => updateTempFilters('contact', e.target.value)}
                            className="text-sm"
                            style={{ accentColor: '#075E54' }}
                          />
                          <span className="text-sm flex-1" style={{ color: '#161616' }}>
                            {option.label}
                          </span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgb(243, 244, 246)',
                              color: 'rgb(107, 114, 128)'
                            }}
                          >
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Rango de Fechas */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Rango de Fechas
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Desde</label>
                        <input
                          type="date"
                          value={tempFilters.dateFrom}
                          onChange={(e) => updateTempFilters('dateFrom', e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-lg border text-sm"
                          style={{
                            borderColor: 'rgb(209, 213, 219)',
                            color: '#161616'
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Hasta</label>
                        <input
                          type="date"
                          value={tempFilters.dateTo}
                          onChange={(e) => updateTempFilters('dateTo', e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-lg border text-sm"
                          style={{
                            borderColor: 'rgb(209, 213, 219)',
                            color: '#161616'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Botones de Acción */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={clearFilters}
                      className="text-xs font-medium transition-colors duration-200"
                      style={{ color: 'rgb(107, 114, 128)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                    >
                      Limpiar filtros
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: '#075E54',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064e45'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#075E54'}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Indicadores de filtros activos */}
          {(appliedFilters.status !== 'all' || appliedFilters.minStars > 1 || appliedFilters.branches.length > 0 || appliedFilters.contact !== 'all' || appliedFilters.dateFrom || appliedFilters.dateTo) && (
            <div className="flex flex-wrap gap-2">
              {appliedFilters.status !== 'all' && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#075E54' + '20',
                    color: '#075E54'
                  }}
                >
                  {appliedFilters.status === 'public' ? 'Enviadas a Google' : 'Retenidas'}
                </span>
              )}
              {appliedFilters.minStars > 1 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#f59e0b' + '20',
                    color: '#f59e0b'
                  }}
                >
                  {appliedFilters.minStars}+ estrellas
                </span>
              )}
              {appliedFilters.branches.length > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#3b82f6' + '20',
                    color: '#3b82f6'
                  }}
                >
                  {appliedFilters.branches.length} sucursal{appliedFilters.branches.length > 1 ? 'es' : ''}
                </span>
              )}
              {appliedFilters.contact !== 'all' && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#10b981' + '20',
                    color: '#10b981'
                  }}
                >
                  {appliedFilters.contact === 'with-phone' ? 'Con teléfono' :
                   appliedFilters.contact === 'with-email' ? 'Con email' : 'Sin contacto'}
                </span>
              )}
              {(appliedFilters.dateFrom || appliedFilters.dateTo) && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#ef4444' + '20',
                    color: '#ef4444'
                  }}
                >
                  {appliedFilters.dateFrom && appliedFilters.dateTo
                    ? `${new Date(appliedFilters.dateFrom).toLocaleDateString('es-ES')} - ${new Date(appliedFilters.dateTo).toLocaleDateString('es-ES')}`
                    : appliedFilters.dateFrom
                    ? `Desde ${new Date(appliedFilters.dateFrom).toLocaleDateString('es-ES')}`
                    : `Hasta ${new Date(appliedFilters.dateTo).toLocaleDateString('es-ES')}`}
                </span>
              )}
            </div>
          )}

          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: 'rgb(107, 114, 128)' }}
            />
            <input
              type="text"
              placeholder="Buscar por cliente, comentario o sucursal..."
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

        {/* Contador de resultados y selector de items por página */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Mostrando {paginatedResenas.length > 0 ? ((pagination.currentPage - 1) * pagination.itemsPerPage + 1) : 0} - {Math.min(pagination.currentPage * pagination.itemsPerPage, sortedResenas.length)} de {sortedResenas.length} reseñas
            {sortedResenas.length !== resenas.length && (
              <span> (filtrado de {resenas.length} total)</span>
            )}
            {(appliedFilters.status !== 'all' || appliedFilters.minStars > 1 || appliedFilters.branches.length > 0 || appliedFilters.contact !== 'all' || appliedFilters.dateFrom || appliedFilters.dateTo || searchQuery.trim()) && sortedResenas.length !== resenas.length && (
              <button
                onClick={() => {
                  clearFilters();
                  setSearchQuery('');
                }}
                className="ml-2 text-xs font-medium underline transition-colors duration-200"
                style={{ color: '#075E54' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
              >
                Limpiar todos los filtros
              </button>
            )}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Por página:</span>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Tabla de Reseñas */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Cliente
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Calificación
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Comentario
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Sucursal
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Fecha
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedResenas.map((resena) => (
                <tr 
                  key={resena.id} 
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                >
                  {/* Cliente */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#075E54' + '20' }}
                      >
                        <User size={14} style={{ color: '#075E54' }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#161616' }}>
                          {resena.customer}
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          {resena.time}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Calificación */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= resena.stars 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-2" style={{ color: '#161616' }}>
                        {resena.stars}
                      </span>
                    </div>
                  </td>

                  {/* Comentario */}
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-sm line-clamp-3" style={{ color: 'rgb(107, 114, 128)' }}>
                      {resena.comment}
                    </p>
                  </td>

                  {/* Sucursal */}
                  <td className="py-4 px-4">
                    <span className="text-sm" style={{ color: '#161616' }}>
                      {resena.branch}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      <Calendar size={14} />
                      <span>{new Date(resena.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resena.status === 'sent_to_google'
                          ? 'bg-green-100 text-green-800'
                          : resena.status === 'reached_google_page'
                          ? 'bg-blue-100 text-blue-800'
                          : resena.status === 'retained_complete'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {resena.status === 'sent_to_google'
                        ? 'Enviado a Google'
                        : resena.status === 'reached_google_page'
                        ? 'Vio página de Google'
                        : resena.status === 'retained_complete'
                        ? 'Retenido (Completo)'
                        : 'Retenido (Incompleto)'
                      }
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {/* WhatsApp Button */}
                      {resena.phone && (
                        <button
                          onClick={() => handleWhatsApp(resena.phone, resena.customer)}
                          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ 
                            backgroundColor: '#25d366',
                            color: 'white'
                          }}
                          title="Contactar por WhatsApp"
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            fill="white" 
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                          </svg>
                        </button>
                      )}

                      {/* Email Button */}
                      {resena.email && (
                        <button
                          onClick={() => handleEmail(resena.email, resena.customer)}
                          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{ 
                            backgroundColor: '#075E54',
                            color: 'white'
                          }}
                          title="Enviar email"
                        >
                          <Mail size={14} />
                        </button>
                      )}

                      {!resena.phone && !resena.email && (
                        <span className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                          Sin contacto
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: pagination.currentPage === 1 ? 'rgb(156, 163, 175)' : '#075E54',
                backgroundColor: 'white'
              }}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const showDots = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showDots && (
                        <span className="text-sm" style={{ color: 'rgb(156, 163, 175)' }}>...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: pagination.currentPage === page ? '#075E54' : 'white',
                          color: pagination.currentPage === page ? 'white' : '#161616',
                          border: pagination.currentPage === page ? 'none' : '1px solid rgb(209, 213, 219)'
                        }}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: pagination.currentPage === totalPages ? 'rgb(156, 163, 175)' : '#075E54',
                backgroundColor: 'white'
              }}
            >
              <span>Siguiente</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Empty State cuando no hay datos filtrados */}
        {sortedResenas.length === 0 && resenas.length > 0 && (
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

        {/* Empty State cuando no hay reseñas en absoluto */}
        {resenas.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              Aún no hay respuestas
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Las reseñas aparecerán aquí cuando los clientes empiecen a votar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RespuestasPage;