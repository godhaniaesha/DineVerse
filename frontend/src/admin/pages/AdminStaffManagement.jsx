import { useEffect, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useStaff } from "../../contexts/StaffContext";
import { useAuth } from "../../contexts/AuthContext";

const IcEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IcEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94" />
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.77 21.77 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IcEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const EMPTY = {
  full_name: "",
  role: "Manager",
  department: "",
  cuisineSpecialization: "",
  phone: "",
  email: "",
  status: "Active",
  password: "",
  confirmPassword: ""
};

const DEPTS = ["Kitchen", "Cafe", "Restaurant", "Bar", "Reception", "Housekeeping"];
const ROLES = [
  "Manager",
  "Housekeeping",
  "Cafe Waiter",
  "Res Waiter",
  "Bar Waiter",
  "Chef"
];
const STATUSES = ["Active", "Inactive"];

export default function AdminStaffManagement() {
  const { staff, loading, getStaff, addStaff, updateStaffProfile, deleteStaff } = useStaff();
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const close = () => {
    setModal(null);
    setForm(EMPTY);
  };

  useEffect(() => {
    getStaff();
  }, [getStaff]);

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    if (modal.mode === "add") {
      if (!form.password || form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("department", form.department);
      formData.append("status", form.status);
      if (form.cuisineSpecialization) {
        formData.append("cuisineSpecialization", form.cuisineSpecialization);
      }

      const result = await addStaff(formData);
      if (result.success) {
        alert("Staff added successfully!");
        close();
      } else {
        alert(result.error || "Failed to add staff");
      }
    } else if (modal.mode === "edit") {
      if (form.password && form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("role", form.role);
      formData.append("department", form.department);
      formData.append("status", form.status);
      if (form.cuisineSpecialization) {
        formData.append("cuisineSpecialization", form.cuisineSpecialization);
      }
      if (form.password) {
        formData.append("password", form.password);
      }

      const result = await updateStaffProfile(modal.row._id, formData);
      if (result.success) {
        alert("Staff updated successfully!");
        close();
      } else {
        alert(result.error || "Failed to update staff");
      }
    }
  };

  const handleDelete = async () => {
    const result = await deleteStaff(modal.row._id);
    if (result.success) {
      close();
    } else {
      alert(result.error || "Failed to delete staff");
    }
  };

  const staffWithoutSuperAdmin = staff.filter(s => s.role !== "Super Admin");

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Staff Management</h2>
          <p className="ad_p">Manage staff details, department and role allocation.</p>
        </div>
        <button className="rooms__add_btn" onClick={() => {
          setForm(EMPTY);
          setModal({ mode: "add" });
        }}>
          Add Staff
        </button>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Cuisine</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="rooms__empty">Loading staff...</td>
              </tr>
            ) : staffWithoutSuperAdmin.length === 0 ? (
              <tr>
                <td colSpan={8} className="rooms__empty">No staff found</td>
              </tr>
            ) : (
              staffWithoutSuperAdmin.map((r) => (
                <tr key={r._id}>
                  <td>{r.full_name}</td>
                  <td>{r.role}</td>
                  <td>{r.department || "-"}</td>
                  <td>{r.cuisineSpecialization?.join(", ") || "-"}</td>
                  <td>{r.phone}</td>
                  <td>{r.email}</td>
                  <td><span className="ad_chip">{r.status}</span></td>
                  <td>
                    <div className="d-flex" style={{ gap: "6px" }}>
                      <button className="rooms__icon_btn" onClick={() => {
                        setForm({
                          ...r,
                          password: "",
                          confirmPassword: ""
                        });
                        setModal({ mode: "edit", row: r });
                      }}>
                        <IcEdit />
                      </button>
                      <DeleteIconButton onClick={() => setModal({ mode: "delete", row: r })} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">
                {modal.mode === "add" ? "Add Staff" : "Edit Staff"}
              </span>
              <button className="rooms__modal_close" onClick={close}>×</button>
            </div>
            <div className="rooms__modal_body">
              <div className="rooms__form_row">
                <label className="rooms__form_label">Full Name</label>
                <input
                  className="rooms__form_input"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                />
              </div>
              <div className="rooms__form_row">
                <label className="rooms__form_label">Email</label>
                <input
                  type="email"
                  className="rooms__form_input"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="rooms__form_grid2">
                <div>
                  <label className="rooms__form_label">Phone</label>
                  <input
                    className="rooms__form_input"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="rooms__form_label">Role</label>
                  <select
                    className="rooms__form_select"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    {ROLES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rooms__form_grid2">
                <div>
                  <label className="rooms__form_label">Department</label>
                  <select
                    className="rooms__form_select"
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  >
                    {DEPTS.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="rooms__form_label">Cuisine Specialization</label>
                  <input
                    className="rooms__form_input"
                    value={form.cuisineSpecialization}
                    onChange={(e) => setForm((f) => ({ ...f, cuisineSpecialization: e.target.value }))}
                    placeholder="e.g., Italian, Indian"
                  />
                </div>
              </div>
              <div className="rooms__form_grid2">
                <div>
                  <label className="rooms__form_label">
                    Password {modal.mode === "edit" && "(optional)"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      className="rooms__form_input"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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
                <div>
                  <label className="rooms__form_label">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      className="rooms__form_input"
                      value={form.confirmPassword}
                      onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
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
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
                  !form.full_name ||
                  !form.email ||
                  !form.phone ||
                  (modal.mode === "add" && (!form.password || form.password !== form.confirmPassword)) ||
                  (form.password && form.password !== form.confirmPassword)
                }
              >
                {modal.mode === "add" ? "Add Staff" : "Save Changes"}
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
              <span className="rooms__modal_title">Delete Staff</span>
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
