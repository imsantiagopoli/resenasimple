import React from 'react';
import { TrendingUp, TrendingDown, Users, MousePointerClick } from 'lucide-react';

interface OverviewMetricsProps {
  total: number;
  positive: number;
  negative: number;
  positiveRate: number;
  googleClicks: number;
  formsCompleted: number;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  total,
  positive,
  negative,
  positiveRate,
  googleClicks,
  formsCompleted,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#075E54' + '20' }}>
            <Users size={20} style={{ color: '#075E54' }} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold" style={{ color: '#161616' }}>{total}</p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Total</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10b981' + '20' }}>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold" style={{ color: '#161616' }}>{positive}</p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Positivas</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef4444' + '20' }}>
            <TrendingDown size={20} style={{ color: '#ef4444' }} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold" style={{ color: '#161616' }}>{negative}</p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Negativas</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#075E54' + '20' }}>
            <MousePointerClick size={20} style={{ color: '#075E54' }} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold" style={{ color: '#161616' }}>{googleClicks}</p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Clicks Google</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewMetrics;
