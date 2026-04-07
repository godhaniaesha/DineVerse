import { useState } from "react";

const INITIAL = [
  { id: "ORD-101", table: "T3", customer: "Walk-in", items: "Sandwich, Latte", chef: "Cafe Chef 1", waiter: "Neha", status: "New Order", area: "cafe", time: "19:20" },
  { id: "ORD-102", table: "T8", customer: "Table 8", items: "Steak, Salad", chef: "Restaurant Chef 1", waiter: "Rohan", status: "Preparing", area: "restaurant", time: "19:35" },
  { id: "ORD-103", table: "B2", customer: "Bar", items: "Mojito, Beer", chef: "Bar Chef 1", waiter: "Vikram", status: "Ready", area: "bar", time: "19:50" },
];
const FLOW = ["New Order", "Preparing", "Ready", "Served", "Completed"];

export default function AdminOrderManagement() {
  const [rows, setRows] = useState(INITIAL);
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const nextStatus = (status) => FLOW[Math.min(FLOW.indexOf(status) + 1, FLOW.length - 1)];
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Order Management</h2>
      <p className="ad_p">Track order flow from creation to completion.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Order ID</th><th>Table</th><th>Customer</th><th>Items</th><th>Chef</th><th>Waiter</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {rows
              .filter((row) => {
                if (role === "Cafe Chef") return row.area === "cafe";
                if (role === "Restaurant Chef") return row.area === "restaurant";
                if (role === "Bar Chef") return row.area === "bar";
                return true;
              })
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td><td>{row.table}</td><td>{row.customer}</td><td>{row.items}</td><td>{row.chef}</td><td>{row.waiter}</td><td><span className="ad_chip">{row.status}</span></td>
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
