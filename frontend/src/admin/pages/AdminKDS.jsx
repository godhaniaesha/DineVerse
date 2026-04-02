const CHEF_VIEWS = [
  { chef: "Chinese Chef", order: "#105", table: "3", items: ["Hakka Noodles", "Manchurian"] },
  { chef: "Italian Chef", order: "#105", table: "3", items: ["Margherita Pizza"] },
];

export default function AdminKDS() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Kitchen Display System</h2>
      <p className="ad_p">Chefs see only cuisine-relevant order items on KDS screens.</p>
      <div className="ad_two_col">
        {CHEF_VIEWS.map((view) => (
          <section className="ad_card" key={view.chef}>
            <h3 className="ad_card__title">{view.chef}</h3>
            <div className="ad_list__item"><span>Order {view.order}</span><span>Table {view.table}</span></div>
            <ul className="ad_list">{view.items.map((item) => <li key={item} className="ad_list__item">{item}</li>)}</ul>
            <div className="ad_row_actions">
              <button className="ad_btn ad_btn--ghost">Accept Order</button>
              <button className="ad_btn ad_btn--primary">Start Preparing</button>
              <button className="ad_btn ad_btn--ghost">Mark Ready</button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
