export default function AdminProfile() {
  const name = localStorage.getItem("adminName") || "Admin User";
  const role = localStorage.getItem("adminRole") || "Super Admin";
  const email = "admin@lumiere.com";
  const phone = "+91 90000 11111";

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Admin Profile</h2>
      <p className="ad_p">Update your profile details and security settings.</p>

      <section className="ad_card" style={{ marginBottom: 16 }}>
        <div className="ad_profile_grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          <div style={{ gridColumn: "span 2", textAlign: "center" }}>
            <div className="ad_profile_avatar" style={{ width: 120, height: 120, borderRadius: "50%", margin: "0 auto", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#333" }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <p style={{ marginTop: 8, fontWeight: 600 }}>{name}</p>
          </div>

          <div style={{ gridColumn: "span 4", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div className="ad_setting_item"><span>Name</span><strong>{name}</strong></div>
            <div className="ad_setting_item"><span>Email</span><strong>{email}</strong></div>
            <div className="ad_setting_item"><span>Phone</span><strong>{phone}</strong></div>
            <div className="ad_setting_item"><span>Role</span><strong>{role}</strong></div>
          </div>
          <div style={{ marginTop: 16, gridColumn: "span 2", textAlign: "center"  }}>
            <button className="ad_btn ad_btn--primary">Update Profile</button>
          </div>
        </div>
      </section>

      <section className="ad_card">
        <h3 className="ad_card__title">Security</h3>
        <div className="ad_form_grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12 }}>
          <input className="ad_input" placeholder="Current Password" type="password" style={{ gridColumn: "span 2" }} />
          <input className="ad_input" placeholder="New Password" type="password" style={{ gridColumn: "span 2" }} />
          <input className="ad_input" placeholder="Confirm New Password" type="password" style={{ gridColumn: "span 2" }} />
        </div>
        <div style={{ marginTop: 16, gridColumn: "span 2", textAlign: "center"  }}>
          <button className="ad_btn ad_btn--primary">Update Password</button>
        </div>
      </section>
    </div>
  );
}
