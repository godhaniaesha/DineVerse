const METHODS = ["Cash", "Card", "UPI", "Online payment"];

export default function AdminPOS() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">POS Billing System</h2>
      <p className="ad_p">Generate bills, apply discounts/tax, split bills and process payments.</p>
      <div className="ad_two_col">
        <section className="ad_card">
          <h3 className="ad_card__title">Billing Features</h3>
          <ul className="ad_list">
            <li className="ad_list__item">Generate bill</li>
            <li className="ad_list__item">Apply tax and discount</li>
            <li className="ad_list__item">Split bill by customer</li>
            <li className="ad_list__item">Print receipt</li>
          </ul>
        </section>
        <section className="ad_card">
          <h3 className="ad_card__title">Payment Methods</h3>
          <ul className="ad_list">{METHODS.map((method) => <li key={method} className="ad_list__item">{method}</li>)}</ul>
          <button className="ad_btn ad_btn--primary">Generate Sample Bill</button>
        </section>
      </div>
    </div>
  );
}
