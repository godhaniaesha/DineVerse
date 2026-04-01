import { useState } from "react";

const INITIAL = [
  { id: 1, name: "Cappuccino", description: "Espresso with foam", price: 220, category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", available: true, featured: false },
];
const EMPTY = { name: "", description: "", price: "", category: "Coffee", image: "", available: true, featured: false };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;
const CATS = ["Coffee", "Snacks", "Starters", "Main Course", "Desserts", "Cocktails", "Mocktails", "Wine", "Beer"];

export default function AdminCafeMenu({ title = "Cafe Menu", sub = "Manage cafe food and beverage items." }) {
  const [rows, setRows] = useState(INITIAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);
  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm(row); setModal({ mode: "edit", row }); };
  const openView = (row) => setModal({ mode: "view", row });
  const openDelete = (row) => setModal({ mode: "delete", row });
  const save = () => {
    if (!form.name.trim() || !form.description.trim() || !form.price || !form.image.trim()) return;
    const payload = { ...form, price: Number(form.price) };
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...payload } : r)));
    close();
  };
  const remove = () => { setRows((p) => p.filter((r) => r.id !== modal.row.id)); close(); };

  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">{title}</h2><p className="ad_p">{sub}</p></div><button className="rooms__add_btn" onClick={openAdd}>Add Item</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id} onClick={() => openView(r)}><td><img src={r.image} alt={r.name} className="ad_gallery_img" style={{ width: 60, height: 40, marginBottom: 0 }} /></td><td>{r.name}</td><td>{r.category}</td><td>₹{r.price}</td><td><span className="ad_chip">{r.available ? "Available" : "Hidden"}</span></td><td>{r.featured ? "Yes" : "No"}</td><td className="rooms__actions_cell" onClick={(e) => e.stopPropagation()}><button className="rooms__icon_btn" onClick={() => openEdit(r)}><IcEdit /></button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => openDelete(r)}><IcTrash /></button></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Menu Item" : "Edit Menu Item"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_row"><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Price</label><input type="number" className="rooms__form_input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div><div><label className="rooms__form_label">Category</label><select className="rooms__form_select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></div></div><div className="rooms__form_row"><label className="rooms__form_label">Image URL</label><input className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div><div className="rooms__form_grid2"><label className="ad_setting_item"><span>Available</span><input type="checkbox" checked={form.available} onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} /></label><label className="ad_setting_item"><span>Featured / Special</span><input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /></label></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
      {modal?.mode === "view" && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">Menu Item Details</span><button className="rooms__modal_close" onClick={close}>x</button></div><img src={modal.row.image} alt={modal.row.name} className="ad_gallery_img" /><div className="rooms__detail_grid">{Object.entries(modal.row).map(([k, v]) => <div key={k} className="rooms__detail_card"><div className="rooms__detail_card_label">{k}</div><div className="rooms__detail_card_value">{String(v)}</div></div>)}</div></div></>}
      {modal?.mode === "delete" && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">Delete Item</span><button className="rooms__modal_close" onClick={close}>x</button></div><p className="rooms__delete_msg">Delete {modal.row.name}?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></div></>}
    </div>
  );
}
