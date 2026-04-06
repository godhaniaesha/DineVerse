import { useState } from "react";

const INITIAL = [
  { id: "CF-101", customer: "Riya Patel", contact: "+91 9988776655", date: "2026-04-03", time: "10:30", guests: 2, request: "Window seat", status: "Confirmed" },
];
const EMPTY = { id: "", customer: "", contact: "", date: "", time: "", guests: "2", request: "", status: "Pending" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;

export default function AdminCafeBookings({ title = "Cafe Bookings", sub = "Manage all cafe table reservations." }) {
  const [rows, setRows] = useState(INITIAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);
  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm({ ...row, guests: String(row.guests) }); setModal({ mode: "edit", row }); };
  const openView = (row) => setModal({ mode: "view", row });
  const openDelete = (row) => setModal({ mode: "delete", row });
  const save = () => {
    if (!form.id.trim() || !form.customer.trim() || !form.contact.trim() || !form.date || !form.time) return;
    const payload = { ...form, guests: Number(form.guests) };
    if (modal.mode === "add") setRows((p) => [...p, payload]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? payload : r)));
    close();
  };
  const remove = () => { setRows((p) => p.filter((r) => r.id !== modal.row.id)); close(); };

  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">{title}</h2><p className="ad_p">{sub}</p></div></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>ID</th><th>Customer</th><th>Contact</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id} onClick={() => openView(r)}><td>{r.id}</td><td>{r.customer}</td><td>{r.contact}</td><td>{r.date}</td><td>{r.time}</td><td>{r.guests}</td><td><span className="ad_chip">{r.status}</span></td><td className="rooms__actions_cell" onClick={(e) => e.stopPropagation()}><button className="rooms__icon_btn" onClick={() => openEdit(r)}><IcEdit /></button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => openDelete(r)}><IcTrash /></button></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Cafe Booking" : "Edit Cafe Booking"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Booking ID</label><input className="rooms__form_input" value={form.id} onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))} /></div><div><label className="rooms__form_label">Customer</label><input className="rooms__form_input" value={form.customer} onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))} /></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Contact</label><input className="rooms__form_input" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} /></div><div><label className="rooms__form_label">Guests</label><input type="number" min="1" className="rooms__form_input" value={form.guests} onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))} /></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Date</label><input type="date" className="rooms__form_input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></div><div><label className="rooms__form_label">Time</label><input type="time" className="rooms__form_input" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} /></div></div><div className="rooms__form_row"><label className="rooms__form_label">Special Request</label><input className="rooms__form_input" value={form.request} onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))} /></div><div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
      {modal?.mode === "view" && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">Booking Details</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__detail_grid">{Object.entries(modal.row).map(([k, v]) => <div key={k} className="rooms__detail_card"><div className="rooms__detail_card_label">{k}</div><div className="rooms__detail_card_value">{String(v)}</div></div>)}</div></div></>}
      {modal?.mode === "delete" && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">Delete Booking</span><button className="rooms__modal_close" onClick={close}>x</button></div><p className="rooms__delete_msg">Delete {modal.row.id}?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></div></>}
    </div>
  );
}
