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
    <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
        Distribución
      </h3>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="40"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="40"
              strokeDasharray={`${(positiveRate / 100) * 502.4} 502.4`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-3xl font-bold" style={{ color: '#161616' }}>
              {positiveRate.toFixed(0)}%
            </p>
            <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              Positivas
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></div>
            <span style={{ color: 'rgb(107, 114, 128)' }}>Positivas</span>
          </div>
          <span className="font-medium" style={{ color: '#161616' }}>{positive}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#ef4444' }}></div>
            <span style={{ color: 'rgb(107, 114, 128)' }}>Negativas</span>
          </div>
          <span className="font-medium" style={{ color: '#161616' }}>{negative}</span>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;
