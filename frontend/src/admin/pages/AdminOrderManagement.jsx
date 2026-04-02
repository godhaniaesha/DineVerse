import { useState } from "react";

const INITIAL = [
  { id: "ORD-101", table: "T3", customer: "Walk-in", items: "Pizza, Pasta", chef: "Rahul", waiter: "Neha", status: "New Order", time: "19:20" },
];
const FLOW = ["New Order", "Preparing", "Ready", "Served", "Completed"];

export default function AdminOrderManagement() {
  const [rows, setRows] = useState(INITIAL);
  const nextStatus = (status) => FLOW[Math.min(FLOW.indexOf(status) + 1, FLOW.length - 1)];
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Order Management</h2>
      <p className="ad_p">Track order flow from creation to completion.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Order ID</th><th>Table</th><th>Customer</th><th>Items</th><th>Chef</th><th>Waiter</th><th>Status</th><th>Time</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td><td>{row.table}</td><td>{row.customer}</td><td>{row.items}</td><td>{row.chef}</td><td>{row.waiter}</td><td><span className="ad_chip">{row.status}</span></td><td>{row.time}</td>
                <td><button className="ad_btn ad_btn--primary" onClick={() => setRows((p) => p.map((x) => x.id === row.id ? { ...x, status: nextStatus(x.status) } : x))}>Next Status</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Order Status Flow</h3>
        <div className="ad_row_actions">{FLOW.map((step) => <span className="ad_chip" key={step}>{step}</span>)}</div>
      </section>
    </div>
  );
}
