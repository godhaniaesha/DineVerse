import { useEffect, useMemo, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const IcEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IcEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const ROLES = [
  "Super Admin",
  "Manager",
  "Cafe Chef",
  "Restaurant Chef",
  "Bar Chef",
  "Cafe Waiter",
  "Restaurant Waiter",
  "Bar Waiter"
];
const STATUSES = ["Active", "Inactive"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Email A–Z", "Email Z–A"];

const DATA = [
  { id: 1, name: "Admin User", email: "admin@lumiere.com", phone: "1234567890", role: "Super Admin", status: "Active", password: "password123" },
];

const ADMIN_USERS_STORAGE_KEY = "adminUsersRows";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "Manager",
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
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const close = () => {
    setModal(null);
    setForm(EMPTY);
    setShowPass(false);
    setShowConfirmPass(false);
  };

  useEffect(() => {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const save = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    if (modal.mode === "add") {
      if (!form.password || form.password !== form.confirmPassword) {
        alert("Passwords do not match or are empty.");
        return;
      }
    } else if (form.password && form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = form;

    if (modal.mode === "add") {
      setRows((p) => [...p, { id: Date.now(), ...payload }]);
    }

    if (modal.mode === "edit") {
      setRows((p) =>
        p.map((r) => {
          if (r.id === modal.row.id) {
            const updatedRow = { ...r, ...payload };
            // Only update password if provided
            if (!form.password) {
              updatedRow.password = r.password;
            }
            return updatedRow;
          }
          return r;
        })
      );
    }

    close();
  };

  // ✅ FILTER LOGIC (FIXED)
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
    <div className="ad_page admin_user_mangement_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Admin User Management</h2>
          <p className="ad_p">Manage admin accounts, roles and permissions with search and filters.</p>
        </div>
        <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>
          Add Admin
        </button>
      </div>

      {/* ✅ FILTERS */}
      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, marginRight: 8 }}
        />

        {/* ✅ STATUS FILTER FIXED */}
        <select
          className="rooms__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="rooms__select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* ✅ TABLE */}
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone || "—"}</td>
                <td>{r.role}</td>
                <td><span className="ad_chip">{r.status}</span></td>
                <td className="rooms__actions_cell">
                  <button
                    className="rooms__icon_btn"
                    onClick={() => {
                      setForm({ ...r, password: "", confirmPassword: "" });
                      setModal({ mode: "edit", row: r });
                    }}
                  >
                    <IcEdit />
                  </button>

                  <DeleteIconButton
                    onClick={() =>
                      setRows((p) => p.filter((x) => x.id !== r.id))
                    }
                  />
                </td>
              </tr>
            ))}

            {/* ✅ EMPTY STATE */}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="rooms__empty">
                  No users match the filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box" style={{ maxWidth: "550px" }}>
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">
                {modal.mode === "add" ? "Add Admin" : "Edit Admin"}
              </span>
              <button className="rooms__modal_close" onClick={close}>×</button>
            </div>

            <div className="rooms__modal_body">
              <div className="rooms__form_grid2">
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Name</label>
                  <input
                    type="text"
                    className="rooms__form_input"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Email</label>
                  <input
                    type="email"
                    className="rooms__form_input"
                    placeholder="example@lumiere.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="rooms__form_grid2">
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Phone Number</label>
                  <input
                    type="tel"
                    className="rooms__form_input"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Role</label>
                  <select
                    className="rooms__form_select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rooms__form_grid2">
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      className="rooms__form_input"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--ad-text-3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "0"
                      }}
                    >
                      {showPass ? <IcEyeOff /> : <IcEye />}
                    </button>
                  </div>
                </div>
                <div className="rooms__form_row">
                  <label className="rooms__form_label">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      className="rooms__form_input"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--ad-text-3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "0"
                      }}
                    >
                      {showConfirmPass ? <IcEyeOff /> : <IcEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rooms__form_row">
                <label className="rooms__form_label">Status</label>
                <select
                  className="rooms__form_select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                <div style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "-10px", marginBottom: "10px" }}>
                  Passwords do not match
                </div>
              )}
            </div>

            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button
                className="rooms__btn rooms__btn--primary"
                onClick={save}
                disabled={form.password !== form.confirmPassword || !form.name || !form.email}
              >
                {modal.mode === "add" ? "Create Admin" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}