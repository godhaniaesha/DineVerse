import { useEffect, useState, useMemo } from "react";
import { MdOutlineClose, MdPayment, MdCheckCircle } from "react-icons/md";
import { useOrder } from "../../contexts/OrderContext";

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
  const { getBillingOrders, createBillingPaymentIntent, confirmBillingAndCheckout, loading } = useOrder();
  const [billingData, setBillingData] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [role] = useState(localStorage.getItem("adminRole") || "Super Admin");

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    const area = role === "Super Admin" || role === "Manager" ? undefined : role.split(' ')[0].toLowerCase();
    const result = await getBillingOrders(area);
    if (result.success) {
      setBillingData(result.data);
    }
  };

  // Billing data is already grouped by table from API
  const billingGroups = useMemo(() => {
    return billingData;
  }, [billingData]);

  const handlePay = async () => {
    if (!selectedTable) return;

    try {
      // For each order in the selected table, create billing payment and confirm checkout
      for (const order of selectedTable.orders) {
        // Create billing payment intent
        const paymentResult = await createBillingPaymentIntent(order._id);
        if (paymentResult.success) {
          // Confirm billing and checkout
          await confirmBillingAndCheckout(order._id);
        }
      }

      // Refresh billing data
      await fetchBillingData();

      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedTable(null);
      }, 2000);
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Failed to process payment. Please try again.");
    }
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
