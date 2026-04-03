import { useState } from "react";
import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminCafeWaiterPanel() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const user = localStorage.getItem("adminName") || "Cafe Waiter";

  const orders = [
    { order: "CF-ORD-12", table: "C2", items: "Cappuccino, Fries", status: "Preparing", request: "No sugar", waiter: "Cafe Waiter", amount: 360 },
    { order: "CF-ORD-14", table: "C5", items: "Cold Coffee", status: "Ready", request: "", waiter: "Cafe Waiter", amount: 160 },
    { order: "CF-ORD-18", table: "C1", items: "Sandwich", status: "Completed", request: "Cut in half", waiter: "Cafe Waiter", amount: 220 },
  ];
  const filtered = role === "Super Admin" ? orders : orders.filter((o) => o.waiter === user);

  const [bill, setBill] = useState(null);

  const rows = filtered.map((o) => [
    o.order,
    o.table,
    o.items,
    o.status,
    o.request || "-",
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
        title="Cafe Waiter Panel"
        subtitle="Cafe waiter specific tables, orders and service flow."
        cards={[
          { label: "Assigned Cafe Tables", value: filtered.length },
          { label: "Cafe Active Orders", value: filtered.filter((o) => o.status !== "Completed")?.length },
          { label: "Cafe Ready Orders", value: filtered.filter((o) => o.status === "Ready")?.length },
        ]}
        actions={["Create Cafe Order", "Add Cafe Items", "Serve Order", "Close Table"]}
        tableTitle="Cafe Order Queue"
        columns={["Order", "Table", "Items", "Status", "Request", "Bill"]}
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
