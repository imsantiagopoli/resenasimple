import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown, Calendar, Filter, PieChart, BarChart3, Download } from 'lucide-react';

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

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { businessProfile } = useBusiness();
  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<DateGrouping>('day');

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

  const maxValue = useMemo(() => {
    return Math.max(...timeSeriesData.map(d => d.positive + d.negative), 1);
  }, [timeSeriesData]);

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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#075E54' }}></div>
            <p className="mt-4" style={{ color: '#6b7280' }}>Cargando análisis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#161616' }}>
            Análisis de Reseñas
          </h1>
          <p style={{ color: '#6b7280' }}>
            Visualiza el rendimiento de tus respuestas y reseñas
          </p>
        </div>

        <div className="mb-6 p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
          <div className="flex items-center mb-4">
            <Filter size={20} style={{ color: '#075E54' }} className="mr-2" />
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Sucursal
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: 'white',
                  color: '#161616',
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
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: 'white',
                  color: '#161616',
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
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: 'white',
                  color: '#161616',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Agrupar por
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as DateGrouping)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: 'white',
                  color: '#161616',
                }}
              >
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
              </select>
            </div>
          </div>

          {(dateRange.start || dateRange.end || selectedBranch !== 'all') && (
            <button
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setSelectedBranch('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: '#075E54',
                backgroundColor: '#f0fdfa',
                border: '1px solid #99f6e4',
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Total Respuestas</p>
              <BarChart3 size={20} style={{ color: '#075E54' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#161616' }}>{statsData.total}</p>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Positivas</p>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#10b981' }}>{statsData.positive}</p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {statsData.positiveRate.toFixed(1)}% del total
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Negativas</p>
              <TrendingDown size={20} style={{ color: '#ef4444' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>{statsData.negative}</p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {(100 - statsData.positiveRate).toFixed(1)}% del total
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Clicks a Google</p>
              <Calendar size={20} style={{ color: '#075E54' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#161616' }}>{statsData.googleClicks}</p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {statsData.formsCompleted} formularios completados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center mb-6">
              <PieChart size={20} style={{ color: '#075E54' }} className="mr-2" />
              <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Distribución Positivas/Negativas
              </h2>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="40"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="40"
                    strokeDasharray={`${(statsData.positiveRate / 100) * 502.4} 502.4`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-4xl font-bold" style={{ color: '#161616' }}>
                    {statsData.positiveRate.toFixed(0)}%
                  </p>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Positivas</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></div>
                  <span className="text-sm" style={{ color: '#374151' }}>Positivas (4-5 estrellas)</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#161616' }}>{statsData.positive}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-sm" style={{ color: '#374151' }}>Negativas (1-3 estrellas)</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#161616' }}>{statsData.negative}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm" style={{ borderColor: '#e5e7eb', border: '1px solid' }}>
            <div className="flex items-center mb-6">
              <BarChart3 size={20} style={{ color: '#075E54' }} className="mr-2" />
              <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Evolución en el Tiempo
              </h2>
            </div>

            {timeSeriesData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p style={{ color: '#6b7280' }}>No hay datos para mostrar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeSeriesData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>
                        {formatDate(item.date)}
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>
                        {item.positive + item.negative}
                      </span>
                    </div>
                    <div className="flex h-8 rounded overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                      {item.positive > 0 && (
                        <div
                          className="flex items-center justify-center text-xs font-medium text-white"
                          style={{
                            width: `${(item.positive / (item.positive + item.negative)) * 100}%`,
                            backgroundColor: '#10b981',
                            minWidth: item.positive > 0 ? '20px' : '0',
                          }}
                        >
                          {item.positive}
                        </div>
                      )}
                      {item.negative > 0 && (
                        <div
                          className="flex items-center justify-center text-xs font-medium text-white"
                          style={{
                            width: `${(item.negative / (item.positive + item.negative)) * 100}%`,
                            backgroundColor: '#ef4444',
                            minWidth: item.negative > 0 ? '20px' : '0',
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
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
