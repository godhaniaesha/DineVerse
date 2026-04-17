import { useState } from "react";
const DATA = [
  { id: 1, section: "Homepage Hero", content: "Welcome to DineVerse", updatedAt: "2026-04-01" },
  { id: 2, section: "Opening Hours", content: "9:00 AM - 11:00 PM", updatedAt: "2026-04-01" },
];
export default function AdminContent() {
  const [rows, setRows] = useState(DATA);
  const [selected, setSelected] = useState(DATA[0]);
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Content Management</h2>
      <p className="ad_p">Update static website content without code changes.</p>
      <div className="ad_two_col">
        <section className="ad_card">
          <h3 className="ad_card__title">Sections</h3>
          <ul className="ad_list">
            {rows.map((row) => (
              <li key={row.id} className="ad_list__item ad_list__item--between">
                <button className="ad_btn ad_btn--ghost" onClick={() => setSelected(row)}>{row.section}</button>
                <span className="ad_chip">{row.updatedAt}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="ad_card">
          <h3 className="ad_card__title">Edit Content</h3>
          <div className="rooms__form_row"><label className="rooms__form_label">Section</label><input className="rooms__form_input" value={selected.section} onChange={(e) => setSelected((s) => ({ ...s, section: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Content</label><textarea className="rooms__form_input" value={selected.content} onChange={(e) => setSelected((s) => ({ ...s, content: e.target.value }))} /></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--primary" onClick={() => setRows((p) => p.map((r) => (r.id === selected.id ? { ...selected, updatedAt: "2026-04-01" } : r)))}>Save Changes</button></div>
        </section>
      </div>
    </div>
  );
}
