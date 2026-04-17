import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPI_CARDS = [
  { label: "Today's Reservations", value: 18, trend: "+12%" },
  { label: "Active Rooms", value: "26 / 34", trend: "+4%" },
  { label: "Kitchen Orders", value: 47, trend: "+9%" },
  { label: "Gallery Uploads", value: 6, trend: "+2 new" },
];

const TOP_ITEMS_CHART_DATA = [
  { time: "12 AM", "Truffle Pasta": 5, "Signature Burger": 3, "Seafood Risotto": 2, "Chocolate Dome": 1 },
  { time: "6 AM", "Truffle Pasta": 8, "Signature Burger": 6, "Seafood Risotto": 4, "Chocolate Dome": 2 },
  { time: "12 PM", "Truffle Pasta": 18, "Signature Burger": 8, "Seafood Risotto": 10, "Chocolate Dome": 5 },
  { time: "6 PM", "Truffle Pasta": 34, "Signature Burger": 29, "Seafood Risotto": 23, "Chocolate Dome": 19 },
];

const TOP_ITEMS = [
  { name: "Truffle Pasta", orders: 34 },
  { name: "Signature Burger", orders: 29 },
  { name: "Seafood Risotto", orders: 23 },
  { name: "Chocolate Dome", orders: 19 },
];

const TODAY_TABLE = [
  { id: "RV-918", guest: "Aarav Sharma", slot: "7:30 PM", type: "Table", status: "Confirmed" },
  { id: "RV-922", guest: "Mia Wilson", slot: "8:15 PM", type: "Table", status: "Pending" },
  { id: "RM-203", guest: "Noah Johnson", slot: "2:00 PM", type: "Room", status: "Checked In" },
];

const TABLE_OVERVIEW = [
  { area: "Cafe", table: "T1", seats: 4, status: "Occupied" },
  { area: "Cafe", table: "T2", seats: 4, status: "Available" },
  { area: "Restaurant", table: "R1", seats: 6, status: "Occupied" },
  { area: "Restaurant", table: "R2", seats: 4, status: "Available" },
  { area: "Bar", table: "B1", seats: 4, status: "Occupied" },
  { area: "Bar", table: "B2", seats: 2, status: "Available" },
];

export default function AdminDashboard() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Dashboard Overview</h2>
      <p className="ad_p">Track key admin metrics across bookings, rooms and menu performance.</p>

      <div className="ad_cards_grid" style={{ marginTop: 16 }}>
        {KPI_CARDS.map((item) => (
          <article key={item.label} className="ad_card">
            <div className="ad_card__label">{item.label}</div>
            <div className="ad_card__value">{item.value}</div>
            <div className="ad_card__meta">{item.trend} vs yesterday</div>
          </article>
        ))}
      </div>

      <div className="ad_two_col" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "16px" }}>
        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Best Selling Dishes</h3>
          <ul className="ad_list">
            {TOP_ITEMS.map((item, index) => (
              <li key={item.name} className="ad_list__item ad_list__item--between">
                <div>
                  <div style={{ color: "#f3ede2", fontWeight: 600 }}>#{index + 1} {item.name}</div>
                  <div className="ad_card__meta">High demand during prime service hours</div>
                </div>
                <span className="ad_chip">{item.orders} orders</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Top Menu Items</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TOP_ITEMS_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
               <Tooltip
  cursor={{ fill: "rgba(212,163,115,0.08)" }} // soft hover highlight

  contentStyle={{
    background: "rgba(255,255,255,0.95)",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: "8px 12px",
    backdropFilter: "blur(6px)"
  }}

  labelStyle={{
    color: "#888",
    fontSize: "11px",
    marginBottom: "2px"
  }}

  itemStyle={{
    color: "#333",
    fontWeight: "600",
    fontSize: "13px"
  }}

  formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
/> <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="Truffle Pasta" stroke="#d4a373" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Signature Burger" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Seafood Risotto" stroke="#4ecdc4" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Chocolate Dome" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Table Status</h3>
        <div className="ad_cards_grid" style={{ marginTop: 12 }}>
          {TABLE_OVERVIEW.map((item) => (
            <article key={`${item.area}-${item.table}`} className="ad_card">
              <div className="ad_card__label">{item.area} - {item.table}</div>
              <div className="ad_card__value">{item.seats} persons</div>
              <div className="ad_card__meta">{item.status}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Today Live Bookings</h3>
        <div className="ad_table_wrap">
          <table className="ad_table">
            <thead><tr><th>ID</th><th>Guest</th><th>Slot</th><th>Type</th><th>Status</th></tr></thead>
            <tbody>
              {TODAY_TABLE.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td><td>{row.guest}</td><td>{row.slot}</td><td>{row.type}</td><td><span className="ad_chip">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
