import { useEffect, useState } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";
const FLOW = ["New Order", "Preparing", "Ready", "Served", "Completed"];

export default function ResOrderManage() {
  const [rows, setRows] = useState(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        return [];
      }
    }
    return [];
  });

  const nextStatus = (id) => {
    setRows((prev) => {
      const updated = prev.map((row) => {
        if (row.id === id) {
          const currentIndex = FLOW.indexOf(row.status);
          const nextIndex = Math.min(currentIndex + 1, FLOW.length - 1);
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
              <th>Customer</th>
              <th>Items</th>
              <th>Waiter</th>
              <th>Time</th>
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
                  <td>{row.customer}</td>
                  <td style={{ maxWidth: "200px" }}>{row.items}</td>
                  <td>{row.waiter}</td>
                  <td>{row.time}</td>
                  <td>
                    <span className={`ad_chip ad_chip--${row.status.toLowerCase().replace(" ", "-")}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.status !== "Completed" && (
                      <button
                        className="ad_btn ad_btn--primary"
                        onClick={() => nextStatus(row.id)}
                      >
                        Next Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {rows.filter((row) => row.area === "restaurant").length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                  No active restaurant orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
