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
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [role] = useState(localStorage.getItem("adminRole") || "Super Admin");
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    fetchBillingData();

    // Load Stripe via CDN
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe('pk_test_51234567890abcdefg');
        setStripe(stripeInstance);
      }
    };
    script.onerror = () => {
      console.error('Failed to load Stripe.js');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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

  const handleViewPay = async (tableData) => {
    setSelectedTable(tableData);
    setPaymentDetails(null);
    setCustomerEmail("");

    // For each order in the selected table, create billing payment intent
    try {
      setProcessingPayment(true);
      const paymentPromises = tableData.orders.map(order =>
        createBillingPaymentIntent(order._id)
      );

      const results = await Promise.all(paymentPromises);
      const successfulPayments = results.filter(result => result.success);

      if (successfulPayments.length > 0) {
        // Combine all payment details with order._id
        const combinedDetails = {
          orders: successfulPayments.map((result, index) => ({
            ...result.data,
            _id: tableData.orders[index]._id // Include original order._id
          })),
          totalOriginalAmount: successfulPayments.reduce((sum, result) => sum + result.data.originalAmount, 0),
          totalDiscount: successfulPayments.reduce((sum, result) => sum + result.data.discount, 0),
          totalPayable: successfulPayments.reduce((sum, result) => sum + result.data.payableAmount, 0),
          table: tableData.table,
          area: tableData.area
        };
        setPaymentDetails(combinedDetails);
      }
    } catch (error) {
      console.error("Payment intent error:", error);
      alert("Failed to create payment intent. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleStripePayment = async () => {
    if (!paymentDetails || paymentDetails.orders.length === 0) return;
    console.log("paymentDetails", paymentDetails, "||" , paymentDetails.orders);

    try {
      // setProcessingPayment(true);

      // if (!stripe) {
      //   throw new Error('Stripe is not loaded. Please refresh the page and try again.');
      // }

      // // Use the first order's client secret for payment
      // const firstOrder = paymentDetails.orders[0];

      // if (firstOrder.clientSecret) {
      //   const { error } = await stripe.confirmPayment({
      //     clientSecret: firstOrder.clientSecret,
      //     confirmParams: {
      //       return_url: `${window.location.origin}/billing-success`,
      //       payment_method_data: {
      //         billing_details: {
      //           email: customerEmail || 'customer@example.com',
      //         },
      //       },
      //     },
      //   });

      //   if (error) {
      //     throw new Error(error.message);
      //   }

        // Payment successful, confirm checkout for all orders
        for (const order of paymentDetails.orders) {
          console.log("order", order);
          
          await confirmBillingAndCheckout(order._id, {
            paymentIntentId: order.paymentIntentId,
            paymentMethod: paymentMethod, // Use the actual selected payment method
            customerEmail: customerEmail || 'customer@example.com'
          });
        }

        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          setSelectedTable(null);
          setPaymentDetails(null);
        }, 2000);

        await fetchBillingData();
      // }
    } catch (error) {
      console.error("Stripe payment error:", error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentDetails || paymentDetails.orders.length === 0) return;

    try {
      setProcessingPayment(true);

      // For UPI, Card, and NetBanking, use Stripe payment
      await handleStripePayment();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
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
                    onClick={() => handleViewPay(group)}
                    disabled={processingPayment}
                  >
                    {processingPayment ? "Loading..." : "View & Pay"}
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
        <>
          <div className="rooms__modal_overlay" onClick={() => !paymentSuccess && setSelectedTable(null)} />
          <div className="rooms__modal_box" style={{ maxWidth: "600px", width: "90%" }}>
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Payment Details - {selectedTable.table}</span>
              <button className="rooms__modal_close" onClick={() => !paymentSuccess && setSelectedTable(null)}>x</button>
            </div>
            <div style={{ padding: "20px" }}>
              {paymentSuccess ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <MdCheckCircle size={64} color="var(--ad-primary)" />
                  <h3 className="ad_h2" style={{ marginTop: "16px" }}>Payment Successful!</h3>
                  <p className="ad_p">Bill cleared and table is now available.</p>
                </div>
              ) : paymentDetails ? (
                <div>
                  {/* Order Summary */}
                  <div style={{ marginBottom: "24px" }}>
                    <h4 className="ad_card__label">Order Summary</h4>
                    <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--ad-border)", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                      {selectedTable.orders.map(order => (
                        <div key={order.id} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px dashed var(--ad-border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "8px" }}>
                            <span>Order {order.id}</span>
                            <span>₹{order.total.toLocaleString("en-IN")}</span>
                          </div>
                          {/* Display individual items */}
                          {Array.isArray(order.items) ? (
                            order.items.map((item, index) => (
                              <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "14px" }}>
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: "13px", color: "#aaa" }}>
                              {order.items}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px", padding: "16px", background: "var(--ad-bg-2)", borderRadius: "8px" }}>
                    <div>
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Original Amount</div>
                      <div style={{ fontSize: "18px", fontWeight: "600" }}>₹{paymentDetails.totalOriginalAmount.toLocaleString("en-IN")}</div>
                    </div>
                    {paymentDetails.totalDiscount > 0 && (
                      <div>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Discount Applied</div>
                        <div style={{ fontSize: "18px", fontWeight: "600", color: "#4CAF50" }}>-₹{paymentDetails.totalDiscount.toLocaleString("en-IN")}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Total Payable</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--ad-primary)" }}>₹{paymentDetails.totalPayable.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  {/* Customer Email */}
                  <div className="rooms__form_row" style={{ marginBottom: "24px" }}>
                    <label className="rooms__form_label">Customer Email (Optional)</label>
                    <input
                      type="email"
                      className="ad_input"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="rooms__form_row" style={{ marginBottom: "24px" }}>
                    <label className="rooms__form_label">Payment Method</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
                      <button
                        className={`ad_btn ${paymentMethod === "UPI" ? "ad_btn--primary" : ""}`}
                        onClick={() => setPaymentMethod("UPI")}
                        style={{ padding: "12px" }}
                        disabled={paymentDetails.totalPayable === 0 || !stripe}
                      >
                        📱 UPI
                      </button>
                      <button
                        className={`ad_btn ${paymentMethod === "Card" ? "ad_btn--primary" : ""}`}
                        onClick={() => setPaymentMethod("Card")}
                        style={{ padding: "12px" }}
                        disabled={paymentDetails.totalPayable === 0 || !stripe}
                      >
                        💳 Card
                      </button>
                      <button
                        className={`ad_btn ${paymentMethod === "NetBanking" ? "ad_btn--primary" : ""}`}
                        onClick={() => setPaymentMethod("NetBanking")}
                        style={{ padding: "12px" }}
                        disabled={paymentDetails.totalPayable === 0 || !stripe}
                      >
                        🏦 NetBanking
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                      className="ad_btn"
                      onClick={() => setSelectedTable(null)}
                      disabled={processingPayment}
                    >
                      Cancel
                    </button>
                    <button
                      className="ad_btn ad_btn--primary"
                      onClick={handleStripePayment}
                      disabled={processingPayment}
                      style={{ minWidth: "120px" }}
                    >
                      {processingPayment
                        ? "Processing..."
                        : `Pay ₹${paymentDetails.totalPayable.toLocaleString("en-IN")}`}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div className="ad_spinner" style={{ margin: "0 auto 16px" }}></div>
                  <p className="ad_p">Loading payment details...</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
