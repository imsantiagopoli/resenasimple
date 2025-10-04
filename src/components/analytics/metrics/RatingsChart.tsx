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
    <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'rgb(229, 231, 235)' }}>
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
  );
};

export default RatingsChart;
