import { useState, useMemo, useEffect } from "react";
import { useOrder } from "../../contexts/OrderContext";

const IcView = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;


const FLOW = ["Pending", "Accepted by Chef", "Cooking", "Ready", "Served / Delivered"];

function truncateText(value, maxChars) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.length <= maxChars) return str;
  return str.slice(0, maxChars) + "...";
}

export default function AdminOrderManagement() {
  const { orders, loading, error, fetchOrders, updateOrderStatus, deleteOrder } = useOrder();
  const [editingId, setEditingId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const role = localStorage.getItem("adminRole") || "Super Admin";

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  const statusOptions = useMemo(() => {
    if (role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef") {
      return ["Pending", "Accepted by Chef", "Cooking", "Ready"];
    }
    if (role === "Cafe Waiter" || role === "Restaurant Waiter" || role === "Bar Waiter") {
      return ["Ready", "Served / Delivered"];
    }
    return FLOW;
  }, [role]);

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    const result = await updateOrderStatus(orderId, itemId, newStatus);
    console.log(result,"res");
    

    if (result.success) {
      setEditingId(null);
      const rrr =  await fetchOrders(); 
      console.log(rrr,"rrrrrrrr");
           
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Order Management</h2>
        <p className="ad_p">Loading orders...</p>
      </div>
    );
  }

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
              <th>Waiter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders
              // .filter(filterByRoleAndArea)
              .length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ margin: 0, color: '#666' }}>No orders found for your area</p>
                </td>
              </tr>
            ) : (
              orders
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
                      {orderRow.itemIndex === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div>
                            <button
                              className="rooms__icon_btn"
                              onClick={() => setViewOrder(orderRow)}
                            >
                              <IcView />
                            </button>
                          </div>
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
                    <td>
                      {orderRow.itemIndex === 0 ? (orderRow.tableId?.tableNo || "-") : ""}
                    </td>
                    <td>
                      {orderRow.itemIndex === 0 ? (orderRow.customerName || "Walk-in") : ""}
                    </td>
                    <td>
                      {orderRow.currentItem ? (
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{orderRow.currentItem.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Qty: {orderRow.currentItem.quantity} | ₹{orderRow.currentItem.price}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#666' }}>No items</span>
                      )}
                    </td>
                    <td>
                      <div>
                        {orderRow.itemIndex === 0 ? (orderRow.waiterId?.full_name || "-") : ""}
                      </div>
                    </td>
                    <td>
                      {editingId === `${orderRow._id}-${orderRow.itemIndex}` ? (
                        <select
                          className="ad_input"
                          value={orderRow.status}
                          onChange={(e) =>
                            handleUpdateStatus(orderRow._id, orderRow.currentItem?._id || orderRow.itemIndex, e.target.value)}
                          style={{ padding: "4px 8px", minWidth: "120px" }}
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
                        <span className="ad_chip">{orderRow.status}</span>
                      )}
                    </td>
                    <td>
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
