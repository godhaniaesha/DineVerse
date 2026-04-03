import { useState } from "react";
import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminRestaurantWaiterPanel() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const user = localStorage.getItem("adminName") || "Restaurant Waiter";

  const orders = [
    { order: "RS-ORD-201", table: "R4", items: "Pasta, Soup", status: "Ready", note: "Less spice", waiter: "Restaurant Waiter", amount: 520 },
    { order: "RS-ORD-208", table: "R8", items: "Pizza Combo", status: "Preparing", note: "-", waiter: "Restaurant Waiter", amount: 680 },
    { order: "RS-ORD-212", table: "R6", items: "Salad, Steak", status: "Completed", note: "No nuts", waiter: "Restaurant Waiter", amount: 980 },
  ];

  const filtered = role === "Super Admin" ? orders : orders.filter((o) => o.waiter === user);
  const [bill, setBill] = useState(null);

  const rows = filtered.map((o) => [
    o.order,
    o.table,
    o.items,
    o.status,
    o.note,
    o.status === "Completed" ? (
      <button className="ad_btn ad_btn--ghost" onClick={() => setBill(o)}>
        View Bill
      </button>
    ) : (
      "-"
    ),
  ]);

  return (
    <>
      <RoleOperationsPanel
        title="Restaurant Waiter Panel"
        subtitle="Restaurant waiter operations with assigned tables and served orders."
        cards={[
          { label: "Assigned Restaurant Tables", value: filtered.length },
          { label: "Restaurant Active Orders", value: filtered.filter((o) => o.status !== "Completed")?.length },
          { label: "Ready To Serve", value: filtered.filter((o) => o.status === "Ready")?.length },
        ]}
        actions={["Create Restaurant Order", "Add Dishes", "Serve Food", "Close Table"]}
        tableTitle="Restaurant Service Queue"
        columns={["Order", "Table", "Items", "Status", "Customer Note", "Bill"]}
        rows={rows}
      />
      {bill && (
        <section className="ad_card" style={{ marginTop: 16 }}>
          <h3 className="ad_card__title">Bill for {bill.order}</h3>
          <div className="ad_p">Table: {bill.table}</div>
          <div className="ad_p">Items: {bill.items}</div>
          <div className="ad_p">Amount: ₹{bill.amount}</div>
          <div className="ad_p">Status: {bill.status}</div>
          <button className="ad_btn ad_btn--primary" onClick={() => setBill(null)}>
            Close Bill
          </button>
        </section>
      )}
    </>
  );
}
