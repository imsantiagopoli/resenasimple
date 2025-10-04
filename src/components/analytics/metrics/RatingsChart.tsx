import React from 'react';
import { Star } from 'lucide-react';

interface RatingsChartProps {
  sessions: any[];
}

const RatingsChart: React.FC<RatingsChartProps> = ({ sessions }) => {
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: sessions.filter(s => s.rating === rating).length,
    percentage: sessions.length > 0
      ? ((sessions.filter(s => s.rating === rating).length / sessions.length) * 100).toFixed(1)
      : '0'
  }));

  const maxCount = Math.max(...ratingCounts.map(r => r.count), 1);

  return (
    <div className="space-y-6">
      {/* Distribution Chart */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h3 className="text-lg font-semibold mb-6" style={{ color: '#161616' }}>
          Distribución de Calificaciones
        </h3>

        <div className="space-y-4">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-8" style={{ color: '#161616' }}>
                    {rating}
                  </span>
                  <Star size={16} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    {count} reseña{count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-medium w-12 text-right" style={{ color: '#161616' }}>
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: rating >= 4 ? '#10b981' : rating === 3 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Star size={20} className="text-green-600 fill-current" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
              Positivas (4-5)
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#161616' }}>
            {ratingCounts.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0)}
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
            {sessions.length > 0
              ? ((ratingCounts.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0) / sessions.length) * 100).toFixed(1)
              : '0'}% del total
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Star size={20} className="text-yellow-600 fill-current" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
              Neutras (3)
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#161616' }}>
            {ratingCounts.find(r => r.rating === 3)?.count || 0}
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
            {ratingCounts.find(r => r.rating === 3)?.percentage || '0'}% del total
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Star size={20} className="text-red-600 fill-current" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
              Negativas (1-2)
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#161616' }}>
            {ratingCounts.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0)}
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
            {sessions.length > 0
              ? ((ratingCounts.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0) / sessions.length) * 100).toFixed(1)
              : '0'}% del total
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingsChart;
