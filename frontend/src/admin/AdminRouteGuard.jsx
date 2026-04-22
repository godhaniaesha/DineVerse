import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CHEF_ALLOWED_ROUTES = [
  // "/admin",
  "/admin/cuisines",
  "/admin/categories",
  "/admin/dishes",
  "/admin/admin-menu",
  "/admin/orders",
  "/admin/kds",
  "/admin/profile",
];

const ROLE_ROUTE_MAP = {
  "Super Admin": null,
  "Manager": [
    "/admin",
    "/admin/analytics",
    "/admin/reservations",
    "/admin/admin-menu",
    "/admin/room-bookings",
    "/admin/staff",
    "/admin/cuisines",
    "/admin/orders",
    "/admin/kds",
    "/admin/waiter-panel",
    "/admin/cafe-waiter",
    "/admin/restaurant-waiter",
    "/admin/bar-waiter",
    "/admin/cafe-chef",
    "/admin/restaurant-chef",
    "/admin/bar-chef",
    "/admin/bartender-panel",
    "/admin/manager-panel",
    "/admin/housekeeping-panel",
    "/admin/guests",
    "/admin/admin-menu",
    "/admin/tables",
    "/admin/rooms",
    "/admin/gallery",
    "/admin/blogs",
    "/admin/reviews",
    "/admin/offers",
    "/admin/inquiries",
    "/admin/content",
    "/admin/settings",
    "/admin/role-access",
    "/admin/architecture",
    "/admin/admin-users",
    "/admin/notifications",
    "/admin/profile",
    "/admin/sales-history",
  ],
  Waiter: [
    "/admin/waiter-panel",
    "/admin/cafe-waiter",
    "/admin/restaurant-waiter",
    "/admin/bar-waiter",
    "/admin/orders",
    "/admin/profile",
  ],
  "Cafe Waiter": [
    "/admin/cafe-waiter",
    "/admin/cafe-book-table",
    "/admin/cafe-menu",
    "/admin/orders",
    "/admin/billing",
    "/admin/profile",
  ],
  "Restaurant Waiter": [
    "/admin/restaurant-waiter",
    "/admin/res-book-table",
    "/admin/restaurant-menu",
    "/admin/orders",
    "/admin/billing",
    "/admin/profile",
  ],
  "Bar Waiter": [
    "/admin/bar-waiter",
    "/admin/bar-book-table",
    "/admin/bar-menu",
    "/admin/orders",
    "/admin/billing",
    "/admin/profile",
  ],
  Bartender: [
    "/admin/bartender-panel",
    "/admin/bar-menu",
    "/admin/bar-bookings",
    "/admin/profile",
  ],
  Housekeeping: [
    "/admin/housekeeping-panel",
    "/admin/room-bookings",
    // "/admin/rooms",
    "/admin/profile",
  ],
  Chef: [
    "/admin/cuisines",
    "/admin/categories",
    "/admin/dishes",
    "/admin/admin-menu",
    "/admin/orders",
    "/admin/kds",
    "/admin/profile",
  ],
  User: ["/admin"],
};

export default function AdminRouteGuard({ path, children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        color: 'var(--d-text-1)'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const role = user.role;
  const isChefRole = role === "Chef" || role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef";

  if (role === "Super Admin" || role === "Manager") {
    return children;
  }

  const allowed = isChefRole ? CHEF_ALLOWED_ROUTES : ROLE_ROUTE_MAP[role];
  if (allowed && allowed.includes(path)) {
    return children;
  }

  // Redirect to first allowed route for the role
  if (allowed && allowed.length > 0) {
    return <Navigate to={allowed[0]} replace />;
  }

  // Fallback to admin dashboard
  return <Navigate to="/admin" replace />;
}
