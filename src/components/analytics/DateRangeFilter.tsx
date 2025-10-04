import React from 'react';
import { Calendar, X } from 'lucide-react';

interface DateRangeFilterProps {
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onDateRangeChange }) => {
  const handleClear = () => {
    onDateRangeChange({ from: '', to: '' });
  };

  const hasDateRange = dateRange.from || dateRange.to;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Calendar size={16} style={{ color: 'rgb(107, 114, 128)' }} />
        <span className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
          Rango de fechas:
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <label className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Desde</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className="px-3 py-1.5 rounded-lg border text-sm"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616'
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Hasta</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className="px-3 py-1.5 rounded-lg border text-sm"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616'
            }}
          />
        </div>
      </div>

      {hasDateRange && (
        <button
          onClick={handleClear}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Limpiar fechas"
        >
          <X size={16} style={{ color: 'rgb(107, 114, 128)' }} />
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;
