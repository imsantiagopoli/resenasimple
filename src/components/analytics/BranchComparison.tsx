import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';

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
        positiveRate: number;
        averageRating: number;
      };
    } = {};

    branches.forEach(branch => {
      const branchSessions = sessions.filter(s => s.branch_id === branch.id);
      const positive = branchSessions.filter(s => s.rating >= 4).length;
      const negative = branchSessions.filter(s => s.rating < 4).length;
      const total = branchSessions.length;
      const averageRating = total > 0
        ? branchSessions.reduce((sum, s) => sum + s.rating, 0) / total
        : 0;

      stats[branch.id] = {
        name: branch.name,
        total,
        positive,
        negative,
        positiveRate: total > 0 ? (positive / total) * 100 : 0,
        averageRating,
      };
    });

    return Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
  }, [sessions, branches]);

  if (branches.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white border text-center" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#161616' }}>
          Comparación por Sucursal
        </h3>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>No hay sucursales registradas</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
        Comparación por Sucursal
      </h3>

      <div className="space-y-4">
        {branchStats.map(([branchId, stats]) => (
          <div key={branchId} className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#075E54' + '20' }}>
                  <MapPin size={16} style={{ color: '#075E54' }} />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold" style={{ color: '#161616' }}>
                    {stats.name}
                  </h4>
                  <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                    {stats.total} respuestas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1" style={{ color: '#161616' }}>
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm">⭐</span>
                </div>
              </div>
            </div>

            <div className="flex h-8 rounded overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
              {stats.positive > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    width: `${(stats.positive / stats.total) * 100}%`,
                    backgroundColor: '#10b981',
                    minWidth: stats.positive > 0 ? '32px' : '0',
                  }}
                >
                  {stats.positive}
                </div>
              )}
              {stats.negative > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    width: `${(stats.negative / stats.total) * 100}%`,
                    backgroundColor: '#ef4444',
                    minWidth: stats.negative > 0 ? '32px' : '0',
                  }}
                >
                  {stats.negative}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                {stats.positiveRate.toFixed(0)}% positivas
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchComparison;
