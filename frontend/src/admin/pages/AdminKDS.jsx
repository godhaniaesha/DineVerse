import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useOrder } from "../../contexts/OrderContext";

const ORDER_QUEUE_KEY = "admin-order-queue";
const KITCHEN_FLOW = ["Pending", "Accepted by Chef", "Preparing", "Ready", "Served / Delivered"];
const KDS_SEED_ROWS = [
  { id: "ORD-101", table: "T3", items: "Sandwich, Latte", chef: "Cafe Chef 1", status: "Pending", area: "cafe" },
  { id: "ORD-104", table: "T5", items: "Cappuccino, Garlic Toast", chef: "Cafe Chef 2", status: "Accepted by Chef", area: "cafe" },
  { id: "ORD-102", table: "T8", items: "Steak, Salad", chef: "Restaurant Chef 1", status: "Preparing", area: "restaurant" },
  { id: "ORD-105", table: "R4", items: "Paneer Tikka, Butter Naan", chef: "Restaurant Chef 2", status: "Pending", area: "restaurant" },
  { id: "ORD-103", table: "B2", items: "Mojito, Beer", chef: "Bar Chef 1", status: "Ready", area: "bar" },
  { id: "ORD-106", table: "B6", items: "Cosmopolitan, Fries", chef: "Bar Chef 2", status: "Preparing", area: "bar" },
];

const AREA_BY_ROLE = {
  "Cafe Chef": "cafe",
  "Restaurant Chef": "restaurant",
  "Bar Chef": "bar",
};
const API_BASE_URL = "http://localhost:8000/api";

const CHEF_ROLES = new Set(["Chef"]);

export default function AdminKDS() {
  const { user } = useAuth();
  const { orders, loading, fetchChefQueue, updateOrderStatus } = useOrder();
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const roleArea = AREA_BY_ROLE[role] || null;
  const isChefRole = CHEF_ROLES.has(role);

  // Format orders to show individual items
  const formattedItems = orders.flatMap(order => 
    order.items.map(item => ({
      orderId: order.orderID,
      orderDbId: order._id,
      itemId: item._id,
      table: order.tableId?.tableNumber || "TBD",
      itemName: item.name,
      quantity: item.quantity,
      chef: item.chefId?.full_name || "Unassigned",
      chefId: item.chefId?._id || null,
      status: item.status,
      area: item.dishId?.area || "restaurant",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }))
  );

  // Fetch orders on component mount
  useEffect(() => {
    fetchChefQueue();
  }, [fetchChefQueue]);

  const canAdvanceFromKds = (status) => ["Pending", "Accepted by Chef", "Preparing"].includes(status);

  const moveKitchenStage = async (orderDbId, itemId, currentStatus) => {
    const order = orders.find(o => o._id === orderDbId);
    if (!order) return;
    
    const item = order.items.find(item => item._id === itemId);
    if (!item) return;
    
    const currentIndex = KITCHEN_FLOW.indexOf(currentStatus);
    const nextIndex = Math.min(currentIndex + 1, KITCHEN_FLOW.length - 1);
    const newStatus = KITCHEN_FLOW[nextIndex];
    
    console.log(`🔄 Updating item ${itemId} from ${currentStatus} to ${newStatus}`);
    
    try {
      // Call the API to update specific item status
      const response = await fetch(`${API_BASE_URL}/orders/update-item-status/${orderDbId}/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          chefId: newStatus === "Accepted by Chef" ? user._id : item.chefId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Successfully updated item status to ${newStatus}`);
        // Refresh the orders to show updated status
        await fetchChefQueue();
      } else {
        console.error('❌ Failed to update item status:', result.msg);
        alert(`Failed to update status: ${result.msg}`);
      }
    } catch (error) {
      console.error('❌ Error updating item status:', error);
      alert('Error updating item status');
    }
  };

  const visibleItems = formattedItems
    .filter((item) => item.area && (roleArea ? item.area === roleArea : true))
    .filter((item) => {
      // For chefs, only show items assigned to them
      const matchChef = !isChefRole || (user && item.chef === user.full_name);
      return matchChef;
    })
    .filter((item) => ["Pending", "Accepted by Chef", "Preparing", "Ready"].includes(item.status))
    .sort((a, b) => {
      // Sort by item createdAt for priority (oldest first = highest priority)
      const aTime = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const bTime = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return aTime - bTime;
    });

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
        {visibleItems.map((item) => (
          <section className="ad_card" key={`${item.orderId}-${item.itemId}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="ad_card__title" style={{ margin: 0 }}>{item.chef || "Assigned Chef"}</h3>
              {(() => {
                const itemCreatedAt = item.createdAt;
                if (!itemCreatedAt) {
                  return (
                    <span style={{ 
                      backgroundColor: '#6b7280', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      UNKNOWN
                    </span>
                  );
                }
                
                const now = new Date();
                const createdTime = new Date(itemCreatedAt);
                const timeDiff = now - createdTime; // Difference in milliseconds
                const minutesDiff = Math.floor(timeDiff / (1000 * 60)); // Convert to minutes
                
                // Priority based on time elapsed
                if (minutesDiff < 5) {
                  return (
                    <span style={{ 
                      backgroundColor: '#10b981', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      LOW
                    </span>
                  );
                } else if (minutesDiff < 15) {
                  return (
                    <span style={{ 
                      backgroundColor: '#f59e0b', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      MED
                    </span>
                  );
                } else {
                  return (
                    <span style={{ 
                      backgroundColor: '#ef4444', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      HIGH
                    </span>
                  );
                }
              })()}
            </div>
            <div className="ad_list__item"><span>Order {item.orderId}</span><span>Table {item.table}</span></div>
            <ul className="ad_list">
              <li className="ad_list__item">{item.itemName} x{item.quantity}</li>
            </ul>
            <div className="ad_list__item"><span>Status</span><span>{item.status}</span></div>
            <div className="ad_row_actions">
              {canAdvanceFromKds(item.status) ? (
                <button className="ad_btn ad_btn--primary" onClick={() => moveKitchenStage(item.orderDbId, item.itemId, item.status)}>
                  {item.status === "Pending"
                    ? "Accept Order"
                    : item.status === "Accepted by Chef"
                      ? "Start Cooking"
                      : item.status === "Preparing"
                        ? "Mark Ready"
                        : "Complete Order"}
                </button>
              ) : (
                <button className="ad_btn ad_btn--ghost" disabled>
                  {item.status === "Ready" ? "Ready for Service" : "Completed"}
                </button>
              )}
            </div>
          </section>
        ))}
        {visibleItems.length === 0 && <section className="ad_card">No kitchen tickets in queue.</section>}

      </div>
    </div>
  );
}
