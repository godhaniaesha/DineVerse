const KPI_CARDS = [
  { label: "Today's Reservations", value: 18, trend: "+12%" },
  { label: "Active Rooms", value: "26 / 34", trend: "+4%" },
  { label: "Kitchen Orders", value: 47, trend: "+9%" },
  { label: "Gallery Uploads", value: 6, trend: "+2 new" },
];

const RECENT_ACTIVITY = [
  { id: 1, time: "10:25 AM", text: "Reservation #RV-918 confirmed for 7:30 PM" },
  { id: 2, time: "10:12 AM", text: "Room 203 marked as occupied" },
  { id: 3, time: "09:48 AM", text: "New dish added: Smoked Truffle Pasta" },
  { id: 4, time: "09:30 AM", text: "Gallery image approved for homepage slider" },
];

const TOP_ITEMS = [
  { name: "Truffle Pasta", orders: 34 },
  { name: "Signature Burger", orders: 29 },
  { name: "Seafood Risotto", orders: 23 },
  { name: "Chocolate Dome", orders: 19 },
];

const ALERTS = [
  { id: 1, text: "Room 202 is in maintenance for 2 days." },
  { id: 2, text: "Low stock: Fresh salmon and imported cheese." },
  { id: 3, text: "2 reservations awaiting manual confirmation." },
];

const TODAY_TABLE = [
  { id: "RV-918", guest: "Aarav Sharma", slot: "7:30 PM", type: "Table", status: "Confirmed" },
  { id: "RV-922", guest: "Mia Wilson", slot: "8:15 PM", type: "Table", status: "Pending" },
  { id: "RM-203", guest: "Noah Johnson", slot: "2:00 PM", type: "Room", status: "Checked In" },
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

      <div className="ad_two_col" style={{ marginTop: 16 }}>
        <section className="ad_card">
          <h3 className="ad_card__title">Recent Activity</h3>
          <ul className="ad_list">
            {RECENT_ACTIVITY.map((entry) => (
              <li key={entry.id} className="ad_list__item">
                <span className="ad_list__time">{entry.time}</span>
                <span>{entry.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ad_card">
          <h3 className="ad_card__title">Top Menu Items</h3>
          <ul className="ad_list">
            {TOP_ITEMS.map((item) => (
              <li key={item.name} className="ad_list__item ad_list__item--between">
                <span>{item.name}</span>
                <strong>{item.orders} orders</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ad_two_col" style={{ marginTop: 16 }}>
        <section className="ad_card">
          <h3 className="ad_card__title">Quick Actions</h3>
          <div className="ad_row_actions">
            <button className="ad_btn ad_btn--primary">Create Reservation</button>
            <button className="ad_btn ad_btn--ghost">Add Menu Item</button>
            <button className="ad_btn ad_btn--ghost">Upload Gallery Photo</button>
          </div>
        </section>
        <section className="ad_card">
          <h3 className="ad_card__title">Important Alerts</h3>
          <ul className="ad_list">
            {ALERTS.map((alert) => (
              <li key={alert.id} className="ad_list__item">
                <span className="ad_chip">Alert</span>
                <span>{alert.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

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