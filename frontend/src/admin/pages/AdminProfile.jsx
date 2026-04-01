export default function AdminProfile() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Admin Profile</h2>
      <p className="ad_p">Manage your account details and preferences.</p>
      <div className="ad_two_col">
        <section className="ad_card">
          <h3 className="ad_card__title">Profile Details</h3>
          <div className="ad_settings_list">
            <div className="ad_setting_item"><span>Full Name</span><strong>Admin User</strong></div>
            <div className="ad_setting_item"><span>Email</span><strong>admin@lumiere.com</strong></div>
            <div className="ad_setting_item"><span>Role</span><strong>Super Admin</strong></div>
          </div>
        </section>
        <section className="ad_card">
          <h3 className="ad_card__title">Security</h3>
          <div className="ad_form_grid">
            <input className="ad_input" placeholder="Current Password" type="password" />
            <input className="ad_input" placeholder="New Password" type="password" />
            <button className="ad_btn ad_btn--primary">Update Password</button>
          </div>
        </section>
      </div>
    </div>
  );
}
