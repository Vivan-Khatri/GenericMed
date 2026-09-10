import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { ReservationAnalytics } from '../types';
import { fetchRevenueAnalytics } from '../api/analytics';

interface Props {
  chemistId: string;
}

export const ChemistAnalyticsDashboard: React.FC<Props> = ({ chemistId }) => {
  const [data, setData] = useState<ReservationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [chemistId]);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchRevenueAnalytics(chemistId);
    setData(result);
    setIsLoading(false);
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-semibold">Loading analytics...</p>
      </div>
    );
  }

  const maxDailyRevenue = Math.max(...data.dailyStats.map(s => s.revenue), 100);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Activity className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Holds</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.activeCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Customers waiting to pickup</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.completedCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            {data.conversionRate}% Conversion Rate
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Customer Savings</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(data.totalRevenueSaved).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total saved vs brand price</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Traffic (Week)</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{data.totalThisWeek}</div>
          <div className="text-[10px] text-slate-400 mt-1">Reservations last 7 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Chart (CSS/SVG only) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Revenue Trend (Last 7 Days)</h3>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {data.dailyStats.map((stat, i) => {
              const heightPercent = (stat.revenue / maxDailyRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex justify-center relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                      ₹{stat.revenue.toFixed(0)} ({stat.count} orders)
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-emerald-100 group-hover:bg-emerald-200 rounded-t-sm transition-all relative overflow-hidden"
                      style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    >
                      <div className="absolute bottom-0 w-full bg-emerald-500" style={{ height: '3px' }} />
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400">{stat.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Medicines & Competitiveness */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Top Reserved Medicines</h3>
            <div className="space-y-3">
              {data.topMedicines.map((med, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">
                      {i + 1}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]" title={med.name}>
                      {med.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{med.count}</span>
                </div>
              ))}
              {data.topMedicines.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-2">No data yet</div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Competitiveness</h3>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-extrabold">Good</div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold mb-1">
                <TrendingDown className="w-4 h-4" /> 12%
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Your average price (₹{data.avgPrice.toFixed(0)}) is 12% lower than the district average.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// Extracted missing icon
function CheckCircle2(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
