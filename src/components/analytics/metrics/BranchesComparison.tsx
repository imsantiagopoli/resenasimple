import React, { useMemo } from 'react';
import { MapPin, Star } from 'lucide-react';

interface BranchesComparisonProps {
  sessions: any[];
  branches: any[];
  timeGrouping: 'day' | 'week' | 'month';
}

const BranchesComparison: React.FC<BranchesComparisonProps> = ({ sessions, branches, timeGrouping }) => {
  const branchStats = useMemo(() => {
    return branches.map(branch => {
      const branchSessions = sessions.filter(s => s.branch_id === branch.id);
      const totalRating = branchSessions.reduce((sum, s) => sum + s.rating, 0);
      const avgRating = branchSessions.length > 0 ? (totalRating / branchSessions.length).toFixed(1) : '0.0';
      const publicCount = branchSessions.filter(s => s.is_public).length;

      return {
        id: branch.id,
        name: branch.name,
        count: branchSessions.length,
        avgRating,
        publicCount,
        privateCount: branchSessions.length - publicCount,
        positiveRate: branchSessions.length > 0
          ? ((branchSessions.filter(s => s.rating >= 4).length / branchSessions.length) * 100).toFixed(1)
          : '0'
      };
    }).sort((a, b) => b.count - a.count);
  }, [sessions, branches]);

  const maxCount = Math.max(...branchStats.map(b => b.count), 1);

  const overallStats = {
    totalSessions: sessions.length,
    avgRating: sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      {branchStats.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            No hay datos de sucursales disponibles
          </p>
        </div>
      ) : (
        <div className="space-y-6">
            {branchStats.map((branch, index) => (
              <div
                key={branch.id}
                className="p-5 rounded-lg border"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                {/* Branch Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#075E54' + '20' }}
                    >
                      <MapPin size={20} style={{ color: '#075E54' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: '#161616' }}>
                        {branch.name}
                      </h4>
                      <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                        #{index + 1} en volumen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="text-xl font-bold" style={{ color: '#161616' }}>
                      {branch.avgRating}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {branch.count} reseña{branch.count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#161616' }}>
                      {((branch.count / overallStats.totalSessions) * 100).toFixed(1)}% del total
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(branch.count / maxCount) * 100}%`,
                        backgroundColor: '#075E54'
                      }}
                    />
                  </div>
                </div>

                {/* Branch Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'rgb(107, 114, 128)' }}>
                      Enviadas a Google
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#161616' }}>
                      {branch.publicCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'rgb(107, 114, 128)' }}>
                      Retenidas
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#161616' }}>
                      {branch.privateCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'rgb(107, 114, 128)' }}>
                      Tasa Positiva
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#161616' }}>
                      {branch.positiveRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BranchesComparison;
