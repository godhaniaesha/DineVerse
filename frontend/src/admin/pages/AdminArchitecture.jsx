const COLLECTIONS = ["users", "staff", "roles", "menus", "cuisines", "orders", "orderItems", "tables", "rooms", "bookings", "customers", "inventory", "reviews", "gallery", "reports"];
const APIS = ["POST /api/auth/login", "POST /api/staff/add", "GET /api/menu", "POST /api/order", "GET /api/bookings", "POST /api/room/book"];
const SECURITY = ["JWT authentication", "Role based access", "Password encryption", "API validation", "Rate limiting"];
const ADVANCED = ["QR code table ordering", "Mobile waiter app", "AI demand prediction", "Reservation calendar", "Customer loyalty program", "Event booking system", "Multi-branch management"];

export default function AdminArchitecture() {
  return (
    <div className="ad_page">
      <h2 className="ad_h2">System Architecture</h2>
      <p className="ad_p">Database, API, real-time, security, deployment and workflow overview.</p>
      <div className="ad_two_col">
        <section className="ad_card"><h3 className="ad_card__title">MongoDB Collections</h3><ul className="ad_list">{COLLECTIONS.map((item) => <li key={item} className="ad_list__item">{item}</li>)}</ul></section>
        <section className="ad_card"><h3 className="ad_card__title">API Layer</h3><ul className="ad_list">{APIS.map((item) => <li key={item} className="ad_list__item">{item}</li>)}</ul></section>
      </div>
      <div className="ad_two_col" style={{ marginTop: 16 }}>
        <section className="ad_card"><h3 className="ad_card__title">Real-time Communication</h3><p className="ad_p">Socket.io sends instant updates to chef, waiter and admin dashboards.</p></section>
        <section className="ad_card"><h3 className="ad_card__title">Security System</h3><ul className="ad_list">{SECURITY.map((item) => <li key={item} className="ad_list__item">{item}</li>)}</ul></section>
      </div>
      <div className="ad_two_col" style={{ marginTop: 16 }}>
        {/* <section className="ad_card"><h3 className="ad_card__title">Deployment</h3><p className="ad_p">Frontend (React) -> Vercel/Netlify, Backend (Node) -> AWS EC2, DB -> MongoDB Atlas, Images -> Cloudinary/S3.</p></section> */}
        <section className="ad_card"><h3 className="ad_card__title">Advanced Features</h3><ul className="ad_list">{ADVANCED.map((item) => <li key={item} className="ad_list__item">{item}</li>)}</ul></section>
      </div>
      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Full Workflow</h3>
        {/* <p className="ad_p">Customer books -> waiter seats -> order placed -> chefs prepare -> order ready -> waiter serves -> POS bill -> customer pays.</p> */}
      </section>
    </div>
  );
}
