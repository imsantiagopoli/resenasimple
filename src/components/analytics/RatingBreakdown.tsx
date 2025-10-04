import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

interface VotingSession {
  rating: number;
}

interface RatingBreakdownProps {
  sessions: VotingSession[];
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ sessions }) => {
  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    sessions.forEach(session => {
      if (session.rating >= 1 && session.rating <= 5) {
        counts[session.rating as keyof typeof counts]++;
      }
    });
    return counts;
  }, [sessions]);

  const total = sessions.length;

  const averageRating = useMemo(() => {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, session) => acc + session.rating, 0);
    return sum / sessions.length;
  }, [sessions]);

  return (
    <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
        Desglose por Calificación
      </h3>

      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <p className="text-3xl font-bold mr-2" style={{ color: '#161616' }}>
              {averageRating.toFixed(1)}
            </p>
            <Star size={24} fill="#f59e0b" stroke="#f59e0b" />
          </div>
          <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
            Promedio de {total} calificaciones
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingCounts[rating as keyof typeof ratingCounts];
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium" style={{ color: '#161616' }}>
                  {rating}
                </span>
                <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
              </div>

              <div className="flex-1 h-6 rounded overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                <div
                  className="h-full flex items-center px-2"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: rating >= 4 ? '#10b981' : '#ef4444',
                    minWidth: count > 0 ? '32px' : '0',
                  }}
                >
                  {count > 0 && (
                    <span className="text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-12 text-right">
                <span className="text-xs font-medium" style={{ color: '#161616' }}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingBreakdown;
