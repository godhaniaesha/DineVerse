const DEFAULT_CARDS = [
  { label: "Active Tasks", value: 0 },
  { label: "Pending Tasks", value: 0 },
  { label: "Completed Today", value: 0 },
];

export default function RoleOperationsPanel({
  title,
  subtitle,
  cards = DEFAULT_CARDS,
  actions = [],
  tableTitle = "Live Queue",
  columns = [],
  rows = [],
}) {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">{title}</h2>
      <p className="ad_p">{subtitle}</p>

      <div className="ad_cards_grid">
        {cards.map((card) => (
          <article className="ad_card" key={card.label}>
            <div className="ad_card__label">{card.label}</div>
            <div className="ad_card__value">{card.value}</div>
          </article>
        ))}
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Quick Actions</h3>
        <div className="ad_row_actions">
          {actions.map((action) => (
            <button key={action} className="ad_btn ad_btn--ghost">{action}</button>
          ))}
        </div>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">{tableTitle}</h3>
        <div className="ad_table_wrap">
          <table className="ad_table">
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cIdx) => <td key={`${idx}-${cIdx}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
