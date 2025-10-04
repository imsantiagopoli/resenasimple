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
  const maxCount = Math.max(...Object.values(ratingCounts), 1);

  const averageRating = useMemo(() => {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, session) => acc + session.rating, 0);
    return sum / sessions.length;
  }, [sessions]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Desglose por Calificación
      </h2>

      <div className="p-8 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-center mb-8 p-6 rounded-lg" style={{ backgroundColor: '#fef9e7' }}>
          <div className="text-center">
            <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
              Calificación Promedio
            </p>
            <div className="flex items-center justify-center">
              <p className="text-5xl font-bold mr-3" style={{ color: '#161616' }}>
                {averageRating.toFixed(1)}
              </p>
              <Star size={40} fill="#f59e0b" stroke="#f59e0b" />
            </div>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Basado en {total} calificaciones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-24">
                  <span className="text-sm font-semibold" style={{ color: '#374151' }}>
                    {rating}
                  </span>
                  <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                </div>

                <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                  <div
                    className="h-full transition-all duration-500 flex items-center px-3"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: rating >= 4 ? '#16a34a' : rating === 3 ? '#f59e0b' : '#dc2626',
                      minWidth: count > 0 ? '40px' : '0',
                    }}
                  >
                    {count > 0 && (
                      <span className="text-xs font-bold text-white">
                        {count}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-20 text-right">
                  <span className="text-sm font-semibold" style={{ color: '#161616' }}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #e5e7eb' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#16a34a' }}>
                {ratingCounts[5] + ratingCounts[4]}
              </p>
              <p className="text-xs font-medium" style={{ color: '#15803d' }}>
                Excelentes (4-5⭐)
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fef9e7' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                {ratingCounts[3]}
              </p>
              <p className="text-xs font-medium" style={{ color: '#d97706' }}>
                Regulares (3⭐)
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#dc2626' }}>
                {ratingCounts[2] + ratingCounts[1]}
              </p>
              <p className="text-xs font-medium" style={{ color: '#b91c1c' }}>
                Malas (1-2⭐)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
