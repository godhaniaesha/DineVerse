import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useOrder } from "../../contexts/OrderContext";

const IcView = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;

const IcChef = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L6 8C6 11.3142 8.68579 14 12 14C15.3142 14 18 11.3142 18 8V2"/><path d="M6 8C2.68629 8 0 10.6863 0 14C0 17.3137 2.68629 20 6 20H18C21.3137 20 24 17.3137 24 14C24 10.6863 21.3137 8 18 8"/><path d="M9 11L9 14"/><path d="M15 11L15 14"/></svg>;

const IcClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;


const FLOW = ["Pending", "Accepted by Chef", "Preparing", "Ready", "Served / Delivered"];

function truncateText(value, maxChars) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.length <= maxChars) return str;
  return str.slice(0, maxChars) + "...";
}

export default function AdminOrderManagement() {
  const { user } = useAuth();
  const { orders, loading, error, fetchOrders, getAllOrdersForAdmin, getWaiterActiveOrders, fetchChefQueue, updateOrderStatus, deleteOrder } = useOrder();
  const [editingId, setEditingId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const chefName = localStorage.getItem("adminName") || "";
  const chefId = localStorage.getItem("adminId") || "";
  const isChef = role.includes("Chef");
  
  // Search and filter states for Super Admin/Manager
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  
  const AREAS = ["Restaurant", "Cafe", "Bar"];

  useEffect(() => {
    console.log("Current role:", role); // Debug log
    if (role === "Super Admin" || role === "Manager") {
      getAllOrdersForAdmin();
    } else if (role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") {
      getWaiterActiveOrders();
    } else if (role.includes("Chef")) {
      fetchChefQueue(); // Use chef-specific endpoint for chefs
    } else {
      fetchOrders(role);
    }
  }, [role, fetchOrders, getAllOrdersForAdmin, getWaiterActiveOrders, fetchChefQueue]);


  const statusOptions = useMemo(() => {
    if (role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef") {
      return ["Pending", "Accepted by Chef", "Preparing", "Ready"];
    }
    if (role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") {
      return ["Ready", "Served / Delivered"];
    }
    return FLOW;
  }, [role]);

  // Debug: Log orders data
  useEffect(() => {
    console.log("Orders data:", orders);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [orders, loading, error]);

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    const result = await updateOrderStatus(orderId, itemId, newStatus, role);
    console.log(result, "res");

    if (result.success) {
      setEditingId(null);
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  // Filter logic for Super Admin/Manager and Chef
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    // For Chef role, filter orders to only show items assigned to this chef
    if (isChef) {
      console.log("👨‍🍳 Chef Data Check:");
      console.log("- User from useAuth:", user);
      console.log("- User full_name:", user?.full_name);
      console.log("- All Orders:", orders);
      console.log("- Order items:", orders.map(o => o.items).flat());
      
      return orders.map((order) => {
        // Filter items to only show those assigned to this chef (using full_name like AdminKDS.jsx)
        const filteredItems = order.items?.filter(item => {
          console.log(`Item: ${item.name}, chefId: ${item.chefId}, comparing with user: ${user?.full_name}`);
          // Use the same logic as AdminKDS.jsx - compare with user.full_name
          return item.chefId?.full_name === user?.full_name;
        }) || [];
        
        console.log(`Order ${order.orderID} - Filtered items:`, filteredItems.length);
        
        // Return order with only filtered items
        return {
          ...order,
          items: filteredItems
        };
      }).filter((order) => {
        // Only show orders that have items assigned to this chef
        return order.items && order.items.length > 0;
      }).sort((a, b) => {
        // Sort by item createdAt for priority (oldest first = highest priority)
        const aTime = a.items?.[0]?.createdAt ? new Date(a.items[0].createdAt) : new Date(0);
        const bTime = b.items?.[0]?.createdAt ? new Date(b.items[0].createdAt) : new Date(0);
        return aTime - bTime;
      });
    }
    
    // For Super Admin/Manager, apply existing filters
    if (role === "Super Admin" || role === "Manager") {
      return orders.filter((order) => {
        // Area filter
        const matchArea = areaFilter === "All" || order.tableId?.area === areaFilter;
        
        // Search filter - search in order ID, customer name, table, waiter name, and items
        const searchText = search.toLowerCase();
        const orderText = [
          order._id || "",
          order.customerName || "",
          order.tableId?.tableNo || "",
          order.waiterId?.full_name || "",
          order.items?.map(item => item.name).join(" ") || ""
        ].join(" ").toLowerCase();
        
        const matchSearch = !search || orderText.includes(searchText);
        
        return matchArea && matchSearch;
      });
    }
    
    // For other roles (Waiters), return all orders
    return orders;
  }, [orders, role, areaFilter, search, isChef, chefId]);

  return (
    <div className="ad_page">
      <div className="rooms__header"> 
        <div>
          <h2 className="ad_h2">
            {isChef ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IcChef />
                My Kitchen Orders
              </span>
            ) : (
              'Order Management'
            )}
          </h2>
          <p className="ad_p">
            {isChef ? 
              `Dishes assigned to you for preparation` : 
              'Track order flow from creation to completion.'
            }
          </p>
          {isChef && chefName && (
            <p className="ad_p" style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
              Chef: {chefName}
            </p>
          )}
        </div>
      </div>
      {/* Search and Area Filters for Super Admin/Manager */}
      {(role === "Super Admin" || role === "Manager") && (
        <div className="rooms__filters" style={{ marginBottom: 12 }}>
          <input
            className="rooms__search"
            placeholder="Search by order ID, customer, table, waiter, items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300, marginRight: 8 }}
          />
          <select 
            className="rooms__select" 
            value={areaFilter} 
            onChange={(e) => setAreaFilter(e.target.value)} 
            style={{ marginRight: 8 }}
          >
            <option value="All">All Areas</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>{isChef ? "Priority" : "Order ID"}</th>
              {!isChef && <th>Table</th>}
              {!isChef && <th>Customer</th>}
              <th>{isChef ? "Dish Details" : "Items"}</th>
              {isChef && <th>Table</th>}
              {isChef && <th>Order Time</th>}
              {(role === "Super Admin" || role === "Manager") && (
                <th>Waiter</th>
              )}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              // .filter(filterByRoleAndArea)
              .length === 0 ? (
              <tr>
                <td colSpan={role === "Super Admin" || role === "Manager" ? "6" : "7"} style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ margin: 0, color: '#666' }}>No orders found for your area</p>
                </td>
              </tr>
            ) : (
              filteredOrders
                // .filter(filterByRoleAndArea)
                .flatMap((order) =>
                  order.items && order.items.length > 0
                    ? order.items.map((item, itemIndex) => ({
                      ...order,
                      currentItem: item,
                      itemIndex: itemIndex,
                      totalItems: order.items.length
                    }))
                    : [{ ...order, currentItem: null, itemIndex: 0, totalItems: 0 }]
                )
                .map((orderRow, index) => (
                  <tr key={`${orderRow._id}-${orderRow.itemIndex}`}>

                    <td>
                      {isChef ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(() => {
                            const itemCreatedAt = orderRow.currentItem?.createdAt;
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
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(role !== "Super Admin" && role !== "Manager") && (
                            <div>
                              <button
                                className="rooms__icon_btn"
                                onClick={() => setViewOrder(orderRow)}
                              >
                                <IcView />
                              </button>
                            </div>
                          )}
                          <div>
                            {orderRow._id.slice(-8)}
                            {orderRow.totalItems > 1 && (
                              <div style={{ fontSize: '11px', color: '#666' }}>
                                {orderRow.totalItems} items
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {!isChef && (
                      <td>
                        {orderRow.itemIndex === 0 ? (orderRow.tableId?.tableNo || "-") : ""}
                      </td>
                    )}
                    {!isChef && (
                      <td>
                        {orderRow.itemIndex === 0 ? (orderRow.customerName || "Walk-in") : ""}
                      </td>
                    )}
                    <td>
                      {orderRow.currentItem ? (
                        <div>
                          <div style={{ 
                            fontWeight: 'bold',
                            fontSize: isChef ? '14px' : '13px',
                            color: isChef && orderRow.currentItem?.status === 'Pending' ? '#ef4444' : 'inherit'
                          }}>
                            {orderRow.currentItem.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Qty: {orderRow.currentItem.quantity} | ₹{orderRow.currentItem.price}
                            {isChef && (
                              <span style={{ marginLeft: '8px', color: '#9ca3af' }}>
                                • {orderRow.tableId?.area}
                              </span>
                            )}
                          </div>
                          {isChef && orderRow.currentItem?.specialInstructions && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#f59e0b', 
                              marginTop: '4px',
                              fontStyle: 'italic'
                            }}>
                              📝 {orderRow.currentItem.specialInstructions}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#666' }}>No items</span>
                      )}
                    </td>
                    {isChef && (
                      <td>
                        <div style={{ fontSize: '13px' }}>
                          <div>{orderRow.tableId?.tableNo || "-"}</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            {orderRow.tableId?.area || "-"}
                          </div>
                        </div>
                      </td>
                    )}
                    {isChef && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IcClock />
                          {orderRow.currentItem?.createdAt ? new Date(orderRow.currentItem.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : '-'}
                        </div>
                      </td>
                    )}
                    {(role === "Super Admin" || role === "Manager") && (
                      <td>
                        {orderRow.itemIndex === 0
                          ? (orderRow.waiterId?.full_name || "-")
                          : ""}
                      </td>
                    )}
                    <td>
                      {isChef ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className="ad_chip">{orderRow.currentItem?.status || orderRow.status}</span>
                          <button
                            className="ad_btn ad_btn--primary"
                            onClick={() => window.location.href = '/admin/kds'}
                            style={{ padding: "4px 12px" }}
                          >
                            Go to KDS
                          </button>
                        </div>
                      ) : (
                        <>
                          {editingId === `${orderRow._id}-${orderRow.itemIndex}` ? (
                            <select
                              className="ad_input"
                              value={orderRow.status}
                              onChange={(e) =>
                                handleUpdateStatus(orderRow._id, orderRow.currentItem?._id || orderRow.itemIndex, e.target.value)}
                              style={{ padding: "4px 8px", minWidth: "90px", width: "fit-content" }}
                            >
                              <option value={orderRow.status}>{orderRow.status}</option>
                              {statusOptions
                                .filter((opt) => opt !== orderRow.status)
                                .map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <span className="ad_chip">  {orderRow.currentItem?.status || orderRow.status}</span>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      {/* View button only for first row (Admin/Manager) */}
                      {orderRow.itemIndex === 0 && (role === "Super Admin" || role === "Manager") && (
                        <button
                          className="rooms__icon_btn"
                          onClick={() => setViewOrder(orderRow)}
                        >
                          <IcView />
                        </button>
                      )}

                      {/* ✅ Edit button for ALL rows (Waiters) */}
                      {(role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") && (
                        <>
                          {editingId === `${orderRow._id}-${orderRow.itemIndex}` ? (
                            <button
                              className="ad_btn"
                              onClick={() => setEditingId(null)}
                              style={{ marginLeft: 8 }}
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              className="ad_btn ad_btn--primary"
                              onClick={() =>
                                setEditingId(`${orderRow._id}-${orderRow.itemIndex}`)
                              }
                              style={{ marginLeft: 8 }}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* View button for Chef - always visible */}
                      {isChef && (
                        <button
                          className="rooms__icon_btn"
                          onClick={() => setViewOrder(orderRow)}
                          style={{ marginLeft: 8 }}
                        >
                          <IcView />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      {viewOrder && (
        <>

          <div className="rooms__modal_overlay" onClick={() => setViewOrder(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Order Details - {viewOrder._id?.slice(-8) || 'N/A'}</span>
              <button className="rooms__modal_close" onClick={() => setViewOrder(null)}>x</button>
            </div>
            <div className="rooms__detail_grid">
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Table</div>
                <div className="rooms__detail_card_value">{viewOrder.tableId?.tableNo || "-"}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Customer</div>
                <div className="rooms__detail_card_value">{viewOrder.customerName || "Walk-in"}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Waiter</div>
                <div className="rooms__detail_card_value">{viewOrder.waiterId?.full_name || "-"}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Area</div>
                <div className="rooms__detail_card_value">{viewOrder.tableId?.area || "-"}</div>
              </div>
              <div className="rooms__detail_card">
                <div className="rooms__detail_card_label">Status</div>
                <div className="rooms__detail_card_value">
                  <span className="ad_chip">{viewOrder.status}</span>
                </div>
              </div>
            </div>
            <div className="rooms__detail_amenities_label text-nowrap">Items</div>
            <div style={{ padding: "0 20px" }}>
              {viewOrder.items && viewOrder.items.length > 0 ? (
                <div>
                  {viewOrder.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#1b1524', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Quantity: {item.quantity} | Price: ₹{item.price} | Total: ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd', fontWeight: 'bold' }}>
                    Total Amount: ₹{(viewOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#666' }}>No items found</p>
              )}
            </div>
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
