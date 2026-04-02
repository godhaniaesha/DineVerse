const ROLE_PERMISSIONS = [
  ["Super Admin", "Full system access"],
  ["Manager", "Manage orders, staff"],
  ["Chef", "View kitchen orders"],
  ["Waiter", "Manage tables & orders"],
  ["Bartender", "Prepare drinks"],
  ["Receptionist", "Room bookings"],
  ["Housekeeping", "Room status updates"],
];

export default function AdminRoleAccess() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">Role Based Access Control</h2>
      <p className="ad_p">User-wise permissions for system modules and actions.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Role</th><th>Permissions</th></tr></thead>
          <tbody>
            {ROLE_PERMISSIONS.map(([role, permission]) => (
              <tr key={role}><td>{role}</td><td>{permission}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
