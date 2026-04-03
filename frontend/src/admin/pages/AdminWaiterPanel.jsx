import { useMemo } from "react";

export default function AdminWaiterPanel() {
  const role = localStorage.getItem("adminRole") || "Super Admin";

  const tableCards = useMemo(() => [
    { area: "Cafe", table: "T1", seats: 4, status: "Occupied" },
    { area: "Cafe", table: "T2", seats: 4, status: "Available" },
    { area: "Restaurant", table: "R1", seats: 6, status: "Occupied" },
    { area: "Restaurant", table: "R2", seats: 4, status: "Available" },
    { area: "Bar", table: "B1", seats: 4, status: "Occupied" },
    { area: "Bar", table: "B2", seats: 2, status: "Available" },
  ], []);

  const visibleTables = useMemo(() => {
    if (role === "Super Admin" || role === "Manager" || role === "Waiter") {
      return tableCards;
    }
    if (role === "Cafe Waiter") return tableCards.filter((t) => t.area === "Cafe");
    if (role === "Restaurant Waiter") return tableCards.filter((t) => t.area === "Restaurant");
    if (role === "Bar Waiter") return tableCards.filter((t) => t.area === "Bar");
    return tableCards;
  }, [role, tableCards]);

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Waiter Panel</h2>
      <p className="ad_p">Manage assigned tables, active orders, ready pickups and customer requests.</p>
      <div className="ad_cards_grid">
        <article className="ad_card"><div className="ad_card__label">Assigned Tables</div><div className="ad_card__value">{visibleTables.length}</div></article>
        <article className="ad_card"><div className="ad_card__label">Active Orders</div><div className="ad_card__value">14</div></article>
        <article className="ad_card"><div className="ad_card__label">Ready Orders</div><div className="ad_card__value">5</div></article>
        <article className="ad_card"><div className="ad_card__label">Customer Requests</div><div className="ad_card__value">3</div></article>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Area Tables</h3>
        <div className="ad_cards_grid">
          {visibleTables.map((t) => (
            <article key={`${t.area}-${t.table}`} className="ad_card">
              <div className="ad_card__label">{t.area} - {t.table}</div>
              <div className="ad_card__value">{t.seats} persons</div>
              <div className="ad_card__meta">{t.status}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Waiter Actions</h3>
        <div className="ad_row_actions">
          <button className="ad_btn ad_btn--primary">Create Order</button>
          <button className="ad_btn ad_btn--ghost">Add Items</button>
          <button className="ad_btn ad_btn--ghost">Serve Food</button>
          <button className="ad_btn ad_btn--ghost">Close Table</button>
        </div>
      </section>
    </div>
  );
}
