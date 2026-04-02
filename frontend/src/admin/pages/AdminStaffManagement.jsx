import { useState } from "react";

const INITIAL = [
  { id: 1, name: "Rahul Patel", role: "Chef", department: "Kitchen", cuisine: "Italian", phone: "+91 9000011111", email: "rahul@lumiere.com", shift: "Morning", status: "Active" },
];
const EMPTY = { name: "", role: "Chef", department: "Kitchen", cuisine: "", phone: "", email: "", shift: "Morning", status: "Active" };
const DEPTS = ["Kitchen", "Cafe", "Restaurant", "Bar", "Reception", "Housekeeping"];
const ROLES = ["Super Admin", "Manager", "Chef", "Waiter", "Bartender", "Receptionist", "Housekeeping"];

export default function AdminStaffManagement() {
  const [rows, setRows] = useState(INITIAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);
  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return;
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...form }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...form } : r)));
    close();
  };
  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">Staff Management</h2><p className="ad_p">Manage staff details, department and role allocation.</p></div><button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Staff</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Cuisine</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.role}</td><td>{r.department}</td><td>{r.cuisine || "-"}</td><td>{r.phone}</td><td>{r.shift}</td><td><span className="ad_chip">{r.status}</span></td><td className="rooms__actions_cell"><button className="rooms__icon_btn" onClick={() => { setForm(r); setModal({ mode: "edit", row: r }); }}>Edit</button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}>Delete</button></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <><div className="rooms__modal_overlay" onClick={close} /><div className="rooms__modal_box"><div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Staff" : "Edit Staff"}</span><button className="rooms__modal_close" onClick={close}>x</button></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div><div><label className="rooms__form_label">Role</label><select className="rooms__form_select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>{ROLES.map((v) => <option key={v}>{v}</option>)}</select></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Department</label><select className="rooms__form_select" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>{DEPTS.map((v) => <option key={v}>{v}</option>)}</select></div><div><label className="rooms__form_label">Cuisine Specialization</label><input className="rooms__form_input" value={form.cuisine} onChange={(e) => setForm((f) => ({ ...f, cuisine: e.target.value }))} /></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Phone</label><input className="rooms__form_input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div><div><label className="rooms__form_label">Email</label><input className="rooms__form_input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div></div><div className="rooms__form_grid2"><div><label className="rooms__form_label">Shift</label><select className="rooms__form_select" value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))}><option>Morning</option><option>Evening</option><option>Night</option></select></div><div><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Active</option><option>Inactive</option></select></div></div><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
    </div>
  );
}
 