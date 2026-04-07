import { useEffect, useState } from "react";

const COMPLETED_PAYMENTS_KEY = "admin-completed-payments";

export default function AdminSalesHistory() {
  const [completedPayments, setCompletedPayments] = useState([]);

  useEffect(() => {
    const savedPayments = localStorage.getItem(COMPLETED_PAYMENTS_KEY);
    if (savedPayments) {
      setCompletedPayments(JSON.parse(savedPayments));
    }
  }, []);

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
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Timestamp</th>
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
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {payment.orders.map((order, index) => (
                        <li key={index}>
                          <strong>{order.id}:</strong> {order.items} (₹{order.total.toLocaleString("en-IN")})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{payment.total.toLocaleString("en-IN")}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.timestamp}</td>
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
    </div>
  );
}
