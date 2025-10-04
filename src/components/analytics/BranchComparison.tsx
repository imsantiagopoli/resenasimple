import React, { useMemo } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface VotingSession {
  branch_id: string;
  rating: number;
  google_redirect_clicked: boolean;
}

interface BranchInfo {
  id: string;
  name: string;
}

interface BranchComparisonProps {
  sessions: VotingSession[];
  branches: BranchInfo[];
}

const BranchComparison: React.FC<BranchComparisonProps> = ({ sessions, branches }) => {
  const branchStats = useMemo(() => {
    const stats: {
      [key: string]: {
        name: string;
        total: number;
        positive: number;
        negative: number;
        googleClicks: number;
        positiveRate: number;
        averageRating: number;
      };
    } = {};

    branches.forEach(branch => {
      const branchSessions = sessions.filter(s => s.branch_id === branch.id);
      const positive = branchSessions.filter(s => s.rating >= 4).length;
      const negative = branchSessions.filter(s => s.rating < 4).length;
      const total = branchSessions.length;
      const googleClicks = branchSessions.filter(s => s.google_redirect_clicked).length;
      const averageRating = total > 0
        ? branchSessions.reduce((sum, s) => sum + s.rating, 0) / total
        : 0;

      stats[branch.id] = {
        name: branch.name,
        total,
        positive,
        negative,
        googleClicks,
        positiveRate: total > 0 ? (positive / total) * 100 : 0,
        averageRating,
      };
    });

    return Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
  }, [sessions, branches]);

  const maxTotal = Math.max(...branchStats.map(([_, stats]) => stats.total), 1);

  if (branches.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
          Comparación por Sucursal
        </h2>
        <div className="p-8 rounded-lg bg-white text-center" style={{ border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280' }}>No hay sucursales registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Comparación por Sucursal
      </h2>

      <div className="space-y-4">
        {branchStats.map(([branchId, stats], index) => (
          <div key={branchId} className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdfa' }}>
                  <MapPin size={20} style={{ color: '#075E54' }} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
                    {stats.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    {stats.total} respuestas totales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-1">
                  <span className="text-2xl font-bold mr-2" style={{ color: '#161616' }}>
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-lg">⭐</span>
                </div>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Calificación promedio
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                  Distribución de respuestas
                </span>
                <span className="text-sm font-semibold" style={{ color: stats.positiveRate >= 70 ? '#16a34a' : stats.positiveRate >= 50 ? '#f59e0b' : '#dc2626' }}>
                  {stats.positiveRate.toFixed(0)}% positivas
                </span>
              </div>
              <div className="flex h-10 rounded-lg overflow-hidden shadow-sm">
                {stats.positive > 0 && (
                  <div
                    className="flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      width: `${(stats.positive / stats.total) * 100}%`,
                      backgroundColor: '#16a34a',
                      minWidth: stats.positive > 0 ? '40px' : '0',
                    }}
                  >
                    {stats.positive}
                  </div>
                )}
                {stats.negative > 0 && (
                  <div
                    className="flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      width: `${(stats.negative / stats.total) * 100}%`,
                      backgroundColor: '#dc2626',
                      minWidth: stats.negative > 0 ? '40px' : '0',
                    }}
                  >
                    {stats.negative}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                <p className="text-lg font-bold mb-1" style={{ color: '#16a34a' }}>
                  {stats.positive}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Positivas
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                <p className="text-lg font-bold mb-1" style={{ color: '#dc2626' }}>
                  {stats.negative}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Negativas
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                <p className="text-lg font-bold mb-1" style={{ color: '#2563eb' }}>
                  {stats.googleClicks}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Clicks Google
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  Volumen relativo
                </span>
                <span className="text-xs font-semibold" style={{ color: '#161616' }}>
                  {((stats.total / maxTotal) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(stats.total / maxTotal) * 100}%`,
                    backgroundColor: '#075E54',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchComparison;
