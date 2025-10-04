import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendsChartProps {
  sessions: any[];
  timeGrouping: 'day' | 'week' | 'month';
}

const TrendsChart: React.FC<TrendsChartProps> = ({ sessions, timeGrouping }) => {
  const trendData = useMemo(() => {
    if (sessions.length === 0) return [];

    const groupedData = new Map<string, { count: number; totalRating: number }>();

    sessions.forEach(session => {
      const date = new Date(session.created_at);
      let key: string;

      if (timeGrouping === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (timeGrouping === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const existing = groupedData.get(key) || { count: 0, totalRating: 0 };
      groupedData.set(key, {
        count: existing.count + 1,
        totalRating: existing.totalRating + session.rating
      });
    });

    return Array.from(groupedData.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        avgRating: (data.totalRating / data.count).toFixed(1)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [sessions, timeGrouping]);

  const maxCount = Math.max(...trendData.map(d => d.count), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeGrouping === 'day') {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } else if (timeGrouping === 'week') {
      return `Semana ${date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  };

  const calculateTrend = () => {
    if (trendData.length < 2) return { type: 'neutral', percentage: 0 };

    const recentData = trendData.slice(-3);
    const olderData = trendData.slice(0, -3);

    if (olderData.length === 0) return { type: 'neutral', percentage: 0 };

    const recentAvg = recentData.reduce((sum, d) => sum + d.count, 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, d) => sum + d.count, 0) / olderData.length;

    const percentageChange = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (percentageChange > 5) return { type: 'up', percentage: percentageChange };
    if (percentageChange < -5) return { type: 'down', percentage: Math.abs(percentageChange) };
    return { type: 'neutral', percentage: Math.abs(percentageChange) };
  };

  const trend = calculateTrend();

  return (
    <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      {trendData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            No hay datos para mostrar en el rango seleccionado
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trendData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#161616' }}>
                  {formatDate(data.date)}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    {data.count} reseña{data.count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#161616' }}>
                    ⭐ {data.avgRating}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(data.count / maxCount) * 100}%`,
                    backgroundColor: '#075E54'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendsChart;
