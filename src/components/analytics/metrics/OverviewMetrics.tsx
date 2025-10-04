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
    <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="p-6 rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
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
    </div>
  );
};

export default OverviewMetrics;
