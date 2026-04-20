import { useEffect, useMemo, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useStaff } from "../../contexts/StaffContext";

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
  "Super Admin"
];
const STATUSES = ["Active", "Inactive"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Email A–Z", "Email Z–A"];

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "Super Admin",
  status: "Active"
};

export default function AdminUsers() {
  const { staff, loading, getStaff, addStaff, updateStaffProfile, deleteStaff } = useStaff();
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
    let result = getStaff();
    console.log(result,"result");
  }, [getStaff]);

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    if (modal.mode === "add") {
      if (!form.password || form.password !== form.confirmPassword) {
        alert("Passwords do not match or are empty.");
        return;
      }

      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("status", form.status);

      const result = await addStaff(formData);
      if (result.success) {
        close();
      } else {
        alert(result.error || "Failed to add Super Admin");
      }
    } else if (modal.mode === "edit") {
      if (form.password && form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("role", form.role);
      formData.append("status", form.status);
      if (form.password) {
        formData.append("password", form.password);
      }

      const result = await updateStaffProfile(modal.row._id, formData);
      if (result.success) {
        alert("Super Admin updated successfully!");
        close();
      } else {
        alert(result.error || "Failed to update Super Admin");
      }
    }
  };

  const handleDelete = async () => {
    const result = await deleteStaff(modal.row._id);
    if (result.success) {
      alert("Super Admin deleted successfully!");
      close();
    } else {
      alert(result.error || "Failed to delete Super Admin");
    }
  };

  const superAdmins = staff.filter(u => u.role === "Super Admin");

  // Filter and sort
  const filtered = superAdmins.filter((r) => {
    const matchRole = roleFilter === "All" || r.role === roleFilter;
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const text = `${r.full_name} ${r.email} ${r.role}`.toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());

    return matchRole && matchStatus && matchSearch;
  });

  const sorted = useMemo(() => {
    const list = [...filtered];

    if (sortBy === "Name A–Z") return list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    if (sortBy === "Name Z–A") return list.sort((a, b) => b.full_name.localeCompare(a.full_name));
    if (sortBy === "Email A–Z") return list.sort((a, b) => a.email.localeCompare(b.email));
    if (sortBy === "Email Z–A") return list.sort((a, b) => b.email.localeCompare(a.email));

    return list;
  }, [filtered, sortBy]);

  return (
    <div className="ad_page admin_user_mangement_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Super Admin Management</h2>
          <p className="ad_p">Manage Super Admin accounts.</p>
        </div>
        <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>
          Add Super Admin
        </button>
      </div>

      {/* Filters */}
      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, marginRight: 8 }}
        />

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

      {/* Table */}
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
            {loading ? (
              <tr>
                <td colSpan={6} className="rooms__empty">Loading Super Admins...</td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="rooms__empty">No Super Admins found</td>
              </tr>
            ) : (
              sorted.map((r) => (
                console.log(r,"r"),
                
                <tr key={r._id}>
                  <td>{r.full_name}</td>
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
                      onClick={() => setModal({ mode: "delete", row: r })}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box" style={{ maxWidth: "550px" }}>
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">
                {modal.mode === "add" ? "Add Super Admin" : "Edit Super Admin"}
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
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
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
                  <label className="rooms__form_label">
                    Password {modal.mode === "edit" && "(optional)"}
                  </label>
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
                onClick={handleSave}
                disabled={
                  form.password !== form.confirmPassword ||
                  !form.full_name ||
                  !form.email ||
                  (modal.mode === "add" && !form.password)
                }
              >
                {modal.mode === "add" ? "Create Super Admin" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Delete Super Admin</span>
              <button className="rooms__modal_close" onClick={close}>×</button>
            </div>
            <p className="rooms__delete_msg">Delete {modal.row.full_name}?</p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button className="rooms__btn rooms__btn--danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
