import { useState, useMemo } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";

const INITIAL = [
  { id: "ORD-101", table: "T3", customer: "Walk-in", items: "Sandwich, Latte", chef: "Cafe Chef 1", waiter: "Neha", status: "Pending", area: "cafe", time: "19:20", note: "-", total: 360 },
  { id: "ORD-102", table: "T8", customer: "Table 8", items: "Steak, Salad", chef: "Restaurant Chef 1", waiter: "Rohan", status: "Cooking", area: "restaurant", time: "19:35", note: "Medium rare", total: 980 },
  { id: "ORD-103", table: "B2", customer: "Bar", items: "Mojito, Beer", chef: "Bar Chef 1", waiter: "Vikram", status: "Ready", area: "bar", time: "19:50", note: "Less ice", total: 420 },
  { id: "ORD-104", table: "T5", customer: "Table 5", items: "Cappuccino, Garlic Toast", chef: "Cafe Chef 2", waiter: "Asha", status: "Accepted by Chef", area: "cafe", time: "20:05", note: "Extra hot", total: 340 },
  { id: "ORD-105", table: "R4", customer: "Table 4", items: "Paneer Tikka, Butter Naan", chef: "Restaurant Chef 2", waiter: "Karan", status: "Pending", area: "restaurant", time: "20:10", note: "Less spicy", total: 860 },
  { id: "ORD-106", table: "B6", customer: "Bar Lounge", items: "Cosmopolitan, Fries", chef: "Bar Chef 2", waiter: "Meera", status: "Cooking", area: "bar", time: "20:12", note: "No olives", total: 590 },
  { id: "ORD-107", table: "T2", customer: "Takeaway", items: "Cold Coffee, Veg Wrap", chef: "Cafe Chef 1", waiter: "Neha", status: "Served / Delivered", area: "cafe", time: "20:14", note: "Packed", total: 410 },
  { id: "ORD-108", table: "R9", customer: "Room 304", items: "Dal Fry, Jeera Rice", chef: "Restaurant Chef 1", waiter: "Rohan", status: "Ready", area: "restaurant", time: "20:16", note: "Room service", total: 730 },
  { id: "ORD-109", table: "B4", customer: "Bar Table 4", items: "Virgin Mojito, Nachos", chef: "Bar Chef 1", waiter: "Vikram", status: "Accepted by Chef", area: "bar", time: "20:18", note: "-", total: 510 },
];
const FLOW = ["Pending", "Accepted by Chef", "Cooking", "Ready", "Served / Delivered"];

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
  const [viewOrder, setViewOrder] = useState(null);
  const role = localStorage.getItem("adminRole") || "Super Admin";

  const statusOptions = useMemo(() => {
    if (role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef") {
      return ["Pending", "Accepted by Chef", "Cooking", "Ready"];
    }
    if (role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") {
      return ["Ready", "Served / Delivered"];
    }
    return FLOW;
  }, [role]);

  const updateStatus = (id, newStatus) => {
    const nextRows = rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row));
    setRows(nextRows);
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(nextRows));
    setEditingId(null);
  };

  const filterByRoleAndArea = (row) => {
    if (role === "Cafe Chef" || role === "Cafe Waiter") return row.area === "cafe";
    if (role === "Restaurant Chef" || role === "Restaurant Waiter") return row.area === "restaurant";
    if (role === "Bar Chef" || role === "Bar Waiter") return row.area === "bar";
    return true;
  };

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
              <th>Items</th>
              <th>Chef</th>
              <th>Waiter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter(filterByRoleAndArea)
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.table}</td>
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
                    <button
                      className="rooms__icon_btn"
                      title="View order"
                      onClick={() => setViewOrder(row)}
                    >
                      👁
                    </button>
                    {editingId === row.id ? (
                      <button className="ad_btn" onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>
                        Cancel
                      </button>
                    ) : (
                      <button className="ad_btn ad_btn--primary" onClick={() => setEditingId(row.id)} style={{ marginLeft: 8 }}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {viewOrder && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setViewOrder(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Order Details - {viewOrder.id}</span>
              <button className="rooms__modal_close" onClick={() => setViewOrder(null)}>x</button>
            </div>
            <div className="rooms__detail_grid">
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Table</div>
                <div className="rooms__detail_card_value">{viewOrder.table}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Customer</div>
                <div className="rooms__detail_card_value">{viewOrder.customer}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Time</div>
                <div className="rooms__detail_card_value">{viewOrder.time}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Total</div>
                <div className="rooms__detail_card_value">₹{viewOrder.total?.toLocaleString("en-IN")}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Status</div>
                <div className="rooms__detail_card_value">
                  <span className="ad_chip">{viewOrder.status}</span>
                </div>
              </div>
            </div>
            <div className="rooms__detail_amenities_label">Items</div>
            <p style={{ padding: "0 20px" }}>{viewOrder.items}</p>
            {viewOrder.note && (
              <p style={{ padding: "0 20px 20px", color: "#999" }}>Note: {viewOrder.note}</p>
            )}
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--primary" onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
