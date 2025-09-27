import React, { useState } from 'react';
import { 
  Star, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Search,
  ExternalLink,
  Mail,
  Phone,
  ChevronDown,
  User
} from 'lucide-react';

const ResenasPage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: 'all', // all, public, private
    minStars: 1,
    branches: [] as string[],
    contact: 'all' // all, with-phone, with-email, no-contact
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data para reseñas
  const resenas = [
    {
      id: 1,
      customer: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+54 9 11 1234-5678',
      stars: 5,
      comment: '¡Excelente comida y servicio! La pizza napolitana estaba perfecta, la masa crujiente y los ingredientes frescos. Definitivamente volveremos pronto.',
      date: '2024-01-20',
      time: '19:30',
      branch: 'Sucursal Centro',
      type: 'public', // enviado a Google
      status: 'sent_to_google'
    },
    {
      id: 2,
      customer: 'Carlos Martínez',
      email: 'carlos.martinez@email.com',
      phone: '',
      stars: 4,
      comment: 'Muy buena experiencia en general. La comida deliciosa, solo la espera fue un poco larga pero valió la pena.',
      date: '2024-01-20',
      time: '18:45',
      branch: 'Sucursal Palermo',
      type: 'public',
      status: 'sent_to_google'
    },
    {
      id: 3,
      customer: 'Ana López',
      email: '',
      phone: '+54 9 11 9876-5432',
      stars: 2,
      comment: 'El servicio fue muy lento y la comida llegó fría. Además, el ambiente era muy ruidoso. Esperaba mucho más por el precio.',
      date: '2024-01-19',
      time: '20:15',
      branch: 'Sucursal Centro',
      type: 'private', // retenido internamente
      status: 'retained_internally'
    },
    {
      id: 4,
      customer: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '+54 9 11 5555-4444',
      stars: 5,
      comment: 'Ambiente perfecto para una cena romántica. La atención fue excelente y los platos increíbles. ¡Muy recomendable!',
      date: '2024-01-19',
      time: '21:00',
      branch: 'Sucursal Palermo',
      type: 'public',
      status: 'sent_to_google'
    },
    {
      id: 5,
      customer: 'Laura Fernández',
      email: 'laura.fernandez@email.com',
      phone: '',
      stars: 3,
      comment: 'La pizza estaba bien pero nada extraordinario. El precio me pareció un poco elevado para lo que ofrecen.',
      date: '2024-01-18',
      time: '19:20',
      branch: 'Sucursal Centro',
      type: 'private',
      status: 'retained_internally'
    },
    {
      id: 6,
      customer: 'Diego Morales',
      email: '',
      phone: '+54 9 11 7777-8888',
      stars: 1,
      comment: 'Pésima experiencia. La comida llegó después de 1 hora de espera y estaba fría. El personal poco amable. No volvería.',
      date: '2024-01-18',
      time: '20:45',
      branch: 'Sucursal Palermo',
      type: 'private',
      status: 'retained_internally'
    }
  ];

  // Obtener sucursales únicas
  const uniqueBranches = [...new Set(resenas.map(r => r.branch))];

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

  // Estadísticas del resumen
  const totalResenas = resenas.length;
  const publicResenas = resenas.filter(r => r.type === 'public').length;
  const privateResenas = resenas.filter(r => r.type === 'private').length;
  const averageRating = (resenas.reduce((sum, r) => sum + r.stars, 0) / resenas.length).toFixed(1);
  const conversionRate = ((publicResenas / totalResenas) * 100).toFixed(1);

  const filteredResenas = resenas.filter(resena => {
    // Filtro por estado
    const matchesStatus = 
      filters.status === 'all' ||
      (filters.status === 'public' && resena.type === 'public') ||
      (filters.status === 'private' && resena.type === 'private');

    // Filtro por estrellas mínimas
    const matchesStars = resena.stars >= filters.minStars;

    // Filtro por sucursales
    const matchesBranches = filters.branches.length === 0 || filters.branches.includes(resena.branch);

    // Filtro por contacto
    const matchesContact = 
      filters.contact === 'all' ||
      (filters.contact === 'with-phone' && resena.phone) ||
      (filters.contact === 'with-email' && resena.email) ||
      (filters.contact === 'no-contact' && !resena.phone && !resena.email);

    // Filtro por búsqueda de texto
    const matchesSearch = searchQuery.trim() === '' ||
      resena.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resena.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resena.branch.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesStars && matchesBranches && matchesContact && matchesSearch;
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

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Reseñas y Feedback
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Gestiona las reseñas y comentarios de tus clientes
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
              {totalResenas}
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
              {averageRating}
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
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {publicResenas}
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
              style={{ backgroundColor: '#ef4444' + '20' }}
            >
              <TrendingDown size={20} style={{ color: '#ef4444' }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: '#161616' }}>
              {conversionRate}%
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Tasa de Conversión
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
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
                        { id: 'all', label: 'Todas las reseñas', count: resenas.length },
                        { id: 'public', label: 'Enviadas a Google', count: resenas.filter(r => r.type === 'public').length },
                        { id: 'private', label: 'Retenidas internamente', count: resenas.filter(r => r.type === 'private').length }
                      ].map(option => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="status"
                            value={option.id}
                            checked={filters.status === option.id}
                            onChange={(e) => updateFilters('status', e.target.value)}
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

                  {/* Separador */}
                  <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

                  {/* Sucursales */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                      Sucursales
                    </h4>
                    <div className="space-y-2">
                      {uniqueBranches.map(branch => (
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
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgb(243, 244, 246)',
                              color: 'rgb(107, 114, 128)'
                            }}
                          >
                            {resenas.filter(r => r.branch === branch).length}
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
                        { id: 'all', label: 'Todos los clientes', count: resenas.length },
                        { id: 'with-phone', label: 'Con teléfono', count: resenas.filter(r => r.phone).length },
                        { id: 'with-email', label: 'Con email', count: resenas.filter(r => r.email).length },
                        { id: 'no-contact', label: 'Sin contacto', count: resenas.filter(r => !r.phone && !r.email).length }
                      ].map(option => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="contact"
                            value={option.id}
                            checked={filters.contact === option.id}
                            onChange={(e) => updateFilters('contact', e.target.value)}
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

                  {/* Botones de Acción */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setFilters({
                          status: 'all',
                          minStars: 1,
                          branches: [],
                          contact: 'all'
                        });
                      }}
                      className="text-xs font-medium transition-colors duration-200"
                      style={{ color: 'rgb(107, 114, 128)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
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
          {(filters.status !== 'all' || filters.minStars > 1 || filters.branches.length > 0 || filters.contact !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {filters.status !== 'all' && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#075E54' + '20',
                    color: '#075E54'
                  }}
                >
                  {filters.status === 'public' ? 'Enviadas a Google' : 'Retenidas'}
                </span>
              )}
              {filters.minStars > 1 && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#f59e0b' + '20',
                    color: '#f59e0b'
                  }}
                >
                  {filters.minStars}+ estrellas
                </span>
              )}
              {filters.branches.length > 0 && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#3b82f6' + '20',
                    color: '#3b82f6'
                  }}
                >
                  {filters.branches.length} sucursal{filters.branches.length > 1 ? 'es' : ''}
                </span>
              )}
              {filters.contact !== 'all' && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#10b981' + '20',
                    color: '#10b981'
                  }}
                >
                  {filters.contact === 'with-phone' ? 'Con teléfono' : 
                   filters.contact === 'with-email' ? 'Con email' : 'Sin contacto'}
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

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Mostrando {filteredResenas.length} de {resenas.length} reseñas
            {(filters.status !== 'all' || filters.minStars > 1 || filters.branches.length > 0 || filters.contact !== 'all' || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setFilters({
                    status: 'all',
                    minStars: 1,
                    branches: [],
                    contact: 'all'
                  });
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
              {filteredResenas.map((resena) => (
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
                      <span>{new Date(resena.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resena.type === 'public'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {resena.type === 'public' ? 'Enviado a Google' : 'Retenido'}
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

        {/* Empty State */}
        {filteredResenas.length === 0 && (
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
      </div>
    </div>
  );
};

export default ResenasPage;