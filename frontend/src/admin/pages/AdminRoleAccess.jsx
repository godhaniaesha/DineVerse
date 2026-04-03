const ROLE_PERMISSIONS = [
  ["Super Admin", "Full system access"],
  ["Manager", "Full access to most modules with analytics and user management"],
  ["Cafe Chef", "Cafe order queue and menu + cafe chef panel"],
  ["Restaurant Chef", "Restaurant order queue and menu + restaurant chef panel"],
  ["Bar Chef", "Bar order queue and menu + bar chef panel"],
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
