import { useState } from "react";
const DATA = [
  { id: 1, title: "New booking received", channel: "Dashboard", type: "Booking", status: "Enabled" },
  { id: 2, title: "Low room availability", channel: "Email", type: "Room", status: "Enabled" },
];
export default function AdminNotifications() {
  const [rows, setRows] = useState(DATA);
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Notification Management</h2>
      <p className="ad_p">Configure alerts for important business events.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Notification</th><th>Type</th><th>Channel</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td><td>{row.type}</td><td>{row.channel}</td><td><span className="ad_chip">{row.status}</span></td>
                <td><button className="ad_btn ad_btn--ghost" onClick={() => setRows((p) => p.map((x) => x.id === row.id ? { ...x, status: x.status === "Enabled" ? "Disabled" : "Enabled" } : x))}>{row.status === "Enabled" ? "Disable" : "Enable"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
