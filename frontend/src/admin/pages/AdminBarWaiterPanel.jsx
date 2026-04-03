import { useState } from "react";
import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminBarWaiterPanel() {
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const user = localStorage.getItem("adminName") || "Bar Waiter";

  const orders = [
    { order: "BR-ORD-31", seat: "B2", items: "Mojito x2", status: "Ready", note: "Less ice", waiter: "Bar Waiter", amount: 420 },
    { order: "BR-ORD-37", seat: "B6", items: "Craft Beer", status: "Preparing", note: "-", waiter: "Bar Waiter", amount: 260 },
    { order: "BR-ORD-40", seat: "B1", items: "Old Fashioned", status: "Completed", note: "No cherry", waiter: "Bar Waiter", amount: 340 },
  ];

  const filtered = role === "Super Admin" ? orders : orders.filter((o) => o.waiter === user);
  const [bill, setBill] = useState(null);

  const rows = filtered.map((o) => [
    o.order,
    o.seat,
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
        title="Bar Waiter Panel"
        subtitle="Bar waiter panel for seat handling, drink service and closing tabs."
        cards={[
          { label: "Assigned Bar Seats", value: filtered.length },
          { label: "Active Drink Orders", value: filtered.filter((o) => o.status !== "Completed")?.length },
          { label: "Drinks Ready", value: filtered.filter((o) => o.status === "Ready")?.length },
        ]}
        actions={["Create Drink Order", "Add Bar Items", "Serve Drink", "Close Bill"]}
        tableTitle="Bar Service Queue"
        columns={["Order", "Seat/Table", "Items", "Status", "Note", "Bill"]}
        rows={rows}
      />
      {bill && (
        <section className="ad_card" style={{ marginTop: 16 }}>
          <h3 className="ad_card__title">Bill for {bill.order}</h3>
          <div className="ad_p">Seat: {bill.seat}</div>
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
