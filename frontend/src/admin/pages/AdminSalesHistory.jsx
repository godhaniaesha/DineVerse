import { useEffect, useState } from "react";

const COMPLETED_PAYMENTS_KEY = "admin-completed-payments";

const INITIAL_SALES = [
  {
    id: "BILL-1001",
    table: "T3",
    area: "Cafe",
    customer: "Walk-in",
    items: "Truffle Fries x1, Cold Brew Tonic x1",
    total: 580,
    paymentMethod: "UPI / QR",
    timestamp: "2026-04-08, 14:20:00",
    orders: [
      { id: "CAFE-211306", items: "Truffle Fries x1", total: 280 },
      { id: "CAFE-957147", items: "Cold Brew Tonic x1", total: 300 }
    ]
  },
  {
    id: "BILL-1002",
    table: "R2",
    area: "Restaurant",
    customer: "John Doe",
    items: "Paneer Tikka x1, Butter Naan x2",
    total: 450,
    paymentMethod: "Cash",
    timestamp: "2026-04-08, 15:10:00",
    orders: [
      { id: "RES-44123", items: "Paneer Tikka x1, Butter Naan x2", total: 450 }
    ]
  },
  {
    id: "BILL-1003",
    table: "B1",
    area: "Bar",
    customer: "Alice",
    items: "Mocktail x2",
    total: 400,
    paymentMethod: "Card",
    timestamp: "2026-04-08, 16:05:00",
    orders: [
      { id: "BAR-77812", items: "Mocktail x2", total: 400 }
    ]
  }
];

const IcView = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

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

export default function AdminSalesHistory() {
  const [completedPayments, setCompletedPayments] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const savedPayments = localStorage.getItem(COMPLETED_PAYMENTS_KEY);
    if (savedPayments) {
      setCompletedPayments(JSON.parse(savedPayments));
    } else {
      setCompletedPayments(INITIAL_SALES);
      localStorage.setItem(COMPLETED_PAYMENTS_KEY, JSON.stringify(INITIAL_SALES));
    }
  }, []);

  const close = () => setSelectedBill(null);

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Completed Payments</h2>
      <p className="ad_p">View history of all completed bills and payments.</p>

      <div className="ad_table_wrap" style={{ marginTop: "20px" }}>
        <table className="ad_table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Table / Target</th>
              <th>Area</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {completedPayments.length > 0 ? (
              completedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.table}</td>
                  <td><span className="ad_chip">{payment.area}</span></td>
                  <td>{payment.customer}</td>
                  <td>₹{payment.total.toLocaleString("en-IN")}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.timestamp}</td>
                  <td>
                    <button className="rooms__icon_btn" title="View Bill" onClick={() => setSelectedBill(payment)}>
                      <IcView />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                  No completed payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedBill && (
        <Modal title={`Bill Details - ${selectedBill.id}`} onClose={close}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="ad_card__label" style={{ fontSize: "11px" }}>Table</label>
                <div className="ad_p" style={{ color: "var(--ad-text-1)" }}>{selectedBill.table} ({selectedBill.area})</div>
              </div>
              <div>
                <label className="ad_card__label" style={{ fontSize: "11px" }}>Customer</label>
                <div className="ad_p" style={{ color: "var(--ad-text-1)" }}>{selectedBill.customer}</div>
              </div>
              <div>
                <label className="ad_card__label" style={{ fontSize: "11px" }}>Payment Method</label>
                <div className="ad_p" style={{ color: "var(--ad-text-1)" }}>{selectedBill.paymentMethod}</div>
              </div>
              <div>
                <label className="ad_card__label" style={{ fontSize: "11px" }}>Date & Time</label>
                <div className="ad_p" style={{ color: "var(--ad-text-1)", fontSize: "12px" }}>{selectedBill.timestamp}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: "12px" }}>
              <label className="ad_card__label" style={{ fontSize: "11px", marginBottom: "8px", display: "block" }}>Order Items</label>
              <div style={{ background: "var(--ad-surface-alt)", borderRadius: "8px", padding: "12px" }}>
                {selectedBill.orders.map((order, idx) => (
                  <div key={idx} style={{ marginBottom: idx === selectedBill.orders.length - 1 ? 0 : "10px", paddingBottom: idx === selectedBill.orders.length - 1 ? 0 : "10px", borderBottom: idx === selectedBill.orders.length - 1 ? "none" : "1px dashed var(--ad-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "var(--ad-text-2)" }}>{order.id}</span>
                      <span style={{ fontWeight: "600" }}>₹{order.total}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--ad-text-3)", marginTop: "2px" }}>{order.items}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--ad-gold-soft)", borderRadius: "8px", border: "1px solid var(--ad-gold-dim)" }}>
              <span style={{ fontWeight: "700", color: "var(--ad-gold-light)" }}>Grand Total</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--ad-gold)" }}>₹{selectedBill.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="rooms__form_actions" style={{ marginTop: "20px" }}>
            <button className="rooms__btn rooms__btn--primary" onClick={close}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
