import React from 'react';

interface TimeGroupingSelectorProps {
  timeGrouping: 'day' | 'week' | 'month';
  onTimeGroupingChange: (grouping: 'day' | 'week' | 'month') => void;
}

const TimeGroupingSelector: React.FC<TimeGroupingSelectorProps> = ({
  timeGrouping,
  onTimeGroupingChange
}) => {
  const options = [
    { value: 'day' as const, label: 'Por día' },
    { value: 'week' as const, label: 'Por semana' },
    { value: 'month' as const, label: 'Por mes' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
        Visualizar:
      </span>
      <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'rgb(209, 213, 219)' }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onTimeGroupingChange(option.value)}
            className="px-4 py-1.5 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: timeGrouping === option.value ? '#075E54' : 'white',
              color: timeGrouping === option.value ? 'white' : '#161616',
              borderRight: option.value !== 'month' ? '1px solid rgb(209, 213, 219)' : 'none'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeGroupingSelector;
