import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const IcEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
const IcSave = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17,21 17,13 7,13 7,21" /><polyline points="7,3 7,8 15,8" /></svg>;
const IcCancel = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>;
const IcLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><circle cx="12" cy="16" r="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IcEye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IcEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;

export default function AdminProfile() {
  const { user, token, changePassword, updateProfile } = useAuth();
  
  // Log phone received from backend for debugging
  useEffect(() => {
    console.log("Auth user object (from backend):", user);
    console.log("Phone from backend:", user?.phone);
  }, [user]);
 
  const [editMode, setEditMode] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (profileImage) {
      formData.append("img", profileImage);
    }

    const result = await updateProfile(user._id, formData);
    if (result.success) {
      alert("Profile updated successfully!");
      setEditMode(false);
    } else {
      alert(result.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfileImage(null);
    setEditMode(false);
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }

    const result = await changePassword(passwordForm.current, passwordForm.new);
    if (result.success) {
      alert("Password updated successfully!");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } else {
      alert(result.error || "Failed to update password");
    }
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
                overflow: "hidden",
              }}
            >
              {user?.img ? (
                <img src={user.img} alt={user.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                (form.full_name || "A").charAt(0).toUpperCase()
              )}
            </div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 600 }} className="rooms__modal_title">{user?.full_name || "Admin User"}</h3>
            <p style={{ margin: 0, color: "#666", fontSize: 16 }}>{user?.role || "Super Admin"}</p>
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
            {editMode && (
              <div className="rooms__form_row" style={{ marginBottom: "16px" }}>
                <label className="rooms__form_label">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="rooms__form_input"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>
            )}
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Full Name</label>
                <input
                  className="rooms__form_input"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="rooms__form_label">Email Address</label>
                <input
                  type="email"
                  className="rooms__form_input"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Phone Number</label>
                <input
                  className="rooms__form_input"
                  value={form.phone}
                  maxLength={10}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="rooms__form_label">Role</label>
                <input
                  className="rooms__form_input"
                  value={user?.role || "Super Admin"}
                  disabled
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
                <div style={{ position: "relative" }}>
                  <input
                    className="rooms__form_input"
                    placeholder="Current Password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    style={{ padding: "12px 40px 12px 12px", border: "1px solid #ffffff12", borderRadius: 6, width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showPasswords.current ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="rooms__form_label">New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="rooms__form_input"
                    placeholder="New Password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    style={{ padding: "12px 40px 12px 12px", border: "1px solid #ffffff12", borderRadius: 6, width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showPasswords.new ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="rooms__form_label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="rooms__form_input"
                    placeholder="Confirm New Password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    style={{ padding: "12px 40px 12px 12px", border: "1px solid #ffffff12", borderRadius: 6, width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showPasswords.confirm ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
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
