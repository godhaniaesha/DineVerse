import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const THEME_COLORS = [
  "#d4a373", // Primary Gold
  "#b38b59", // Darker Gold
  "#e8c878", // Lighter Gold
  "#a0a0a0", // Muted Silver
  "#8c6a40", // Bronze
  "#d4af37", // Metallic Gold
];

const WEEKLY_REVENUE = [
  { day: "Mon", amount: 42000 },
  { day: "Tue", amount: 46500 },
  { day: "Wed", amount: 51200 },
  { day: "Thu", amount: 49800 },
  { day: "Fri", amount: 63400 },
  { day: "Sat", amount: 71100 },
  { day: "Sun", amount: 68900 },
];

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 380000 },
  { month: "Feb", revenue: 420000 },
  { month: "Mar", revenue: 390000 },
  { month: "Apr", revenue: 450000 },
  { month: "May", revenue: 480000 },
  { month: "Jun", revenue: 510000 },
  { month: "Jul", revenue: 530000 },
  { month: "Aug", revenue: 490000 },
  { month: "Sep", revenue: 520000 },
  { month: "Oct", revenue: 550000 },
  { month: "Nov", revenue: 580000 },
  { month: "Dec", revenue: 620000 },
];

const CHANNEL_SPLIT = [
  { label: "Website", value: 46 },
  { label: "Walk-in", value: 29 },
  { label: "Phone", value: 15 },
  { label: "Partner Apps", value: 10 },
];

const KPI = [
  { label: "Weekly Revenue", value: "₹3.9L", trend: "+8%" },
  { label: "Avg Reservation Value", value: "₹4,820", trend: "+5%" },
  { label: "Occupancy Rate", value: "74%", trend: "+3%" },
  { label: "No-show Rate", value: "4.2%", trend: "-1.1%" },
];

const TOP_SLOTS = [
  { slot: "7:00 PM - 8:00 PM", bookings: 28, utilization: "91%" },
  { slot: "8:00 PM - 9:00 PM", bookings: 31, utilization: "96%" },
  { slot: "9:00 PM - 10:00 PM", bookings: 22, utilization: "74%" },
];

export default function AdminAnalytics() {
  const [isCompactMobile, setIsCompactMobile] = useState(() => window.innerWidth <= 425);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 425px)");
    const handleViewportChange = (event) => setIsCompactMobile(event.matches);

    setIsCompactMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const mobileChartWidth = Math.max(MONTHLY_REVENUE.length * 56, 640);

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Analytics</h2>
      <p className="ad_p">Performance snapshot for revenue trends and booking channels.</p>

      <div className="ad_cards_grid">
        {KPI.map((item) => (
          <article className="ad_card" key={item.label}>
            <div className="ad_card__label">{item.label}</div>
            <div className="ad_card__value">{item.value}</div>
            <div className="ad_card__meta">{item.trend} this week</div>
          </article>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "16px", marginTop: 16 }}>
        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Weekly Revenue</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "4px" }} formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Area type="monotone" dataKey="amount" stroke="#d4a373" fillOpacity={1} fill="url(#colorAmount)" />
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
                  data={MONTHLY_REVENUE}
                  margin={{ top: 10, right: 10, left: isCompactMobile ? 0 : -20, bottom: 0 }}
                  barSize={isCompactMobile ? 22 : 16}
                  barCategoryGap={isCompactMobile ? 18 : undefined}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#666"
                    interval={0}
                    tickMargin={8}
                    tick={{ fontSize: isCompactMobile ? 11 : 10 }}
                  />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "4px" }} formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {MONTHLY_REVENUE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                  ))}
                </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Reservation Source</h3>
        <ul className="ad_list">
          {CHANNEL_SPLIT.map((channel) => (
            <li key={channel.label} className="ad_list__item ad_list__item--between">
              <span>{channel.label}</span>
              <strong>{channel.value}%</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Insight Notes</h3>
        <ul className="ad_list">
          <li className="ad_list__item">Friday and weekend slots are driving most revenue growth.</li>
          <li className="ad_list__item">Website conversions improved after menu photo updates.</li>
          <li className="ad_list__item">Phone bookings are stable and mostly for larger parties.</li>
        </ul>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Peak Time Analysis</h3>
        <div className="ad_table_wrap">
          <table className="ad_table">
            <thead><tr><th>Slot</th><th>Bookings</th><th>Utilization</th></tr></thead>
            <tbody>
              {TOP_SLOTS.map((row) => (
                <tr key={row.slot}>
                  <td>{row.slot}</td><td>{row.bookings}</td><td><span className="ad_chip">{row.utilization}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
