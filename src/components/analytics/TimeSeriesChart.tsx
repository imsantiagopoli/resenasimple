import React, { useMemo } from 'react';

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

  const maxTotal = useMemo(() => {
    return Math.max(...data.map(d => d.positive + d.negative), 1);
  }, [data]);

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
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex flex-col justify-between py-2" style={{ width: '60px' }}>
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{maxTotal}</span>
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{Math.floor(maxTotal / 2)}</span>
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>0</span>
            </div>

            <div className="flex-1">
              <div className="relative h-64 flex items-end gap-2 border-l border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
                {data.map((item, index) => {
                  const total = item.positive + item.negative;
                  const heightPercentage = (total / maxTotal) * 100;
                  const positivePercentage = total > 0 ? (item.positive / total) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col-reverse" style={{ height: '240px' }}>
                        <div
                          className="w-full rounded-t overflow-hidden"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          {item.negative > 0 && (
                            <div
                              className="w-full"
                              style={{
                                height: `${100 - positivePercentage}%`,
                                backgroundColor: '#ef4444',
                              }}
                            />
                          )}
                          {item.positive > 0 && (
                            <div
                              className="w-full"
                              style={{
                                height: `${positivePercentage}%`,
                                backgroundColor: '#10b981',
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium mb-1" style={{ color: '#161616' }}>
                          {total}
                        </div>
                        <div className="text-xs whitespace-nowrap" style={{ color: 'rgb(107, 114, 128)' }}>
                          {formatDate(item.date)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Positivas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Negativas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
