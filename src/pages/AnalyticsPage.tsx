import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Star,
  Target,
  MapPin,
} from 'lucide-react';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import OverviewMetrics from '../components/analytics/OverviewMetrics';
import DistributionChart from '../components/analytics/DistributionChart';
import TimeSeriesChart from '../components/analytics/TimeSeriesChart';
import RatingBreakdown from '../components/analytics/RatingBreakdown';
import ConversionMetrics from '../components/analytics/ConversionMetrics';
import BranchComparison from '../components/analytics/BranchComparison';

interface VotingSession {
  id: string;
  branch_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  rating: number;
  comment: string | null;
  is_public: boolean;
  created_at: string;
  status: string;
  google_redirect_clicked: boolean;
  form_completed: boolean;
}

interface BranchInfo {
  id: string;
  name: string;
}

type DateGrouping = 'day' | 'week' | 'month';
type AnalyticsTab = 'overview' | 'distribution' | 'timeline' | 'ratings' | 'conversion' | 'branches';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { businessProfile } = useBusiness();
  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<DateGrouping>('day');
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  useEffect(() => {
    if (businessProfile?.id) {
      fetchBranches();
      fetchSessions();
    }
  }, [businessProfile?.id]);

  const fetchBranches = async () => {
    if (!businessProfile?.id) return;

    const { data, error } = await supabase
      .from('business_branches')
      .select('id, name')
      .eq('business_id', businessProfile.id)
      .order('name');

    if (data && !error) {
      setBranches(data);
    }
  };

  const fetchSessions = async () => {
    if (!businessProfile?.id) return;

    setLoading(true);

    let query = supabase
      .from('voting_sessions')
      .select(`
        *,
        business_branches!inner(business_id)
      `)
      .eq('business_branches.business_id', businessProfile.id)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (data && !error) {
      setSessions(data);
    }

    setLoading(false);
  };

  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    if (selectedBranch !== 'all') {
      filtered = filtered.filter(s => s.branch_id === selectedBranch);
    }

    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(s => new Date(s.created_at) >= startDate);
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(s => new Date(s.created_at) <= endDate);
    }

    return filtered;
  }, [sessions, selectedBranch, dateRange]);

  const statsData = useMemo(() => {
    const positive = filteredSessions.filter(s => s.rating >= 4).length;
    const negative = filteredSessions.filter(s => s.rating < 4).length;
    const total = filteredSessions.length;
    const positiveRate = total > 0 ? (positive / total) * 100 : 0;
    const googleClicks = filteredSessions.filter(s => s.google_redirect_clicked).length;
    const formsCompleted = filteredSessions.filter(s => s.form_completed).length;

    return {
      total,
      positive,
      negative,
      positiveRate,
      googleClicks,
      formsCompleted,
    };
  }, [filteredSessions]);

  const timeSeriesData = useMemo(() => {
    const grouped: { [key: string]: { positive: number; negative: number; date: Date } } = {};

    filteredSessions.forEach(session => {
      const date = new Date(session.created_at);
      let key: string;

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!grouped[key]) {
        grouped[key] = { positive: 0, negative: 0, date: new Date(key) };
      }

      if (session.rating >= 4) {
        grouped[key].positive += 1;
      } else {
        grouped[key].negative += 1;
      }
    });

    return Object.entries(grouped)
      .map(([key, value]) => ({
        date: key,
        dateObj: value.date,
        positive: value.positive,
        negative: value.negative,
      }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [filteredSessions, groupBy]);

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: LayoutDashboard },
    { id: 'distribution', label: 'Distribución', icon: PieChart },
    { id: 'timeline', label: 'Evolución', icon: TrendingUp },
    { id: 'ratings', label: 'Calificaciones', icon: Star },
    { id: 'conversion', label: 'Conversión', icon: Target },
    { id: 'branches', label: 'Sucursales', icon: MapPin },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Análisis de Reseñas
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Visualiza el rendimiento de tus respuestas y reseñas
        </p>
      </div>

      <AnalyticsFilters
        branches={branches}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AnalyticsTab)}
              className={`w-full p-4 rounded-lg border bg-white text-left transition-all duration-200 ${
                activeTab === tab.id ? 'shadow-md border-gray-300' : 'hover:shadow-md hover:border-gray-300'
              }`}
              style={{
                borderColor: activeTab === tab.id ? 'rgb(209, 213, 219)' : 'rgb(229, 231, 235)'
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform ${
                    activeTab === tab.id ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? '#075E54' + '20' : '#f3f4f6'
                  }}
                >
                  <tab.icon
                    size={18}
                    style={{
                      color: activeTab === tab.id ? '#075E54' : 'rgb(107, 114, 128)'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-medium text-sm"
                    style={{
                      color: activeTab === tab.id ? '#075E54' : '#161616'
                    }}
                  >
                    {tab.label}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <OverviewMetrics
              total={statsData.total}
              positive={statsData.positive}
              negative={statsData.negative}
              positiveRate={statsData.positiveRate}
              googleClicks={statsData.googleClicks}
              formsCompleted={statsData.formsCompleted}
            />
          )}
          {activeTab === 'distribution' && (
            <DistributionChart
              positive={statsData.positive}
              negative={statsData.negative}
              positiveRate={statsData.positiveRate}
            />
          )}
          {activeTab === 'timeline' && (
            <TimeSeriesChart data={timeSeriesData} groupBy={groupBy} />
          )}
          {activeTab === 'ratings' && (
            <RatingBreakdown sessions={filteredSessions} />
          )}
          {activeTab === 'conversion' && (
            <ConversionMetrics
              total={statsData.total}
              googleClicks={statsData.googleClicks}
              formsCompleted={statsData.formsCompleted}
              positive={statsData.positive}
              negative={statsData.negative}
            />
          )}
          {activeTab === 'branches' && (
            <BranchComparison sessions={filteredSessions} branches={branches} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
