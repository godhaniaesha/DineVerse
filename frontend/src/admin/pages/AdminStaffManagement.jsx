import { useEffect, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const INITIAL = [
  { id: 1, name: "Rahul Patel", role: "Chef", department: "Kitchen", cuisine: "Italian", phone: "+91 9000011111", email: "rahul@lumiere.com", shift: "Morning", status: "Active" },
];
const EMPTY = { name: "", role: "Chef", department: "Kitchen", cuisine: "", phone: "", email: "", shift: "Morning", status: "Active" };
const STAFF_STORAGE_KEY = "adminStaffRows";
const DEPTS = ["Kitchen", "Cafe", "Restaurant", "Bar", "Reception", "Housekeeping"];
const ROLES = ["Super Admin", "Manager", "Chef", "Waiter", "Bartender", "Receptionist", "Housekeeping"];

export default function AdminStaffManagement() {
  const [rows, setRows] = useState(() => {
    try {
      const stored = localStorage.getItem(STAFF_STORAGE_KEY);
      if (!stored) return INITIAL;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : INITIAL;
    } catch {
      return INITIAL;
    }
  });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const close = () => setModal(null);

  useEffect(() => {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);
  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return;
    if (modal.mode === "add") setRows((p) => [...p, { id: Date.now(), ...form }]);
    if (modal.mode === "edit") setRows((p) => p.map((r) => (r.id === modal.row.id ? { ...r, ...form } : r)));
    close();
  };
  return (
    <div className="ad_page">
      <div className="rooms__header"><div><h2 className="ad_h2">Staff Management</h2><p className="ad_p">Manage staff details, department and role allocation.</p></div><button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Staff</button></div>
      <div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Cuisine</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.role}</td><td>{r.department}</td><td>{r.cuisine || "-"}</td><td>{r.phone}</td><td>{r.shift}</td><td><span className="ad_chip">{r.status}</span></td><td>
        <div className="d-flex" style={{gap:"6px"}}>
        <button className="rooms__icon_btn" onClick={() => { setForm(r); setModal({ mode: "edit", row: r }); }}><IcEdit /></button>
        <DeleteIconButton onClick={() => setModal({ mode: "delete", row: r })} />
          </div></td></tr>)}</tbody></table></div>
      {(modal?.mode === "add" || modal?.mode === "edit") && <>
        <div className="rooms__modal_overlay" onClick={close} />
        <div className="rooms__modal_box">
          <div className="rooms__modal_head">
            <span className="rooms__modal_title">{modal.mode === "add" ? "Add Staff" : "Edit Staff"}</span>
            <button className="rooms__modal_close" onClick={close}>x</button>
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Name</label>
            <input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Email</label>
            <input className="rooms__form_input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="rooms__form_grid2">
            <div>
              <label className="rooms__form_label">Phone</label>
              <input className="rooms__form_input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>

            <div>
              <label className="rooms__form_label">Role</label>
              <select className="rooms__form_select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>{ROLES.map((v) => <option key={v}>{v}</option>)}</select>
            </div>
          </div>
          <div className="rooms__form_grid2"><div>
            <label className="rooms__form_label">Department</label>
            <select className="rooms__form_select" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>{DEPTS.map((v) => <option key={v}>{v}</option>)}</select>
          </div>
            <div>
              <label className="rooms__form_label">Cuisine Specialization</label>
              <input className="rooms__form_input" value={form.cuisine} onChange={(e) => setForm((f) => ({ ...f, cuisine: e.target.value }))} />
            </div>
          </div>

          <div className="rooms__form_grid2">
            <div>
              <label className="rooms__form_label">Password </label>
              <input
                type="password"
                className="rooms__form_input"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            <div >
              <label className="rooms__form_label">Confirm Password</label>
              <input
                type="password"
                className="rooms__form_input"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="rooms__form_row">
            <label className="rooms__form_label">Status</label>
            <select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div></div></>}
      {modal?.mode === "delete" && <>
        <div className="rooms__modal_overlay" onClick={close} />
        <div className="rooms__modal_box">
          <div className="rooms__modal_head">
            <span className="rooms__modal_title">Delete Staff</span>
            <button className="rooms__modal_close" onClick={close}>x</button>
          </div>
          <p className="rooms__delete_msg">Delete {modal.row.name}?</p>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
            <button className="rooms__btn rooms__btn--danger" onClick={() => { setRows((p) => p.filter((x) => x.id !== modal.row.id)); close(); }}>Delete</button>
          </div>
        </div>
      </>}
    </div>
  );
}
