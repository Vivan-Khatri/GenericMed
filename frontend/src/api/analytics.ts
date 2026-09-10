import { ReservationAnalytics, DailyReservationStat } from '../types';

// ── Helper: Generate last-7-day date labels ───────────────────────────────────
function getLast7Days(): { date: string; fullDate: string }[] {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: days[d.getDay()],
      fullDate: d.toISOString().split('T')[0],
    };
  });
}

// ── Mock analytics (offline / fallback mode) ─────────────────────────────────
function getMockAnalytics(): ReservationAnalytics {
  const days = getLast7Days();
  const dailyStats: DailyReservationStat[] = days.map((d, i) => ({
    ...d,
    count: [2, 5, 3, 8, 4, 6, 1][i],
    revenue: [84, 210, 126, 336, 168, 252, 42][i],
  }));

  return {
    totalToday:      1,
    totalThisWeek:   29,
    totalThisMonth:  87,
    completedCount:  64,
    activeCount:     18,
    cancelledCount:  5,
    conversionRate:  92.8,
    topMedicines:    [
      { name: 'Atorvastatin 20mg', count: 42 },
      { name: 'Metformin 1000mg',  count: 28 },
      { name: 'Amlodipine 5mg',    count: 17 },
    ],
    totalRevenueSaved: 38619,
    dailyStats,
    avgPrice: 49.50,
  };
}

// ── Analytics from MongoDB backend ────────────────────────────────────────────
export async function fetchRevenueAnalytics(chemistId: string): Promise<ReservationAnalytics> {
  try {
    const res = await fetch(`/api/analytics/${chemistId}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    console.warn('[analytics] Backend unavailable, using mock analytics.');
    return getMockAnalytics();
  }
}
