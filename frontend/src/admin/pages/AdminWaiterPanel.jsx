export default function AdminWaiterPanel() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Waiter Panel</h2>
      <p className="ad_p">Manage assigned tables, active orders, ready pickups and customer requests.</p>
      <div className="ad_cards_grid">
        <article className="ad_card"><div className="ad_card__label">Assigned Tables</div><div className="ad_card__value">8</div></article>
        <article className="ad_card"><div className="ad_card__label">Active Orders</div><div className="ad_card__value">14</div></article>
        <article className="ad_card"><div className="ad_card__label">Ready Orders</div><div className="ad_card__value">5</div></article>
        <article className="ad_card"><div className="ad_card__label">Customer Requests</div><div className="ad_card__value">3</div></article>
      </div>
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
