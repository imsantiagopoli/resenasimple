import React from 'react';
import DateRangeFilter from './DateRangeFilter';
import TimeGroupingSelector from './TimeGroupingSelector';
import OverviewMetrics from './metrics/OverviewMetrics';
import RatingsChart from './metrics/RatingsChart';
import TrendsChart from './metrics/TrendsChart';
import BranchesComparison from './metrics/BranchesComparison';

interface AnalyticsPanelProps {
  selectedMetric: 'overview' | 'ratings' | 'trends' | 'branches';
  sessions: any[];
  branches: any[];
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
  timeGrouping: 'day' | 'week' | 'month';
  onTimeGroupingChange: (grouping: 'day' | 'week' | 'month') => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  selectedMetric,
  sessions,
  branches,
  dateRange,
  onDateRangeChange,
  timeGrouping,
  onTimeGroupingChange
}) => {
  const filteredSessions = sessions.filter(session => {
    if (!dateRange.from && !dateRange.to) return true;

    const sessionDate = new Date(session.created_at);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    if (fromDate && sessionDate < fromDate) return false;
    if (toDate && sessionDate > toDate) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header with Filters */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold" style={{ color: '#161616' }}>
          {selectedMetric === 'overview' && 'Vista General'}
          {selectedMetric === 'ratings' && 'Análisis de Calificaciones'}
          {selectedMetric === 'trends' && 'Tendencias en el Tiempo'}
          {selectedMetric === 'branches' && 'Comparativa por Sucursal'}
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />

          {(selectedMetric === 'trends' || selectedMetric === 'branches') && (
            <TimeGroupingSelector
              timeGrouping={timeGrouping}
              onTimeGroupingChange={onTimeGroupingChange}
            />
          )}
        </div>
      </div>

      {/* Content based on selected metric */}
      <div className="space-y-6">
        {selectedMetric === 'overview' && (
          <OverviewMetrics sessions={filteredSessions} branches={branches} />
        )}

        {selectedMetric === 'ratings' && (
          <RatingsChart sessions={filteredSessions} />
        )}

        {selectedMetric === 'trends' && (
          <TrendsChart
            sessions={filteredSessions}
            timeGrouping={timeGrouping}
          />
        )}

        {selectedMetric === 'branches' && (
          <BranchesComparison
            sessions={filteredSessions}
            branches={branches}
            timeGrouping={timeGrouping}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
