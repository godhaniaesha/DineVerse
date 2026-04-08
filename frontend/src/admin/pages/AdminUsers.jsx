import { useEffect, useMemo, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const ROLES = ["Super Admin", "Manager", "Staff", "Cafe Chef", "Restaurant Chef", "Bar Chef", "Waiter"];
const STATUSES = ["Active", "Inactive"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Email A–Z", "Email Z–A", "Role"];

const DATA = [
  { id: 1, name: "Admin User", email: "admin@lumiere.com", role: "Super Admin", status: "Active" },
  { id: 2, name: "Floor Manager", email: "manager@lumiere.com", role: "Manager", status: "Active" },
  { id: 3, name: "Cafe Chef", email: "chef@cafe.com", role: "Cafe Chef", status: "Active" },
  { id: 4, name: "Waiter John", email: "waiter@restaurant.com", role: "Waiter", status: "Active" },
];
const ADMIN_USERS_STORAGE_KEY = "adminUsersRows";
const EMPTY = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Staff",
  status: "Active"
};
export default function AdminUsers() {
  const [rows, setRows] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      if (!stored) return DATA;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DATA;
    } catch {
      return DATA;
    }
  });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const close = () => { setModal(null); setForm(EMPTY); };

  useEffect(() => {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (modal.mode === "add") {
      if (!form.password || form.password !== form.confirmPassword) return;
    } else if (form.password && form.password !== form.confirmPassword) {
      return;
    }
    const payload = { ...form };
    if (modal.mode === "add") {
      setRows((p) => [...p, { id: Date.now(), ...payload }]);
    }
    if (modal.mode === "edit") {
      setRows((p) => p.map((r) => r.id === modal.row.id ? { ...r, ...payload } : r));
    }
    close();
  };
  const filtered = rows.filter((r) => {
    const matchRole = roleFilter === "All" || r.role === roleFilter;
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const text = `${r.name} ${r.email} ${r.role}`.toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "Email A–Z") return list.sort((a, b) => a.email.localeCompare(b.email));
    if (sortBy === "Email Z–A") return list.sort((a, b) => b.email.localeCompare(a.email));
    if (sortBy === "Role") return list.sort((a, b) => a.role.localeCompare(b.role));
    return list;
  }, [filtered, sortBy]);

  return (
    <>
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Admin User Management</h2>
          <p className="ad_p">Manage admin accounts, roles and permissions with search and filters.</p>
        </div>
        <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Admin</button>
      </div>

      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, marginRight: 8 }}
        />
        <select className="rooms__select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ marginRight: 8 }}>
          <option>All Roles</option>
          {ROLES.map((role) => <option key={role}>{role}</option>)}
        </select>
        <select className="rooms__select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginRight: 8 }}>
          <option>All Statuses</option>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="rooms__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>{sorted.map((r) => <tr key={r.id}>
            <td>{r.name}</td>
            <td>{r.email}</td>
            <td>{r.role}</td>
            <td><span className="ad_chip">{r.status}</span></td>
            <td className="rooms__actions_cell">
              <button className="rooms__icon_btn" onClick={() => { setForm(r); setModal({ mode: "edit", row: r }); }}><IcEdit /></button>
              <DeleteIconButton onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))} />
            </td>
          </tr>)}
            {sorted.length === 0 && (
              <tr><td colSpan={5} className="rooms__empty">No users match the filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {
        (modal?.mode === "add" || modal?.mode === "edit") && <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">{modal.mode === "add" ? "Add Admin" : "Edit Admin"}</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>
            <div className="rooms__form_row">
              <label className="rooms__form_label">Name</label>
              <input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="rooms__form_row">
              <label className="rooms__form_label">Email</label>
              <input required type="email" className="rooms__form_input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="rooms__form_row">
              <label className="rooms__form_label">Password {modal.mode === "add" ? "(required)" : "(leave blank to keep current)"}</label>
              <input
                type="password"
                className="rooms__form_input"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>

            <div className="rooms__form_row">
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
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Role</label>
                <select className="rooms__form_select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                  {ROLES.map((role) => <option key={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label className="rooms__form_label">Status</label>
                <select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button>
            </div>
          </div>
        </>
      }
    </>
  )
}
