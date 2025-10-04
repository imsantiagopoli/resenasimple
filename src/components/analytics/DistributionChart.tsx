import React from 'react';

interface DistributionChartProps {
  positive: number;
  negative: number;
  positiveRate: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  positive,
  negative,
  positiveRate,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Distribución de Respuestas
      </h2>

      <div className="p-8 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-80 h-80">
            <svg viewBox="0 0 200 200" className="transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#fee2e2"
                strokeWidth="40"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#16a34a"
                strokeWidth="40"
                strokeDasharray={`${(positiveRate / 100) * 502.4} 502.4`}
                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-5xl font-bold mb-2" style={{ color: '#161616' }}>
                {positiveRate.toFixed(1)}%
              </p>
              <p className="text-lg font-medium" style={{ color: '#6b7280' }}>
                Positivas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#16a34a' }}></div>
              <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Respuestas Positivas
              </h3>
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: '#16a34a' }}>
              {positive}
            </p>
            <p className="text-sm" style={{ color: '#15803d' }}>
              Calificaciones de 4 y 5 estrellas
            </p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#dc2626' }}></div>
              <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Respuestas Negativas
              </h3>
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: '#dc2626' }}>
              {negative}
            </p>
            <p className="text-sm" style={{ color: '#b91c1c' }}>
              Calificaciones de 1, 2 y 3 estrellas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;
