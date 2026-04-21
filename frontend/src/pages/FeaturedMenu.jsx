import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiCoffeeBold, PiKnifeBold } from "react-icons/pi";
import { IoWineOutline } from "react-icons/io5";
import { RiRestaurantLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdStar } from "react-icons/md";
import { IoFlameOutline } from "react-icons/io5";
import { BADGE_META } from "./Menu";
import { useMenu } from "../contexts/MenuContext";
import "./featuredMenu.css";

const TABS = [
  { id: "all",        label: "All",        icon: <HiSparkles /> },
  { id: "restaurant", label: "Restaurant", icon: <RiRestaurantLine /> },
  { id: "cafe",       label: "Café",       icon: <PiCoffeeBold /> },
  { id: "bar",        label: "Bar",        icon: <IoWineOutline /> },
];

/* ── STAR RATING ──────────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <span className="d_featured__rating">
      <MdStar className="d_featured__rating-star" />
      {rating}
    </span>
  );
}

/* ── BADGE ────────────────────────────────────────────────── */
function Badge({ type }) {
  if (!type || !BADGE_META[type]) return null;
  const meta = BADGE_META[type];
  return (
    <span className={`d_featured__badge d_featured__badge--${type}`} style={{ color: meta.color, background: meta.bg }}>
      {type === "signature" && <HiSparkles style={{ fontSize: 9 }} />}
      {type === "bestseller" && <IoFlameOutline style={{ fontSize: 9 }} />}
      {meta.label}
    </span>
  );
}

/* ── MENU CARD ────────────────────────────────────────────── */
function MenuCard({ item }) {
  const navigate = useNavigate();
  // Map Menu.js item structure to FeaturedMenu structure if needed
  const price = item.price.replace('₹', '');
  const rating = item.featured ? 4.9 : 4.7; // Mock rating for featured items
  const badge = item.badges?.[0] || (item.featured ? 'signature' : null);

  return (
    <div className="d_featured__card">
      <Badge type={badge} />

      {/* Image */}
      <div className="d_featured__img-wrap">
        <img
          src={item.img}
          alt={item.name}
          className="d_featured__img"
          loading="lazy"
        />
        {/* Hover quick-view */}
        <div className="d_featured__overlay">
          <button className="d_featured__overlay-btn" onClick={() => navigate(`/dish/${item.id}`)}>
            <PiKnifeBold style={{ fontSize: 13 }} />
            View Details
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="d_featured__body">
        <span className={`d_featured__cat d_featured__cat--${item.category}`}>
          <span className="d_featured__cat-dot" />
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </span>

        <h3 className="d_featured__name">{item.name}</h3>
        <p className="d_featured__desc">{item.desc}</p>

        <div className="d_featured__footer">
          <span className="d_featured__price">
            <span className="d_featured__price-currency">₹</span>
            {price}
          </span>
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function FeaturedMenu() {
  const [activeTab, setActiveTab] = useState("all");
  const { mappedDishes: MENU_ITEMS, loading } = useMenu();

  // Get items from Menu.js and prioritize featured ones for this section
  const FEATURED_SELECTION = MENU_ITEMS ? MENU_ITEMS.filter(item => item.featured || item.badges?.includes('signature')).slice(0, 4) : [];

  const filtered =
    activeTab === "all"
      ? FEATURED_SELECTION
      : FEATURED_SELECTION.filter((item) => item.category === activeTab);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading featured menu...</div>;
  }

  return (
    <section className="d_featured">
      <div className="d_wrapper">

        {/* Header */}
        <div className="d_featured__header">
          <p className="d_featured__eyebrow">
            <span className="d_featured__eyebrow-line" />
            Seasonal Selection
            <span className="d_featured__eyebrow-line" />
          </p>
          <h2 className="d_featured__title">
            Chef 's <em>Signature</em> Dishes
          </h2>
          <p className="d_featured__subtitle">
            Handpicked favourites from our kitchen — crafted with seasonal
            ingredients and artisan passion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="d_featured__tabs" role="tablist" aria-label="Filter menu by category">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`d_featured__tab${activeTab === tab.id ? " d_featured__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="d_featured__tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="d_featured__grid" role="tabpanel">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* CTA */}
        <div className="d_featured__cta-row">
          <Link
            to="/menu"
            className="d_featured__cta"
            aria-label="View the full menu"
            style={{ textDecoration: 'none' }}
          >
            View Full Menu
            <span className="d_featured__cta-icon">
              <RiArrowRightSLine />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}