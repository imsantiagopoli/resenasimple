import React from 'react';
import { Filter, X } from 'lucide-react';

interface BranchInfo {
  id: string;
  name: string;
}

interface AnalyticsFiltersProps {
  branches: BranchInfo[];
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (value: { start: string; end: string }) => void;
  groupBy: 'day' | 'week' | 'month';
  setGroupBy: (value: 'day' | 'week' | 'month') => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  branches,
  selectedBranch,
  setSelectedBranch,
  dateRange,
  setDateRange,
  groupBy,
  setGroupBy,
}) => {
  const hasActiveFilters = dateRange.start || dateRange.end || selectedBranch !== 'all';

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedBranch('all');
  };

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter size={20} style={{ color: '#075E54' }} className="mr-2" />
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
            }}
          >
            <X size={14} className="mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Sucursal
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#d1d5db',
              backgroundColor: 'white',
              color: '#161616',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#075E54';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 94, 84, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="all">Todas las sucursales</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Fecha inicio
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#d1d5db',
              backgroundColor: 'white',
              color: '#161616',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#075E54';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 94, 84, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Fecha fin
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#d1d5db',
              backgroundColor: 'white',
              color: '#161616',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#075E54';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 94, 84, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Agrupar por
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#d1d5db',
              backgroundColor: 'white',
              color: '#161616',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#075E54';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7, 94, 84, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
