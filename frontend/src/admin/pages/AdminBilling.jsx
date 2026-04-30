import { useEffect, useState, useMemo } from "react";
import { MdOutlineClose, MdPayment, MdCheckCircle } from "react-icons/md";
import { useOrder } from "../../contexts/OrderContext";
import { FaCreditCard, FaPaypal } from "react-icons/fa6";
import { AiFillBank } from "react-icons/ai";

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
const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#bbb",
  borderBottom: "1px solid #3a3a4a"
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
  borderBottom: "1px solid #2a2a3a"
};

const rowStyle = {
  transition: "0.2s",
};

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
  const [errors, setErrors] = useState({});

  // Payment method specific states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

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

    let newErrors = {};

    // ✅ Email validation
    if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
      newErrors.customerEmail = "Enter valid email";
    }

    // ✅ UPI
    if (paymentMethod === "UPI") {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
      if (!upiId || !upiRegex.test(upiId)) {
        newErrors.upiId = "Enter valid UPI ID";
      }
    }

    // ✅ Card
    if (paymentMethod === "Card") {
      const cleanCard = cardNumber.replace(/\s/g, "");

      if (!/^\d{16}$/.test(cleanCard)) {
        newErrors.cardNumber = "Card must be 16 digits";
      }

      const expiryMatch = cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
      if (!expiryMatch) {
        newErrors.cardExpiry = "Format MM/YY";
      } else {
        const [month, year] = cardExpiry.split("/");
        const now = new Date();
        const expiryDate = new Date(`20${year}`, month - 1); // ✅ FIXED

        if (expiryDate <= now) {
          newErrors.cardExpiry = "Card expired";
        }
      }

      if (!/^\d{3}$/.test(cardCvv)) {
        newErrors.cardCvv = "CVV must be 3 digits";
      }
    }

    // ✅ NetBanking
    if (paymentMethod === "NetBanking") {
      if (!bankName) {
        newErrors.bankName = "Select bank";
      }

      const nameRegex = /^[A-Za-z\s]+$/;

      if (
        !accountHolderName ||
        accountHolderName.trim().length < 3 ||
        !nameRegex.test(accountHolderName.trim())
      ) {
        newErrors.accountHolderName = "Enter valid name (letters only)";
      }
    }

    // ❌ Stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setProcessingPayment(true);

      for (const order of paymentDetails.orders) {
        await confirmBillingAndCheckout(order._id, {
          paymentIntentId: order.paymentIntentId,
          paymentMethod,
          customerEmail
        });
      }

      setPaymentSuccess(true);

      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedTable(null);
        setPaymentDetails(null);
      }, 2000);

      await fetchBillingData();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
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
            <div className="px-3 py-3 sm:px-0">
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
                    <h4 className="ad_card__label" style={{ marginBottom: "10px" }}>
                      Order Summary
                    </h4>

                    <div
                      style={{
                        border: "1px solid #2a2a3a",
                        borderRadius: "10px",
                        overflowX: "auto",
                        background: "#1e1e2f"
                      }}
                    >
                      <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>

                        {/* HEADER */}
                        <thead style={{ background: "#1b1524" }}>
                          <tr>
                            <th style={thStyle}>Order</th>
                            <th style={thStyle}>Item</th>
                            <th style={thStyle}>Qty</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Total</th>
                          </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                          {selectedTable.orders.map((order, orderIndex) => {
                            // Handle both array and string formats for items
                            let items = [];
                            if (Array.isArray(order.items)) {
                              items = order.items;
                            } else if (typeof order.items === "string") {
                              // Parse string format: "Item1 x2, Item2 x1"
                              items = order.items.split(",").map(itemStr => {
                                const parts = itemStr.trim().split(" x");
                                return {
                                  name: parts[0] || "",
                                  quantity: parseInt(parts[1]) || 1,
                                  price: 0 // Default price for string format
                                };
                              });
                            }

                            if (!items.length) {
                              return (
                                <tr key={order._id}>
                                  <td colSpan="5" style={{ ...tdStyle, color: "#888", textAlign: "center" }}>
                                    No items found
                                  </td>
                                </tr>
                              );
                            }

                            return items.map((item, itemIndex) => (
                              <tr
                                key={`${order._id}-${itemIndex}`}
                                style={{
                                  ...rowStyle,
                                  backgroundColor: orderIndex % 2 === 0 ? "#1b15247a" : "transparent"
                                }}
                              >
                                {/* ORDER */}
                                <td style={tdStyle}>
                                  {itemIndex === 0 && (
                                    <div>
                                      <div style={{ fontSize: "11px", textWrap: "nowrap" }}>
                                        Table {selectedTable.table}
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* ITEM */}
                                <td style={tdStyle}>
                                  <div>
                                    <div style={{ fontWeight: "500" }}>{item.name}</div>
                                    {item.customization && (
                                      <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
                                        {item.customization}
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* QTY */}
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                  {item.quantity}
                                </td>

                                {/* PRICE */}
                                <td style={{ ...tdStyle, textAlign: "right" }}>
                                  Rs.{item.price || 0}
                                </td>

                                {/* TOTAL */}
                                <td style={{ ...tdStyle, textAlign: "right", fontWeight: "600" }}>
                                  Rs.{(item.price || 0) * (item.quantity || 0)}
                                </td>
                              </tr>
                            ));
                          })}
                        </tbody>

                        {/* FOOTER TOTAL */}
                        <tfoot style={{ background: "#1b1524" }}>
                          <tr>
                            <td colSpan="4" style={{ ...tdStyle, textAlign: "right" }}>
                              Grand Total
                            </td>
                            <td style={{ ...tdStyle, fontWeight: "bold", color: "#4ade80", textAlign: "right" }}>
                              Rs.{paymentDetails?.totalPayable.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        </tfoot>

                      </table>
                    </div>
                  </div>

                  {/* Customer Email */}
                  <div className="rooms__form_row" style={{ marginBottom: "24px" }}>
                    <label className="rooms__form_label">Customer Email</label>
                    <input
                      type="email"
                      className="ad_input"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
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
                       <FaPaypal /> UPI
                      </button>
                      <button
                        className={`ad_btn ${paymentMethod === "Card" ? "ad_btn--primary" : ""}`}
                        onClick={() => setPaymentMethod("Card")}
                        style={{ padding: "12px" }}
                        disabled={paymentDetails.totalPayable === 0 || !stripe}
                      >
                        <FaCreditCard /> Card
                      </button>
                      <button
                        className={`ad_btn ${paymentMethod === "NetBanking" ? "ad_btn--primary" : ""}`}
                        onClick={() => setPaymentMethod("NetBanking")}
                        style={{ padding: "12px" }}
                        disabled={paymentDetails.totalPayable === 0 || !stripe}
                      >
                       <AiFillBank /> NetBanking
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Specific Fields */}
                  <div className="rooms__form_row" style={{ marginBottom: "24px" }}>
                    {paymentMethod === "UPI" && (
                      <div>
                        <label className="rooms__form_label">UPI ID</label>
                        <input
                          type="text"
                          className="ad_input"
                          placeholder="Enter UPI ID (e.g., user@paytm)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {paymentMethod === "Card" && (
                      <div style={{ display: "grid", gap: "16px" }}>
                        <div>
                          <label className="rooms__form_label">Card Number</label>
                          <input
                            type="text"
                            className="ad_input"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "").slice(0, 16);
                              value = value.replace(/(.{4})/g, "$1 ").trim();

                              setCardNumber(value);
                              setErrors(prev => ({ ...prev, cardNumber: "" }));
                            }}
                            maxLength="19"
                            required
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label className="rooms__form_label">Expiry Date</label>
                            <input
                              type="text"
                              className="ad_input"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                if (value.length >= 3) {
                                  value = value.slice(0, 2) + "/" + value.slice(2);
                                }

                                setCardExpiry(value);
                                setErrors(prev => ({ ...prev, cardExpiry: "" }));
                              }}
                              maxLength="5"
                              required
                            />
                          </div>
                          <div>
                            <label className="rooms__form_label">CVV</label>
                            <input
                              type="text"
                              className="ad_input"
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                                setCardCvv(value);
                                setErrors(prev => ({ ...prev, cardCvv: "" }));
                              }}
                              maxLength="3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "NetBanking" && (
                      <div style={{ display: "grid", gap: "16px" }}>
                        <div>
                          <label className="rooms__form_label">Select Bank</label>
                          <select
                            className="ad_input"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            required
                          >
                            <option value="">Select Bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="Axis">Axis Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                            <option value="BOB">Bank of Baroda</option>
                            <option value="Kotak">Kotak Mahindra Bank</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="rooms__form_label">Account Holder Name</label>
                          <input
                            type="text"
                            className="ad_input"
                            placeholder="Enter account holder name"
                            value={accountHolderName}
                            onChange={(e) => {
                              setAccountHolderName(e.target.value);
                              setErrors(prev => ({ ...prev, accountHolderName: "" }));
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="rooms__form_label">Amount</label>
                          <input
                            type="text"
                            className="ad_input"
                            value={`${paymentDetails.totalPayable.toLocaleString("en-IN")}`}
                            readOnly
                          />
                        </div>
                      </div>
                    )}
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
