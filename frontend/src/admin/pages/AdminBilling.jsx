import { useEffect, useState, useMemo } from "react";
import { MdOutlineClose, MdPayment, MdCheckCircle } from "react-icons/md";

const ORDER_QUEUE_KEY = "admin-order-queue";
const COMPLETED_PAYMENTS_KEY = "admin-completed-payments";

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box" style={{ maxWidth: "500px" }}>
        <div className="rooms__modal_head">
          <span className="rooms__modal_title">{title}</span>
          <button className="rooms__modal_close" onClick={onClose}>x</button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </>
  );
}

export default function AdminBilling() {
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Group "Served" orders by table
  const billingGroups = useMemo(() => {
    const servedOrders = orders.filter(order => order.status === "Served");
    const groups = {};

    servedOrders.forEach(order => {
      const tableKey = order.table || "Walk-in";
      if (!groups[tableKey]) {
        groups[tableKey] = {
          table: tableKey,
          area: order.area,
          customer: order.customer,
          orders: [],
          total: 0
        };
      }
      groups[tableKey].orders.push(order);
      groups[tableKey].total += (order.total || 0);
    });

    return Object.values(groups);
  }, [orders]);

  const handlePay = () => {
    if (!selectedTable) return;

    const tableOrdersIds = selectedTable.orders.map(o => o.id);
    
    // 1. Mark orders as "Completed" and remove from active queue
    const updatedOrders = orders.filter(order => !tableOrdersIds.includes(order.id));
    
    setOrders(updatedOrders);
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(updatedOrders));

    // 2. Store completed payment details
    const completedPayment = {
      id: `BILL-${Date.now().toString().slice(-6)}`,
      table: selectedTable.table,
      area: selectedTable.area,
      customer: selectedTable.customer,
      items: selectedTable.orders.map(o => o.items).flat(), // Assuming items are already stringified
      total: selectedTable.total,
      paymentMethod: paymentMethod,
      timestamp: new Date().toLocaleString(),
      orders: selectedTable.orders.map(o => ({ id: o.id, items: o.items, total: o.total }))
    };

    const savedCompletedPayments = localStorage.getItem(COMPLETED_PAYMENTS_KEY);
    const parsedCompletedPayments = savedCompletedPayments ? JSON.parse(savedCompletedPayments) : [];
    localStorage.setItem(COMPLETED_PAYMENTS_KEY, JSON.stringify([completedPayment, ...parsedCompletedPayments]));

    // 3. Update table status back to "reserved"
    const areaKey = `admin-${selectedTable.area.toLowerCase()}-tables`; // Ensure key matches
    const savedTables = localStorage.getItem(areaKey);
    if (savedTables) {
      const allTables = JSON.parse(savedTables);
      const updatedTables = allTables.map(t => 
        t.tableNo === selectedTable.table ? { ...t, status: "reserved", waiter: "" } : t
      );
      localStorage.setItem(areaKey, JSON.stringify(updatedTables));
    }

    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSelectedTable(null);
    }, 2000);
  };

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Billing & Payments</h2>
      <p className="ad_p">Process bills for tables with served orders.</p>

      <div className="ad_table_wrap" style={{ marginTop: "20px" }}>
        <table className="ad_table">
          <thead>
            <tr>
              <th>Table / Target</th>
              <th>Area</th>
              <th>Orders Count</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billingGroups.map((group) => (
              <tr key={group.table}>
                <td>{group.table}</td>
                <td><span className="ad_chip">{group.area}</span></td>
                <td>{group.orders.length}</td>
                <td>₹{group.total.toLocaleString("en-IN")}</td>
                <td>
                  <button 
                    className="ad_btn ad_btn--primary" 
                    onClick={() => setSelectedTable(group)}
                  >
                    View & Pay
                  </button>
                </td>
              </tr>
            ))}
            {billingGroups.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                  No tables ready for billing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTable && (
        <Modal 
          title={`Bill for ${selectedTable.table}`} 
          onClose={() => !paymentSuccess && setSelectedTable(null)}
        >
          {paymentSuccess ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <MdCheckCircle size={64} color="var(--ad-primary)" />
              <h3 className="ad_h2" style={{ marginTop: "16px" }}>Payment Successful!</h3>
              <p className="ad_p">Bill cleared and table is now available.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h4 className="ad_card__label">Order Summary</h4>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--ad-border)", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                  {selectedTable.orders.map(order => (
                    <div key={order.id} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px dashed var(--ad-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                        <span>{order.id}</span>
                        <span>₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="ad_p" style={{ fontSize: "12px", margin: 0 }}>{order.items}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "16px", background: "var(--ad-bg-2)", borderRadius: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: "700" }}>Total Amount:</span>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--ad-primary)" }}>₹{selectedTable.total.toLocaleString("en-IN")}</span>
              </div>

              <div className="rooms__form_row">
                <label className="rooms__form_label">Payment Method</label>
                <select 
                  className="ad_input" 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / QR">UPI / QR</option>
                  <option value="Card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="rooms__form_actions" style={{ marginTop: "24px" }}>
                <button className="rooms__btn rooms__btn--ghost" onClick={() => setSelectedTable(null)}>Close</button>
                <button 
                  className="rooms__btn rooms__btn--primary" 
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  onClick={handlePay}
                >
                  <MdPayment /> Complete Payment
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
