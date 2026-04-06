import { useState } from "react";

const IcEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
const IcSave = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17,21 17,13 7,13 7,21" /><polyline points="7,3 7,8 15,8" /></svg>;
const IcCancel = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>;
const IcLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><circle cx="12" cy="16" r="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;

export default function AdminProfile() {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: localStorage.getItem("adminName") || "Admin User",
    email: "admin@lumiere.com",
    phone: "+91 90000 11111",
  });
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    localStorage.setItem("adminName", form.name);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm({
      name: localStorage.getItem("adminName") || "Admin User",
      email: "admin@lumiere.com",
      phone: "+91 90000 11111",
    });
    setEditMode(false);
  };

  const handlePasswordUpdate = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 className="ad_h2" style={{ marginBottom: 8 }}>Admin Profile</h2>
        <p className="ad_p">Update your profile details and security settings.</p>
      </div>
      <div className="ad_page" style={{ maxWidth: 800, margin: "0 auto" }}>


        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <section className="ad_card" style={{ padding: 32, textAlign: "center", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div
              className="ad_profile_avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "0px auto 16px",
                background: "rgb(74 70 71)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: "bold",
                color: "rgb(215 164 106)",
                border: "4px solid rgb(33 25 27)",
              }}
            >
              {form.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 600 }} className="rooms__modal_title">{form.name}</h3>
            <p style={{ margin: 0, color: "#666", fontSize: 16 }}>{role}</p>
            {!editMode && (
              <button className="ad_btn ad_btn--outline" onClick={() => setEditMode(true)} style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <IcEdit /> Edit Profile
              </button>
            )}
          </section>

          <section className="ad_card" style={{ padding: 32, borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 className="rooms__modal_title" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 20 }}>
              <IcEdit /> Personal Information
            </h3>
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Full Name</label>
                <input
                  className="rooms__form_input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="rooms__form_label">Email Address</label>
                <input
                  className="rooms__form_input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Phone Number</label>
                <input
                  className="rooms__form_input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="rooms__form_label">Role</label>
                <input
                  className="rooms__form_input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            {editMode && (
              <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="ad_btn ad_btn--primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
                  <IcSave /> Save Changes
                </button>
                <button className="ad_btn ad_btn--ghost" onClick={handleCancel} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
                  <IcCancel /> Cancel
                </button>
              </div>
            )}
          </section>

          <section className="ad_card" style={{ padding: 32, borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 className="rooms__modal_title" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 20 }}>
              <IcLock /> Change Password
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label className="rooms__form_label">Current Password</label>
                <input
                  className="rooms__form_input"
                  placeholder="Current Password"
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  style={{ padding: "12px", border: "1px solid #ffffff12", borderRadius: 6 }}
                />
              </div>
              <div>
                <label className="rooms__form_label">New Password</label>
                <input
                  className="rooms__form_input"
                  placeholder="New Password"
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  style={{ padding: "12px", border: "1px solid #ffffff12", borderRadius: 6 }}
                />
              </div>
              <div>
                <label className="rooms__form_label">Confirm Password</label>
                <input
                  className="rooms__form_input"
                  placeholder="Confirm New Password"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  style={{ padding: "12px", border: "1px solid #ffffff12", borderRadius: 6 }}
                />
              </div>
            </div>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button className="ad_btn ad_btn--primary" onClick={handlePasswordUpdate} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
                <IcLock /> Update Password
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
