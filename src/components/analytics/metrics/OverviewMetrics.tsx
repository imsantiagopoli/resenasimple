import React from 'react';
import { MessageCircle, Star, Send, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';

interface OverviewMetricsProps {
  sessions: any[];
  branches: any[];
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ sessions, branches }) => {
  const totalSessions = sessions.length;
  const publicSessions = sessions.filter(s => s.is_public).length;
  const privateSessions = totalSessions - publicSessions;

  const totalRating = sessions.reduce((sum, s) => sum + s.rating, 0);
  const averageRating = totalSessions > 0 ? (totalRating / totalSessions).toFixed(1) : '0.0';

  const positiveReviews = sessions.filter(s => s.rating >= 4).length;
  const negativeReviews = sessions.filter(s => s.rating <= 3).length;
  const positiveRate = totalSessions > 0 ? ((positiveReviews / totalSessions) * 100).toFixed(1) : '0';

  const withComments = sessions.filter(s => s.comment && s.comment.trim() !== '').length;
  const commentRate = totalSessions > 0 ? ((withComments / totalSessions) * 100).toFixed(1) : '0';

  const metrics = [
    {
      icon: MessageCircle,
      label: 'Total de Reseñas',
      value: totalSessions.toString(),
      color: '#075E54',
      bgColor: '#075E54'
    },
    {
      icon: Star,
      label: 'Rating Promedio',
      value: averageRating,
      color: '#f59e0b',
      bgColor: '#f59e0b'
    },
    {
      icon: Send,
      label: 'Enviadas a Google',
      value: publicSessions.toString(),
      color: '#3b82f6',
      bgColor: '#3b82f6'
    },
    {
      icon: TrendingUp,
      label: 'Tasa de Positividad',
      value: `${positiveRate}%`,
      color: '#10b981',
      bgColor: '#10b981'
    },
    {
      icon: ThumbsUp,
      label: 'Reseñas Positivas',
      value: positiveReviews.toString(),
      color: '#22c55e',
      bgColor: '#22c55e'
    },
    {
      icon: ThumbsDown,
      label: 'Reseñas Negativas',
      value: negativeReviews.toString(),
      color: '#ef4444',
      bgColor: '#ef4444'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border p-6"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: metric.bgColor + '20' }}
                >
                  <Icon size={24} style={{ color: metric.color }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold" style={{ color: '#161616' }}>
                  {metric.value}
                </p>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Estadísticas Adicionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Reseñas retenidas internamente
              </span>
              <span className="text-lg font-semibold" style={{ color: '#161616' }}>
                {privateSessions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Con comentarios
              </span>
              <span className="text-lg font-semibold" style={{ color: '#161616' }}>
                {withComments} ({commentRate}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Sin comentarios
              </span>
              <span className="text-lg font-semibold" style={{ color: '#161616' }}>
                {totalSessions - withComments}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Sucursales activas
              </span>
              <span className="text-lg font-semibold" style={{ color: '#161616' }}>
                {branches.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Tasa de conversión a Google
              </span>
              <span className="text-lg font-semibold" style={{ color: '#161616' }}>
                {totalSessions > 0 ? ((publicSessions / totalSessions) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewMetrics;
