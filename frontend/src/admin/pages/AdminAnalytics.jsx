const WEEKLY_REVENUE = [
  { day: "Mon", amount: 42000 },
  { day: "Tue", amount: 46500 },
  { day: "Wed", amount: 51200 },
  { day: "Thu", amount: 49800 },
  { day: "Fri", amount: 63400 },
  { day: "Sat", amount: 71100 },
  { day: "Sun", amount: 68900 },
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
  const peak = Math.max(...WEEKLY_REVENUE.map((entry) => entry.amount));

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

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Weekly Revenue</h3>
        <div className="ad_chart_list">
          {WEEKLY_REVENUE.map((entry) => (
            <div className="ad_chart_row" key={entry.day}>
              <span className="ad_chart_row__label">{entry.day}</span>
              <div className="ad_chart_row__track">
                <div
                  className="ad_chart_row__bar"
                  style={{ width: `${Math.round((entry.amount / peak) * 100)}%` }}
                />
              </div>
              <strong className="ad_chart_row__value">₹{entry.amount.toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
      </section>

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
