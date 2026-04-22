import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import dashboardService from '../../services/dashboardService';

const THEME_COLORS = [
  "#d4a373", // Primary Gold
  "#b38b59", // Darker Gold
  "#e8c878", // Lighter Gold
  "#a0a0a0", // Muted Silver
  "#8c6a40", // Bronze
  "#d4af37", // Metallic Gold
];

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    kpiCards: [],
    weeklyRevenue: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week');
  const [isCompactMobile, setIsCompactMobile] = useState(() => window.innerWidth <= 425);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 425px)");
    const handleViewportChange = (event) => setIsCompactMobile(event.matches);
    
    setIsCompactMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getAnalytics(`?period=${period}`);
      
      if (response.success) {
        setAnalyticsData({
          kpiCards: Array.isArray(response.data.kpiCards) ? response.data.kpiCards : [],
          weeklyRevenue: Array.isArray(response.data.weeklyRevenue) ? response.data.weeklyRevenue : [],
          monthlyRevenue: Array.isArray(response.data.monthlyRevenue) ? response.data.monthlyRevenue : []
        });
      } else {
        setError(response.msg || 'Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const mobileChartWidth = Math.max(analyticsData.monthlyRevenue.length * 56, 640);

  if (loading) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Analytics</h2>
        <p className="ad_p">Performance snapshot for revenue trends and booking channels.</p>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Analytics</h2>
        <p className="ad_p">Performance snapshot for revenue trends and booking channels.</p>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>
          <button 
            className="rooms__btn rooms__btn--primary" 
            onClick={fetchAnalyticsData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="ad_page">
      <h2 className="ad_h2">Analytics</h2>
      <p className="ad_p">Performance snapshot for revenue trends and booking channels.</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="rooms__form_select"
          style={{ minWidth: '120px' }}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="ad_cards_grid">
        {analyticsData.kpiCards.map((item, index) => (
          <article className="ad_card" key={`${item.label}-${index}`}>
            <div className="ad_card__label">{item.label}</div>
            <div className="ad_card__value">{item.value}</div>
            <div className="ad_card__meta">{item.trend}</div>
          </article>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "16px", marginTop: 16 }}>
        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Weekly Revenue</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  whiteSpace: "nowrap"
                }}
                  itemStyle={{
                    color: "#fff",
                    fontSize: "12px"
                  }}
                   formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Area type="monotone" dataKey="revenue" stroke="#d4a373" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Monthly Revenue Trend</h3>
          <div style={{ width: "100%", overflowX: isCompactMobile ? "auto" : "hidden", WebkitOverflowScrolling: "touch" }}>
            <div style={{ width: isCompactMobile ? mobileChartWidth : "100%", minWidth: isCompactMobile ? mobileChartWidth : "auto", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.monthlyRevenue}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  barSize={isCompactMobile ? 22 : 16}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />

                  <XAxis
                    dataKey="month"
                    stroke="#666"
                    interval={0}
                    tickMargin={8}
                    tick={{ fontSize: isCompactMobile ? 11 : 10 }}
                  />

                  <YAxis
                    stroke="#666"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value / 100000}L`}
                  />

                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                      whiteSpace: "nowrap"
                    }}
                    itemStyle={{
                      color: "#fff",
                      fontSize: "12px"
                    }}
                    formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, ""]}
                  />

                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {analyticsData.monthlyRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
