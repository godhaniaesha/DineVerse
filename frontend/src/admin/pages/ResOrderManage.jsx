import { useState } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";
const FLOW = ["Pending", "Accepted by Chef", "Cooking", "Ready", "Served / Delivered"];
const IcView = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const RES_SEED_ROWS = [
  { id: "ORD-102", table: "T8", customer: "Table 8", items: "Steak, Salad", waiter: "Rohan", time: "19:35", status: "Cooking", area: "restaurant" },
  { id: "ORD-105", table: "R4", customer: "Table 4", items: "Paneer Tikka, Butter Naan", waiter: "Karan", time: "20:10", status: "Pending", area: "restaurant" },
  { id: "ORD-108", table: "R9", customer: "Room 304", items: "Dal Fry, Jeera Rice", waiter: "Rohan", time: "20:16", status: "Ready", area: "restaurant" },
  { id: "ORD-111", table: "R6", customer: "Family Table", items: "Manchurian, Hakka Noodles", waiter: "Karan", time: "20:25", status: "Accepted by Chef", area: "restaurant" },
];

function truncateText(value, maxChars) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.length <= maxChars) return str;
  return str.slice(0, maxChars) + "...";
}

export default function ResOrderManage() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const [rows, setRows] = useState(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        return RES_SEED_ROWS;
      }
    }
    return RES_SEED_ROWS;
  });

  const [viewOrder, setViewOrder] = useState(null);

  const nextStatus = (id) => {
    setRows((prev) => {
      const updated = prev.map((row) => {
        if (row.id === id) {
          const currentIndex = FLOW.indexOf(row.status);
          const nextByRole = role === "Restaurant Chef" ? 3 : FLOW.length - 1;
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
          <h2 className="ad_h2">Restaurant Order Management</h2>
          <p className="ad_p">Track and manage restaurant orders.</p>
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
              .filter((row) => row.area === "restaurant")
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.table}</td>
                  <td style={{ maxWidth: "200px" }} title={String(row.items)}>
                    {truncateText(row.items, 15)}
                  </td>
                  <td>{row.status === "Ready" || row.status === "Served / Delivered" ? row.waiter : "Not Assigned"}</td>
                  <td>
                    <span className={`ad_chip ad_chip--${row.status.toLowerCase().replace(" ", "-")}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="rooms__icon_btn"
                      onClick={() => setViewOrder(row)}
                    >
                      <IcView />
                    </button>
                    {row.status !== "Served / Delivered" &&
                      (role !== "Restaurant Chef" || row.status !== "Ready") && (
                        <button
                          className="ad_btn ad_btn--primary"
                          onClick={() => nextStatus(row.id)}
                          style={{ marginLeft: 8 }}
                        >
                          {role === "Restaurant Chef" ? "Move Kitchen Stage" : "Next Status"}
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            {rows.filter((row) => row.area === "restaurant").length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No active restaurant orders.
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
