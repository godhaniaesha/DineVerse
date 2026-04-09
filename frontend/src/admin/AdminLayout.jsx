import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import "../styleadmin/AdminLayout.css";
import { FaMoneyBillWave } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

/* ─── ICONS (inline SVG to remove icon-lib dependency) ─────────── */

const Icons = {
  menu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  dashboard: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  reservations: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="14" y1="14" x2="16" y2="14" />
    </svg>
  ),
  menu_items: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h12" />
    </svg>
  ),
  rooms: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M9 21V11h6v10" />
    </svg>
  ),
  gallery: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  guests: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  analytics: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  settings: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  table: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="5" rx="1" />
      <path d="M6 15v5M18 15v5M9 10V6h6v4" />
    </svg>
  ),
  blog: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  ),
  profile: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  review: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m12 17-5 3 1.5-5.5L4 10h5.5L12 4l2.5 6H20l-4.5 4.5L17 20Z" /></svg>
  ),
  offer: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7.5" cy="7.5" r="1.5" /><circle cx="16.5" cy="16.5" r="1.5" /><path d="M4 12v7a1 1 0 0 0 1 1h7l8-8a2 2 0 0 0 0-3l-5-5a2 2 0 0 0-3 0z" /></svg>
  ),
  inquiry: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  content: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  ),
  admins: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M19 8v6M16 11h6" /></svg>
  ),
  notification: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
  ),
  staff: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /></svg>
  ),
  cuisine: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 2v20M8 6h8M6 10h12M7 14h10M8 18h8" /></svg>
  ),
  category: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
  ),
  dish: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>
  ),
  order: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  ),
  pos: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M7 15h10M12 9v10" /></svg>
  ),
  kds: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8" /></svg>
  ),
  waiter: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3v8" /><path d="M8 7h8" /><path d="M10 11v10M14 11v10" /></svg>
  ),
  role: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l3 6 7 1-5 5 1 8-6-3-6 3 1-8-5-5 7-1z" /></svg>
  ),
  architecture: (
    <svg className="ad_link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="9" /></svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  pos: (<FaMoneyBillWave />), // ✅ make sure this exists

};

/* ─── NAV CONFIG ─────────────────────────────────────────────── */

const NAV_GROUPS = [
  {
    label: "Overview",
    links: [
      { to: "/admin", end: true, label: "Dashboard", icon: Icons.dashboard },
      { to: "/admin/analytics", label: "Analytics", icon: Icons.analytics },
    ],
  },
  {
    label: "Manage",
    links: [
      { to: "/admin/reservations", label: "Reservations", icon: Icons.reservations, badge: "12" },
      { to: "/admin/admin-menu", label: "Menu Items", icon: Icons.menu_items },
      { to: "/admin/cafe-bookings", label: "Cafe Bookings", icon: Icons.reservations },
      { to: "/admin/cafe-menu", label: "Cafe Menu", icon: Icons.menu_items },
      { to: "/admin/restaurant-bookings", label: "Restaurant Bookings", icon: Icons.reservations },
      { to: "/admin/restaurant-menu", label: "Restaurant Menu", icon: Icons.menu_items },
      { to: "/admin/bar-bookings", label: "Bar Bookings", icon: Icons.reservations },
      { to: "/admin/bar-menu", label: "Bar Menu", icon: Icons.menu_items },
      { to: "/admin/room-bookings", label: "Room Bookings", icon: Icons.reservations },
      { to: "/admin/room-types", label: "Room Types", icon: Icons.rooms },
      { to: "/admin/rooms", label: "Rooms", icon: Icons.rooms },
      { to: "/admin/cafe-book-table", label: "Cafe Book Table", icon: Icons.table },
      { to: "/admin/res-book-table", label: "Restaurant Book Table", icon: Icons.table },
      { to: "/admin/bar-book-table", label: "Bar Book Table", icon: Icons.table },
      { to: "/admin/staff", label: "Staff Management", icon: Icons.staff },
      { to: "/admin/cuisines", label: "Cuisine Management", icon: Icons.cuisine },
      { to: "/admin/categories", label: "Categories", icon: Icons.category },
      { to: "/admin/dishes", label: "Dishes", icon: Icons.dish },
      { to: "/admin/orders", label: "Order Management", icon: Icons.order },
      { to: "/admin/billing", label: "Billing & Payments", icon: Icons.pos },
      { to: "/admin/cafe-order-manage", label: "Cafe Orders", icon: Icons.order },
      { to: "/admin/res-order-manage", label: "Restaurant Orders", icon: Icons.order },
      { to: "/admin/bar-order-manage", label: "Bar Orders", icon: Icons.order },
      { to: "/admin/kds", label: "Kitchen Display", icon: Icons.kds },
      { to: "/admin/bartender-panel", label: "Bartender", icon: Icons.offer },
      { to: "/admin/housekeeping-panel", label: "Housekeeping", icon: Icons.rooms },
      { to: "/admin/pos", label: "POS Billing", icon: Icons.pos },
      { to: "/admin/guests", label: "Guests", icon: Icons.guests },
      { to: "/admin/gallery", label: "Gallery", icon: Icons.gallery },
      { to: "/admin/blogs", label: "Blogs", icon: Icons.blog },
      { to: "/admin/reviews", label: "Reviews", icon: Icons.review },
      { to: "/admin/offers", label: "Offers", icon: Icons.offer },
      { to: "/admin/inquiries", label: "Inquiries", icon: Icons.inquiry },
      { to: "/admin/sales-history", label: "Sales History", icon: Icons.pos },
    ],
  },
  {
    label: "System",
    links: [
      { to: "/admin/role-access", label: "Role Access", icon: Icons.role },
      { to: "/admin/architecture", label: "Architecture", icon: Icons.architecture },
      { to: "/admin/admin-users", label: "Admin Users", icon: Icons.admins },
      { to: "/admin/profile", label: "Profile", icon: Icons.profile },
    ],
  },
];

const CHEF_ALLOWED_LINKS = [
  "/admin",
  "/admin/cuisines",
  "/admin/categories",
  "/admin/dishes",
  "/admin/admin-menu",
  "/admin/orders",
  "/admin/kds",
  "/admin/profile",
];

/* ─── PAGE TITLE MAP ─────────────────────────────────────────── */

const PAGE_TITLES = {
  "/admin": { title: "Dashboard", sub: "Overview" },
  "/admin/analytics": { title: "Analytics", sub: "Reports & insights" },
  "/admin/reservations": { title: "Reservations", sub: "Manage bookings" },
  "/admin/cafe-bookings": { title: "Cafe Bookings", sub: "Cafe reservations" },
  "/admin/cafe-menu": { title: "Cafe Menu", sub: "Cafe food & drinks" },
  "/admin/restaurant-bookings": { title: "Restaurant Bookings", sub: "Restaurant reservations" },
  "/admin/restaurant-menu": { title: "Restaurant Menu", sub: "Restaurant dishes" },
  "/admin/bar-bookings": { title: "Bar Bookings", sub: "Bar reservations" },
  "/admin/bar-menu": { title: "Bar Menu", sub: "Bar drinks menu" },
  "/admin/room-bookings": { title: "Room Bookings", sub: "Hotel room reservations" },
  "/admin/staff": { title: "Staff Management", sub: "Employees and shifts" },
  "/admin/cuisines": { title: "Cuisine Management", sub: "Cuisine and categories" },
  "/admin/categories": { title: "Category Management", sub: "Cuisine categories" },
  "/admin/dishes": { title: "Dish Management", sub: "Menu dishes" },
  "/admin/orders": { title: "Order Management", sub: "Kitchen order flow" },
  "/admin/billing": { title: "Billing & Payments", sub: "Final bills and checkout" },
  "/admin/cafe-order-manage": { title: "Cafe Orders", sub: "Cafe kitchen flow" },
  "/admin/res-order-manage": { title: "Restaurant Orders", sub: "Restaurant kitchen flow" },
  "/admin/bar-order-manage": { title: "Bar Orders", sub: "Bar kitchen flow" },
  "/admin/inventory": { title: "Inventory", sub: "Stock tracking" },
  "/admin/kds": { title: "Kitchen Display", sub: "Chef order queue" },
  "/admin/waiter-panel": { title: "Waiter Panel", sub: "Table and service control" },
  "/admin/cafe-waiter": { title: "Cafe Waiter", sub: "Cafe tables and orders" },
  "/admin/restaurant-waiter": { title: "Restaurant Waiter", sub: "Restaurant tables and service" },
  "/admin/bar-waiter": { title: "Bar Waiter", sub: "Bar service and seat flow" },
  "/admin/cafe-chef": { title: "Cafe Chef", sub: "Cafe kitchen queue" },
  "/admin/restaurant-chef": { title: "Restaurant Chef", sub: "Main kitchen queue" },
  "/admin/bar-chef": { title: "Bar Chef", sub: "Bar preparation queue" },
  "/admin/bartender-panel": { title: "Bartender", sub: "Drink preparation" },
  "/admin/manager-panel": { title: "Manager", sub: "Operations control" },
  "/admin/housekeeping-panel": { title: "Housekeeping", sub: "Room cleaning tasks" },
  "/admin/guests": { title: "Guests", sub: "Guest profiles" },
  "/admin/rooms": { title: "Rooms", sub: "Room management" },
  "/admin/admin-menu": { title: "Menu Items", sub: "Food & beverage" },
  "/admin/cafe-book-table": { title: "Cafe Book Table", sub: "Cafe table bookings" },
  "/admin/res-book-table": { title: "Restaurant Book Table", sub: "Restaurant table bookings" },
  "/admin/bar-book-table": { title: "Bar Book Table", sub: "Bar table bookings" },
  "/admin/room-types": { title: "Room Types", sub: "Room categories & pricing" },
  "/admin/gallery": { title: "Gallery", sub: "Media library" },
  "/admin/blogs": { title: "Blogs", sub: "Content manager" },
  "/admin/reviews": { title: "Reviews", sub: "Ratings & feedback" },
  "/admin/offers": { title: "Offers", sub: "Promotions manager" },
  "/admin/inquiries": { title: "Inquiries", sub: "Contact messages" },
  "/admin/sales-history": { title: "Sales History", sub: "Completed payments records" },
  "/admin/content": { title: "Content", sub: "Static pages editor" },
  "/admin/settings": { title: "Settings", sub: "System preferences" },
  "/admin/role-access": { title: "Role Access", sub: "RBAC permissions" },
  "/admin/architecture": { title: "Architecture", sub: "Backend and deployment" },
  "/admin/admin-users": { title: "Admin Users", sub: "Roles & permissions" },
  "/admin/notifications": { title: "Notifications", sub: "Alerts & channels" },
  "/admin/profile": { title: "Profile", sub: "Account details" },
};

/* ─── COMPONENT ─────────────────────────────────────────────── */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const adminRole = localStorage.getItem("adminRole") || "Super Admin";
  const adminName = localStorage.getItem("adminName") || "Admin User";
  const isChefRole = adminRole === "Cafe Chef" || adminRole === "Restaurant Chef" || adminRole === "Bar Chef";

  const roleAllowedLinks = {
    "Super Admin": [
      "/admin",
      "/admin/admin-menu",
      "/admin/analytics",
      "/admin/reservations",
      "/admin/cafe-bookings",
      "/admin/restaurant-bookings",
      "/admin/bar-bookings",
      "/admin/room-bookings",
      "/admin/staff",
      "/admin/guests",
      // "/admin/cafe-book-table",
      // "/admin/res-book-table",
      // "/admin/bar-book-table",
      "/admin/rooms",
      "/admin/room-types",
      "/admin/blogs",
      "/admin/reviews",
      "/admin/inquiries",
      "/admin/admin-users",
      "/admin/profile",
      "/admin/sales-history",
    ],
    Manager: [
      "/admin",
      "/admin/admin-menu",
      "/admin/analytics",
      "/admin/reservations",
      "/admin/cafe-bookings",
      "/admin/restaurant-bookings",
      "/admin/bar-bookings",
      "/admin/room-bookings",
      "/admin/staff",
      "/admin/cuisines",
      "/admin/categories",
      "/admin/dishes",
      "/admin/orders",
      "/admin/housekeeping-panel",
      "/admin/guests",
      // "/admin/cafe-book-table",
      // "/admin/res-book-table",
      // "/admin/bar-book-table",
      "/admin/rooms",
      "/admin/room-types",
      "/admin/gallery",
      "/admin/blogs",
      "/admin/reviews",
      "/admin/inquiries",
      "/admin/profile",
      "/admin/sales-history",
    ],
    Waiter: [
      "/admin",
      "/admin/waiter-panel",
      "/admin/cafe-waiter",
      "/admin/restaurant-waiter",
      "/admin/bar-waiter",
      "/admin/orders",
      "/admin/billing",
      "/admin/profile",
    ],
    "Cafe Waiter": [
      "/admin",
      "/admin/cafe-book-table",
      "/admin/cafe-menu",
      "/admin/cafe-waiter",
      "/admin/orders",
      "/admin/billing",
      "/admin/profile",
    ],
    "Restaurant Waiter": [
      "/admin",
      "/admin/res-book-table",
      "/admin/restaurant-menu",
      "/admin/restaurant-waiter",
      "/admin/orders",
      "/admin/billing",
      "/admin/profile",
    ],
    "Bar Waiter": [
      "/admin",
      "/admin/bar-book-table",
      "/admin/bar-menu",
      "/admin/bar-waiter",
      "/admin/orders",
      "/admin/billing",
      "/admin/profile",
    ],
    Bartender: [
      "/admin",
      "/admin/bartender-panel",
      "/admin/bar-menu",
      "/admin/bar-bookings",
      "/admin/profile",
    ],
    Housekeeping: [
      "/admin",
      "/admin/housekeeping-panel",
      "/admin/room-bookings",
      "/admin/profile",
    ],
  };

  const allowedLinks = isChefRole ? CHEF_ALLOWED_LINKS : roleAllowedLinks[adminRole] ?? [];

  const filteredNavGroups = NAV_GROUPS
    .map((group) => ({
      ...group,
      links: group.links.filter((link) =>
        allowedLinks === null || allowedLinks.includes(link.to)
      ),
    }))
    .filter((group) => group.links.length);

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: "Admin", sub: "DineVerse" };

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* Prevent body scroll when sidebar open on mobile */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) setUserMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="ad_shell">

      {/* ── OVERLAY ── */}
      <div
        className={`ad_overlay${sidebarOpen ? " ad_overlay--visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ── SIDEBAR ── */}
      <aside
        ref={sidebarRef}
        className={`ad_sidebar${sidebarOpen ? " ad_sidebar--open" : ""}`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="ad_sidebar__head">
          <div className="ad_logo">
            <div className="ad_logo__emblem">
              <div className="ad_logo__emblem-bg">
                <span className="ad_logo__emblem-icon">
                 <HiSparkles></HiSparkles>
                </span>
              </div>
            </div>
            <div className="ad_logo__text">
              <span className="ad_logo__name">DineVerse</span>
              <span className="ad_logo__label">Admin Console</span>
            </div>
          </div>
          <button
            className="ad_sidebar__close"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            {Icons.close}
          </button>
        </div>

        {/* Nav body */}
        <div className="ad_sidebar__body">
          {filteredNavGroups.map((group) => (
            <div className="ad_nav_group" key={group.label}>
              <span className="ad_nav_group__label">{group.label}</span>
              <nav className="ad_nav" aria-label={group.label}>
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `ad_link${isActive ? " ad_link--active" : ""}${link.parent ? " ad_link--child" : ""}`
                    }
                    style={link.parent ? { paddingLeft: "2.5rem" } : {}}
                  >
                    {link.icon}
                    {link.label}
                    {link.badge && (
                      <span className="ad_link__badge">{link.badge}</span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer user card */}
        <div className="ad_sidebar__foot">
          <div className="ad_user_card" role="button" tabIndex={0} aria-label="Account menu">
            <div className="ad_user_avatar">{adminName?.[0] || "A"}</div>
            <div className="ad_user_info">
              <div className="ad_user_name">{adminName}</div>
              <div className="ad_user_role">{adminRole}</div>
            </div>
            <span className="ad_user_chevron">{Icons.chevron}</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ad_main">

        {/* Topbar */}
        <header className="ad_topbar">
          <button
            className="ad_topbar__toggle"
            onClick={openSidebar}
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            {Icons.menu}
          </button>

          <div className="ad_topbar__title_area">
            <div className="ad_topbar__title">{pageInfo.title}</div>
            <div className="ad_topbar__breadcrumb">
              DineVerse <span>/</span> {pageInfo.sub}
            </div>
          </div>

          <div className="ad_topbar__actions">
            {/* <button className="ad_topbar__icon_btn" aria-label="Search">
              {Icons.search}
            </button>

            <button className="ad_topbar__icon_btn" aria-label="Notifications">
              {Icons.bell}
              <span className="ad_topbar__notif_dot" />
            </button> */}

            {/* <div className="ad_topbar__divider" aria-hidden="true" /> */}

            <button
              className="ad_topbar__user_btn"
              aria-label="Account menu"
              onClick={(event) => {
                event.stopPropagation();
                setUserMenuOpen((value) => !value);
              }}
            >
              <div className="ad_topbar__avatar">AD</div>
              {/* <span className="ad_topbar__user_name">Admin User</span> */}
              {/* {Icons.chevron} */}
            </button>
            <div ref={userMenuRef} className={`ad_user_menu${userMenuOpen ? " ad_user_menu--open" : ""}`}>
              <NavLink className="ad_user_menu__item" to="/admin/profile">My Profile</NavLink>
              <button className="ad_user_menu__item" type="button">Logout</button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="ad_content">
          <Outlet />
        </section>

      </main>
    </div>
  );
}
