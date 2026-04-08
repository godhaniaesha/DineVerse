import { useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const DATA = [
  { id: 1, name: "Aarav", phone_no: "+91 98765 43210", rating: 5, message: "Great ambience and food.", date: "2026-04-01", status: "Approved" },
  { id: 2, name: "Mia", phone_no: "+91 98765 43211", rating: 3, message: "Service was a bit slow.", date: "2026-04-01", status: "Pending" },
];
const EMPTY = { name: "", phone_no: "", rating: "5", message: "", date: "", status: "Pending" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;

export default function AdminReviews() {
  const [rows, setRows] = useState(DATA);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm({ ...row, rating: String(row.rating) }); setModal({ mode: "edit", row }); };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);
  const save = () => {
    if (!form.name.trim() || !form.phone_no.trim() || !form.message.trim() || !form.date) return;
    const payload = { ...form, rating: Number(form.rating) };
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...payload } : r)));
    close();
  };
  const remove = () => { setRows((p) => p.filter((r) => r.id !== modal.row.id)); close(); };

  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">Reviews & Ratings</h2><p className="ad_p">Approve, reject and manage customer testimonials.</p></div><button className="rooms__add_btn" onClick={openAdd}>Add Review</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Name</th><th>Phone</th><th>Rating</th><th>Review</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.phone_no}</td><td>{r.rating}/5</td><td>{r.message}</td><td>{r.date}</td><td><span className="ad_chip">{r.status}</span></td><td className="rooms__actions_cell"><button className="rooms__icon_btn" onClick={() => openEdit(r)}><IcEdit /></button><DeleteIconButton onClick={() => openDelete(r)} /></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Review" : "Edit Review"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_row"><label className="rooms__form_label">Customer Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Phone Number</label><input required className="rooms__form_input" value={form.phone_no} onChange={(e) => setForm((f) => ({ ...f, phone_no: e.target.value }))} placeholder="+91 98765 43210" /></div><div className="rooms__form_row"><label className="rooms__form_label">Rating</label><select className="rooms__form_select" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}>{["5","4","3","2","1"].map((v) => <option key={v} value={v}>{v}</option>)}</select></div><div className="rooms__form_row"><label className="rooms__form_label">Message</label><textarea required className="rooms__form_input" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} /></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Date</label><input required type="date" className="rooms__form_input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></div><div><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Pending</option><option>Approved</option><option>Rejected</option></select></div></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
      {modal?.mode === "delete" && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">Delete Review</span><button className="rooms__modal_close" onClick={close}>x</button></div><p className="rooms__delete_msg">Delete review by {modal.row.name}?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></div></>}
    </div>
  );
}
