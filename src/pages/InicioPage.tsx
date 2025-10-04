import React from 'react';
import {
  TrendingUp,
  Users,
  Star,
  MessageCircle,
  Building2,
  Vote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVotingSessions } from '../hooks/useVotingSessions';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { useSubscription } from '../hooks/useSubscription';
import SubscriptionModal from '../components/SubscriptionModal';

const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useBusiness();
  const { sessions, loading, getStatistics, getTodayStatistics } = useVotingSessions();
  const { canAccessApp, loading: subscriptionLoading } = useSubscription(user?.id, profile?.id);
  
  const statistics = getStatistics();
  const todayStats = getTodayStatistics();

  const stats = [
    {
      title: 'Votaciones Este Mes',
      value: statistics.totalSessions.toString(),
      icon: Users,
      color: '#075E54'
    },
    {
      title: 'Rating Promedio',
      value: statistics.averageRating,
      icon: Star,
      color: '#f59e0b'
    },
    {
      title: 'Reseñas en Google',
      value: statistics.publicSessions.toString(),
      icon: MessageCircle,
      color: '#3b82f6'
    },
    {
      title: 'Tasa de Reseñas Positivas',
      value: `${statistics.positiveReviewsRate}%`,
      icon: TrendingUp,
      color: '#10b981'
    }
  ];

  // Recent activity from real sessions data (last 10)
  const recentActivity = sessions.slice(0, 4).map(session => {
    const timeAgo = Math.floor((Date.now() - new Date(session.created_at).getTime()) / (1000 * 60 * 60));
    return {
      type: session.is_public ? 'positive' : 'negative',
      customer: session.customer_name || 'Cliente Anónimo',
      stars: session.rating,
      comment: session.comment || 'Sin comentarios',
      time: timeAgo < 1 ? 'Hace menos de 1 hora' : `${timeAgo} hora${timeAgo > 1 ? 's' : ''}`,
      status: session.is_public ? 'Enviado a Google' : 'Retenido internamente'
    };
  });
  const quickActions = [
    {
      title: 'Configurar Negocio',
      description: 'Actualizar información y sucursales',
      icon: Building2,
      action: () => navigate('/app/mi-negocio')
    },
    {
      title: 'Ver Reseñas',
      description: 'Gestionar feedback de clientes',
      icon: MessageCircle,
      action: () => navigate('/app/resenas')
    },
    {
      title: 'Modificar Página de Votación',
      description: 'Personalizar diseño y configuración',
      icon: Vote,
      action: () => navigate('/app/pagina-votacion')
    }
  ];

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (!canAccessApp) {
    return <SubscriptionModal user={user} currentBusiness={profile} />;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Dashboard - Reseña Simple
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Resumen de la actividad de votaciones y reseñas de tu restaurante
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: 'rgb(229, 231, 235)' }}
          >
            <div className="mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '20' }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold" style={{ color: '#161616' }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Actividad Reciente
            </h2>
            <button 
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: '#075E54' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
            >
              Ver todas
            </button>
          </div>

          <div className="bg-white rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            {recentActivity.length > 0 ? (
              <div className="divide-y" style={{ color: 'rgb(229, 231, 235)' }}>
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={`${
                                  star <= activity.stars 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm" style={{ color: '#161616' }}>
                            {activity.customer}
                          </span>
                        </div>
                        
                        <p className="text-sm mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                          "{activity.comment}"
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                            Hace {activity.time}
                          </span>
                          <span 
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              activity.type === 'positive' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
                  No hay actividad reciente
                </h3>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Las votaciones y reseñas de tus clientes aparecerán aquí cuando empiecen a usar tu página de votación.
                </p>
                <button
                  onClick={() => navigate('/app/pagina-votacion')}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white',
                    border: '1px solid #075E54'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }}
                >
                  Configurar Página de Votación
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Acciones Rápidas
          </h2>

          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group w-full p-4 rounded-lg border bg-white text-left transition-all duration-200 hover:shadow-md hover:border-gray-300"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#075E54' + '20' }}
                  >
                    <action.icon size={18} style={{ color: '#075E54' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1" style={{ color: '#161616' }}>
                      {action.title}
                    </h3>
                    <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 rounded-lg border bg-white" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <h3 className="font-medium text-sm mb-3" style={{ color: '#161616' }}>
              Resumen de Hoy
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>Votaciones:</span>
                <span className="font-medium" style={{ color: '#161616' }}>{todayStats.totalToday}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>A Google:</span>
                <span className="font-medium text-green-600">{todayStats.publicToday}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>Retenidas:</span>
                <span className="font-medium text-orange-600">{todayStats.privateToday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioPage;