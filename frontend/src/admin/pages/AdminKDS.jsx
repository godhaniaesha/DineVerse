import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useOrder } from "../../contexts/OrderContext";

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

const CHEF_ROLES = new Set(["Chef"]);

export default function AdminKDS() {
  const { user } = useAuth();
  const { orders, loading, fetchChefQueue, updateOrderStatus } = useOrder();
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const roleArea = AREA_BY_ROLE[role] || null;
  const isChefRole = CHEF_ROLES.has(role);

  // Format orders to match KDS structure
  const formattedOrders = orders.map(order => ({
    id: order.orderID,
    table: order.tableId?.tableNumber || "TBD",
    items: order.items.map(item => `${item.name} x${item.quantity}`).join(", "),
    chef: order.items.find(item => item.chefId)?.chefId?.full_name || "Unassigned",
    status: order.items.find(item => ["Pending", "Accepted by Chef", "Preparing", "Ready"].includes(item.status))?.status || "Pending",
    area: order.items.find(item => item.dishId?.area)?.dishId?.area || "restaurant"
  }));

  // Fetch orders on component mount
  useEffect(() => {
    fetchChefQueue();
  }, [fetchChefQueue]);

  const canAdvanceFromKds = (status) => ["Pending", "Accepted by Chef", "Cooking"].includes(status);

  const moveKitchenStage = async (id) => {
    const order = orders.find(o => o.orderID === id);
    if (!order) return;
    
    // Find the first pending item to update
    const pendingItem = order.items.find(item => ["Pending", "Accepted by Chef", "Preparing"].includes(item.status));
    if (!pendingItem) return;
    
    const currentIndex = KITCHEN_FLOW.indexOf(pendingItem.status);
    const nextIndex = Math.min(currentIndex + 1, 3);
    const newStatus = KITCHEN_FLOW[nextIndex];
    
    await updateOrderStatus(order._id, newStatus);
  };

  const visibleRows = formattedOrders
    .filter((row) => row.area && (roleArea ? row.area === roleArea : true))
    .filter((row) => {
      // For chefs, only show orders assigned to them
      const matchChef = !isChefRole || (user && row.chef && row.chef.includes(user.full_name));
      return matchChef;
    })
    .filter((row) => ["Pending", "Accepted by Chef", "Cooking", "Ready"].includes(row.status));

  if (loading) {
    return (
      <div className="ad_page">
        <div className="ad_h2">Loading Kitchen Queue...</div>
      </div>
    );
  }

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
