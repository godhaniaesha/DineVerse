import { useState } from "react";

const INITIAL = [
  { id: 1, cuisine: "Italian", category: "Pasta", description: "Cream and tomato based pasta dishes", status: "Active" },
  { id: 2, cuisine: "Chinese", category: "Noodles", description: "Stir-fried and saucy noodles", status: "Active" },
];
const EMPTY = { cuisine: "", category: "", description: "", status: "Active" };

export default function AdminCuisineManagement() {
  const [rows, setRows] = useState(INITIAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);
  const save = () => {
    if (!form.cuisine.trim() || !form.category.trim() || !form.description.trim()) return;
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...form }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...form } : r)));
    close();
  };
  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">Cuisine Management</h2><p className="ad_p">Create cuisine -> category structure for menus.</p></div><button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Cuisine</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Cuisine</th><th>Category</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.cuisine}</td><td>{r.category}</td><td>{r.description}</td><td><span className="ad_chip">{r.status}</span></td><td className="rooms__actions_cell"><button className="rooms__icon_btn" onClick={() => { setForm(r); setModal({ mode: "edit", row: r }); }}>Edit</button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}>Delete</button></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Cuisine" : "Edit Cuisine"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_row"><label className="rooms__form_label">Cuisine</label><input className="rooms__form_input" value={form.cuisine} onChange={(e) => setForm((f) => ({ ...f, cuisine: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Category</label><input className="rooms__form_input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Active</option><option>Inactive</option></select></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
    </div>
  );
}
