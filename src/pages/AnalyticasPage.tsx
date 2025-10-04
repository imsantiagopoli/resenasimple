import React, { useState } from 'react';
import AnalyticsMenu from '../components/analytics/AnalyticsMenu';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import { useVotingSessions } from '../hooks/useVotingSessions';
import { useBusiness } from '../hooks/useBusiness';

const AnalyticasPage: React.FC = () => {
  const { sessions, loading } = useVotingSessions();
  const { branches } = useBusiness();
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'ratings' | 'trends' | 'branches'>('overview');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: ''
  });
  const [timeGrouping, setTimeGrouping] = useState<'day' | 'week' | 'month'>('day');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <div className="flex h-screen">
        {/* Columna izquierda - Menú de Analíticas (más estrecha) */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <AnalyticsMenu
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </div>

        {/* Columna derecha - Panel de Analíticas (más ancha) */}
        <div className="flex-1 overflow-y-auto">
          <AnalyticsPanel
            selectedMetric={selectedMetric}
            sessions={sessions}
            branches={branches}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            timeGrouping={timeGrouping}
            onTimeGroupingChange={setTimeGrouping}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticasPage;
