import { useState } from "react";

const ORDER_QUEUE_KEY = "admin-order-queue";
const KITCHEN_FLOW = ["Pending", "Accepted by Chef", "Cooking", "Ready", "Served / Delivered"];
const KDS_SEED_ROWS = [
  { id: "ORD-101", table: "T3", items: "Sandwich, Latte", chef: "Cafe Chef 1", status: "Pending", area: "cafe" },
  { id: "ORD-104", table: "T5", items: "Cappuccino, Garlic Toast", chef: "Cafe Chef 2", status: "Accepted by Chef", area: "cafe" },
  { id: "ORD-102", table: "T8", items: "Steak, Salad", chef: "Restaurant Chef 1", status: "Cooking", area: "restaurant" },
  { id: "ORD-105", table: "R4", items: "Paneer Tikka, Butter Naan", chef: "Restaurant Chef 2", status: "Pending", area: "restaurant" },
  { id: "ORD-103", table: "B2", items: "Mojito, Beer", chef: "Bar Chef 1", status: "Ready", area: "bar" },
  { id: "ORD-106", table: "B6", items: "Cosmopolitan, Fries", chef: "Bar Chef 2", status: "Cooking", area: "bar" },
];

const AREA_BY_ROLE = {
  "Cafe Chef": "cafe",
  "Restaurant Chef": "restaurant",
  "Bar Chef": "bar",
};

export default function AdminKDS() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const roleArea = AREA_BY_ROLE[role] || null;
  const [rows, setRows] = useState(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        return KDS_SEED_ROWS;
      }
    }
    return KDS_SEED_ROWS;
  });

  const canAdvanceFromKds = (status) => ["Pending", "Accepted by Chef", "Cooking"].includes(status);

  const moveKitchenStage = (id) => {
    const updated = rows.map((row) => {
      if (row.id !== id) return row;
      const currentIndex = KITCHEN_FLOW.indexOf(row.status);
      const nextIndex = Math.min(currentIndex + 1, 3);
      return { ...row, status: KITCHEN_FLOW[nextIndex] };
    });
    setRows(updated);
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(updated));
  };

  const visibleRows = rows
    .filter((row) => row.area && (roleArea ? row.area === roleArea : true))
    .filter((row) => ["Pending", "Accepted by Chef", "Cooking", "Ready"].includes(row.status));

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Kitchen Display System</h2>
      <p className="ad_p">Kitchen queue with chef acceptance, cooking, and ready stages.</p>
      <div className="ad_two_col">
        {visibleRows.map((row) => (
          <section className="ad_card" key={row.id}>
            <h3 className="ad_card__title">{row.chef || "Assigned Chef"}</h3>
            <div className="ad_list__item"><span>Order {row.id}</span><span>Table {row.table}</span></div>
            <ul className="ad_list">
              <li className="ad_list__item">{row.items}</li>
            </ul>
            <div className="ad_list__item"><span>Status</span><span>{row.status}</span></div>
            <div className="ad_row_actions">
              {canAdvanceFromKds(row.status) ? (
                <button className="ad_btn ad_btn--primary" onClick={() => moveKitchenStage(row.id)}>
                  {row.status === "Pending"
                    ? "Accept Order"
                    : row.status === "Accepted by Chef"
                      ? "Start Cooking"
                      : "Mark Ready"}
                </button>
              ) : (
                <button className="ad_btn ad_btn--ghost" disabled>
                  Ready for Service
                </button>
              )}
            </div>
          </section>
        ))}
        {visibleRows.length === 0 && <section className="ad_card">No kitchen tickets in queue.</section>}
      </div>
    </div>
  );
}
