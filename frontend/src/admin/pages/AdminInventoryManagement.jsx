import { useState } from "react";

const INITIAL = [
  { id: 1, item: "Coffee Beans", quantity: 12, supplier: "Brew Co.", expiry: "2026-05-12", lowStock: 8 },
  { id: 2, item: "Milk", quantity: 6, supplier: "Fresh Dairy", expiry: "2026-04-05", lowStock: 10 },
];
const EMPTY = { item: "", quantity: "0", supplier: "", expiry: "", lowStock: "5" };

export default function AdminInventoryManagement() {
  const [rows, setRows] = useState(INITIAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);
  const save = () => {
    if (!form.item.trim() || !form.supplier.trim() || !form.expiry) return;
    const payload = { ...form, quantity: Number(form.quantity), lowStock: Number(form.lowStock) };
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...payload } : r)));
    close();
  };
  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">Inventory Management</h2><p className="ad_p">Track stock, suppliers, expiry and low stock alerts.</p></div><button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Item</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Item</th><th>Quantity</th><th>Supplier</th><th>Expiry</th><th>Low Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.item}</td><td>{r.quantity}</td><td>{r.supplier}</td><td>{r.expiry}</td><td>{r.lowStock}</td><td><span className="ad_chip">{r.quantity <= r.lowStock ? "Low Stock" : "Healthy"}</span></td><td className="rooms__actions_cell"><button className="rooms__icon_btn" onClick={() => { setForm({ ...r, quantity: String(r.quantity), lowStock: String(r.lowStock) }); setModal({ mode: "edit", row: r }); }}>Edit</button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}>Delete</button></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Inventory Item" : "Edit Inventory Item"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_row"><label className="rooms__form_label">Item</label><input className="rooms__form_input" value={form.item} onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))} /></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Quantity</label><input type="number" className="rooms__form_input" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} /></div><div><label className="rooms__form_label">Low Stock Alert</label><input type="number" className="rooms__form_input" value={form.lowStock} onChange={(e) => setForm((f) => ({ ...f, lowStock: e.target.value }))} /></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Supplier</label><input className="rooms__form_input" value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} /></div><div><label className="rooms__form_label">Expiry Date</label><input type="date" className="rooms__form_input" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} /></div></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
    </div>
  );
}
