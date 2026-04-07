import { useEffect, useState, useMemo } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";

const INITIAL = [
  { id: "ORD-101", table: "T3", customer: "Walk-in", items: "Sandwich, Latte", chef: "Cafe Chef 1", waiter: "Neha", status: "New Order", area: "cafe", time: "19:20", note: "-", total: 360 },
  { id: "ORD-102", table: "T8", customer: "Table 8", items: "Steak, Salad", chef: "Restaurant Chef 1", waiter: "Rohan", status: "Preparing", area: "restaurant", time: "19:35", note: "Medium rare", total: 980 },
  { id: "ORD-103", table: "B2", customer: "Bar", items: "Mojito, Beer", chef: "Bar Chef 1", waiter: "Vikram", status: "Ready", area: "bar", time: "19:50", note: "Less ice", total: 420 },
];
const FLOW = ["New Order", "Preparing", "Ready", "Served", "Completed"];

export default function AdminOrderManagement() {
  const [rows, setRows] = useState(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        return INITIAL;
      }
    }
    return INITIAL;
  });

  const [editingId, setEditingId] = useState(null);
  const role = localStorage.getItem("adminRole") || "Super Admin";

  const statusOptions = useMemo(() => {
    if (role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef") {
      return ["New Order", "Preparing", "Ready"];
    }
    if (role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") {
      return ["Served"];
    }
    return FLOW; // For Super Admin/Manager
  }, [role]);

  const updateStatus = (id, newStatus) => {
    const nextRows = rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row));
    setRows(nextRows);
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(nextRows));
    setEditingId(null);
  };

  useEffect(() => {
    // console logs or extra sync if needed
  }, [rows]);

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Order Management</h2>
      <p className="ad_p">Track order flow from creation to completion.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Chef</th>
              <th>Waiter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
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
                  <td>{row.id}</td>
                  <td>{row.table}</td>
                  <td>{row.customer}</td>
                  <td>{row.items}</td>
                  <td>{row.chef}</td>
                  <td>{row.waiter}</td>
                  <td>
                    {editingId === row.id ? (
                      <select
                        className="ad_input"
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        style={{ padding: "4px 8px", minWidth: "120px" }}
                      >
                        <option value={row.status}>{row.status}</option>
                        {statusOptions
                          .filter((opt) => opt !== row.status)
                          .map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span className="ad_chip">{row.status}</span>
                    )}
                  </td>
                  <td>
                    {editingId === row.id ? (
                      <button className="ad_btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    ) : (
                      <button className="ad_btn ad_btn--primary" onClick={() => setEditingId(row.id)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
