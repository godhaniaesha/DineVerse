import { useState } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";
const FLOW = ["Pending", "Accepted by Chef", "Cooking", "Ready", "Served / Delivered"];
const CAFE_SEED_ROWS = [
  { id: "ORD-101", table: "T3", customer: "Walk-in", items: "Sandwich, Latte", waiter: "Neha", time: "19:20", status: "Pending", area: "cafe" },
  { id: "ORD-104", table: "T5", customer: "Table 5", items: "Cappuccino, Garlic Toast", waiter: "Asha", time: "20:05", status: "Accepted by Chef", area: "cafe" },
  { id: "ORD-107", table: "T2", customer: "Takeaway", items: "Cold Coffee, Veg Wrap", waiter: "Neha", time: "20:14", status: "Served / Delivered", area: "cafe" },
  { id: "ORD-110", table: "C7", customer: "Cafe Corner", items: "Muffin, Espresso", waiter: "Asha", time: "20:22", status: "Cooking", area: "cafe" },
];

export default function CafeOrderManage() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const [rows, setRows] = useState(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        return CAFE_SEED_ROWS;
      }
    }
    return CAFE_SEED_ROWS;
  });

  const [viewOrder, setViewOrder] = useState(null);

  const nextStatus = (id) => {
    setRows((prev) => {
      const updated = prev.map((row) => {
        if (row.id === id) {
          const currentIndex = FLOW.indexOf(row.status);
          const nextByRole = role === "Cafe Chef" ? 3 : FLOW.length - 1;
          const nextIndex = Math.min(currentIndex + 1, nextByRole);
          return { ...row, status: FLOW[nextIndex] };
        }
        return row;
      });
      localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Cafe Order Management</h2>
          <p className="ad_p">Track and manage cafe orders.</p>
        </div>
      </div>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Items</th>
              <th>Waiter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((row) => row.area === "cafe")
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.table}</td>
                  <td style={{ maxWidth: "200px" }}>{row.items}</td>
                  <td>{row.status === "Ready" || row.status === "Served / Delivered" ? row.waiter : "Not Assigned"}</td>
                  <td>
                    <span className={`ad_chip ad_chip--${row.status.toLowerCase().replace(" ", "-")}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="rooms__icon_btn"
                      title="View order"
                      onClick={() => setViewOrder(row)}
                    >
                      👁
                    </button>
                    {row.status !== "Served / Delivered" &&
                      (role !== "Cafe Chef" || row.status !== "Ready") && (
                        <button
                          className="ad_btn ad_btn--primary"
                          onClick={() => nextStatus(row.id)}
                          style={{ marginLeft: 8 }}
                        >
                          {role === "Cafe Chef" ? "Move Kitchen Stage" : "Next Status"}
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            {rows.filter((row) => row.area === "cafe").length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No active cafe orders.
                </td>
              </tr>
            )}
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
                <div className="rooms__detail_card_label">Status</div>
                <div className="rooms__detail_card_value">
                  <span className={`ad_chip ad_chip--${viewOrder.status.toLowerCase().replace(" ", "-")}`}>
                    {viewOrder.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="rooms__detail_amenities_label">Items</div>
            <p style={{ padding: "0 20px 20px" }}>{viewOrder.items}</p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--primary" onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
