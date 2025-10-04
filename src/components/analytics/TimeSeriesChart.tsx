import React from 'react';

interface TimeSeriesDataPoint {
  date: string;
  dateObj: Date;
  positive: number;
  negative: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  groupBy: 'day' | 'week' | 'month';
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, groupBy }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (groupBy === 'day') {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } else if (groupBy === 'week') {
      return `Sem ${date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
        Evolución en el Tiempo
      </h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            No hay datos para mostrar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                  {formatDate(item.date)}
                </span>
                <span className="text-xs font-medium" style={{ color: '#161616' }}>
                  {item.positive + item.negative}
                </span>
              </div>
              <div className="flex h-8 rounded overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                {item.positive > 0 && (
                  <div
                    className="flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      width: `${(item.positive / (item.positive + item.negative)) * 100}%`,
                      backgroundColor: '#10b981',
                      minWidth: item.positive > 0 ? '32px' : '0',
                    }}
                  >
                    {item.positive}
                  </div>
                )}
                {item.negative > 0 && (
                  <div
                    className="flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      width: `${(item.negative / (item.positive + item.negative)) * 100}%`,
                      backgroundColor: '#ef4444',
                      minWidth: item.negative > 0 ? '32px' : '0',
                    }}
                  >
                    {item.negative}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
