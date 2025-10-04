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

  const maxValue = Math.max(...data.map(d => d.positive + d.negative), 1);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Evolución en el Tiempo
      </h2>

      <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-lg font-medium mb-2" style={{ color: '#6b7280' }}>
                No hay datos para mostrar
              </p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Ajusta los filtros para ver resultados
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#374151' }}>
                    {formatDate(item.date)}
                  </span>
                  <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#e0f2fe', color: '#075985' }}>
                    {item.positive + item.negative} respuestas
                  </span>
                </div>
                <div className="flex h-12 rounded-lg overflow-hidden shadow-sm">
                  {item.positive > 0 && (
                    <div
                      className="flex items-center justify-center text-sm font-bold text-white transition-all duration-300"
                      style={{
                        width: `${(item.positive / (item.positive + item.negative)) * 100}%`,
                        backgroundColor: '#16a34a',
                        minWidth: item.positive > 0 ? '40px' : '0',
                      }}
                    >
                      {item.positive}
                    </div>
                  )}
                  {item.negative > 0 && (
                    <div
                      className="flex items-center justify-center text-sm font-bold text-white transition-all duration-300"
                      style={{
                        width: `${(item.negative / (item.positive + item.negative)) * 100}%`,
                        backgroundColor: '#dc2626',
                        minWidth: item.negative > 0 ? '40px' : '0',
                      }}
                    >
                      {item.negative}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#16a34a' }}></div>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      {item.positive} positivas
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#dc2626' }}></div>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      {item.negative} negativas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
