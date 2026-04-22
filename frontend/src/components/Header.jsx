import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiClock } from "react-icons/fi";
import { MdTableRestaurant, MdHotel, MdLogout, MdPerson, MdLogin, MdAppRegistration, MdArrowForward } from "react-icons/md";
import { IoWineOutline } from "react-icons/io5";
import { PiCoffeeBold, PiKnifeBold } from "react-icons/pi";
import { RiRestaurantLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import "./header.css";
import { useMenu } from "../contexts/MenuContext";

/* ── DATA ─────────────────────────────────────────────────── */

const NAV_LINKS = [
  {
    id: "cafe",
    label: "Café",
    href: "/cafe",
    icon: <PiCoffeeBold />,
    sub: "Artisan coffee & pastries",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    href: "/restaurant",
    icon: <RiRestaurantLine />,
    sub: "Fine dining experience",
  },
  {
    id: "bar",
    label: "Bar",
    href: "/bar",
    icon: <IoWineOutline />,
    sub: "Craft cocktails & wine",
  },
  {
    id: "room",
    label: "Rooms",
    href: "/rooms",
    icon: <MdHotel />,
    sub: "Luxury stays",
  },
  {
    id: "menu",
    label: "Menu",
    href: "/menu",
    icon: <PiKnifeBold />,
    sub: "Full seasonal menu",
  },
];

const STRIP_ITEMS = [
  "Open Daily 8AM – 2AM",
  "Café · Restaurant · Bar · Rooms",
  "Reserve Your Table",
  "Luxury Rooms Available",
  "Craft Cocktails & Wine",
  "Private Dining Events",
  "Book Your Stay Tonight",
  "Seasonal Tasting Menu",
];

const SEARCH_TAGS = [
  "Espresso", "Pasta", "Cocktails",
  "Brunch", "Fine Wine", "Suite", "Vegan", "Tasting Menu",
];

/* ── LOGO ─────────────────────────────────────────────────── */
function Logo({ onClick }) {
  return (
    <Link to="/" className="d_logo" onClick={onClick} aria-label="DineVerse home">
      <div className="d_logo__emblem">
        <div className="d_logo__emblem-bg">
          <span className="d_logo__emblem-icon"><HiSparkles /></span>
        </div>
      </div>
      <div className="d_logo__wordmark">
        <span className="d_logo__name">DineVerse</span>
        <span className="d_logo__sub">Café · Dining · Bar · Rooms</span>
      </div>
    </Link>
  );
}

/* ── HAMBURGER ────────────────────────────────────────────── */
function Hamburger({ open, onClick }) {
  return (
    <button
      className={`d_hamburger${open ? " d_hamburger--open" : ""}`}
      onClick={onClick}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      aria-controls="d-drawer"
    >
      <span className="d_hamburger__bar" />
      <span className="d_hamburger__bar" />
      <span className="d_hamburger__bar" />
    </button>
  );
}

/* ── SEARCH OVERLAY ───────────────────────────────────────── */
function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { mappedDishes: MENU_ITEMS } = useMenu();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 90);
      setQuery("");
      setResults([]);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim() || !MENU_ITEMS) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = MENU_ITEMS.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    ).slice(0, 6); // Limit results for better UI

    setResults(filtered);
  }, [query, MENU_ITEMS]);

  const handleResultClick = (id) => {
    navigate(`/dish/${id}`);
    onClose();
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <div
      className={`d_search${open ? " d_search--open" : ""}`}
      role="dialog"
      aria-label="Search"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="d_search__panel">
        <div className="d_search__row">
          <span className="d_search__icon"><FiSearch /></span>
          <input
            ref={inputRef}
            className="d_search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menus, dishes, rooms, drinks…"
            aria-label="Search query"
          />
          <button
            className="d_btn-ghost"
            onClick={onClose}
            aria-label="Close search"
            style={{ fontSize: "18px" }}
          >
            ✕
          </button>
        </div>

        {results.length > 0 ? (
          <div className="d_search__results">
            <div className="d_search__results-label">Menu Items Found</div>
            <div className="d_search__results-grid">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="d_search__result-card"
                  onClick={() => handleResultClick(item.id)}
                >
                  <div className="d_search__result-img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="d_search__result-info">
                    <div className="d_search__result-top">
                      <span className="d_search__result-name">{item.name}</span>
                      <span className="d_search__result-price">{item.price}</span>
                    </div>
                    <p className="d_search__result-desc">{item.desc}</p>
                    <div className="d_search__result-meta">
                      <span className="d_search__result-tag">{item.tag}</span>
                      <span className="d_search__result-time"><FiClock size={12} /> {item.time}</span>
                    </div>
                  </div>
                  <MdArrowForward className="d_search__result-arrow" />
                </div>
              ))}
            </div>
          </div>
        ) : query.trim() !== "" ? (
          <div className="d_search__no-results">
            <p>No dishes found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="d_search__tags">
            {SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                className="d_search__tag"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MOBILE DRAWER ────────────────────────────────────────── */
function Drawer({ open, onClose, onBookTable, onBookRoom, isLoggedIn, onLogout }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`d_backdrop${open ? " d_backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="d-drawer"
        className={`d_drawer${open ? " d_drawer--open" : ""}`}
        aria-label="Site navigation"
      >
        {/* Header */}
        <div className="d_drawer__head">
          <Logo onClick={onClose} />
          <button
            className="d_btn-ghost"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Nav links — NO dots, icon cards */}
        <nav className="d_drawer__body">
          {/* User Section for Mobile */}
          <div className="d_drawer__user">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="d_drawer__user-link" onClick={onClose}>
                  <div className="d_drawer__user-icon"><MdPerson /></div>
                  <span>My Profile</span>
                </Link>
                <button className="d_drawer__user-link d_drawer__user-link--logout" onClick={() => { onLogout(); onClose(); }}>
                  <div className="d_drawer__user-icon"><MdLogout /></div>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="d_drawer__user-link" onClick={onClose}>
                  <div className="d_drawer__user-icon"><MdLogin /></div>
                  <span>Login / Register</span>
                </Link>

              </>
            )}
          </div>

          <div className="d_drawer__sep" />

          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="d_drawer__link"
              onClick={onClose}
            >
              <div className={`d_drawer__link-icon d_drawer__link-icon--${link.id}`}>
                {link.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="d_drawer__link-text">{link.label}</div>
                <div className="d_drawer__link-sub">{link.sub}</div>
              </div>
              <RiArrowRightSLine className="d_drawer__link-arrow" />
            </Link>
          ))}

          <div className="d_drawer__sep" />
        </nav>

        {/* Footer CTAs */}
        <div className="d_drawer__foot">
          <button
            className="d_drawer__cta d_drawer__cta--table"
            onClick={() => { onClose(); onBookTable(); }}
          >
            <MdTableRestaurant size={18} />
            Reserve a Table
          </button>
          <button
            className="d_drawer__cta d_drawer__cta--room"
            onClick={() => { onClose(); onBookRoom(); }}
          >
            <MdHotel size={18} />
            Book a Room
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── MARQUEE STRIP ────────────────────────────────────────── */
function Strip() {
  const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS];
  return (
    <div className="d_strip" aria-hidden="true">
      <div className="d_strip__track">
        {doubled.map((text, i) => (
          <span className="d_strip__item" key={i}>
            <span className="d_strip__gem">◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN HEADER ──────────────────────────────────────────── */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminName") || !!localStorage.getItem("userName"));
  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);

  /* Scroll listener */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const activeLink = NAV_LINKS.find(link => link.href === currentPath);
    if (activeLink) {
      setActiveNav(activeLink.id);
    } else {
      setActiveNav("");
    }
  }, [location.pathname]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = (searchOpen || drawerOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, drawerOpen]);

  /* Escape key & Click outside */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDrawerOpen(false);
        setUserDropdownOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookTable = () => navigate("/bookTable");
  const handleBookRoom = () => navigate("/bookRoom");

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("userName");
    localStorage.clear();
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ── FIXED HEADER ── */}
      <header className={`d_header${scrolled ? " d_header--scrolled" : ""}`}>
        <div className="d_header__bar">

          {/* Logo */}
          <Logo />

          {/* Desktop nav — NO dots, underline reveal */}
          <nav className="d_nav" aria-label="Main navigation">
            <ul className="d_nav" style={{ padding: 0 }}>
              {NAV_LINKS.map((link, i) => (
                <React.Fragment key={link.id}>
                  <li className="d_nav__item">
                    <Link
                      to={link.href}
                      className={[
                        "d_nav__link",
                        `d_nav__link--${link.id}`,
                        activeNav === link.id ? "d_nav__link--active" : "",
                      ].filter(Boolean).join(" ")}
                      aria-current={activeNav === link.id ? "page" : undefined}
                    >
                      <span className="d_nav__link-icon" aria-hidden="true">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                  {/* Separator between items, not after last */}
                  {i < NAV_LINKS.length - 1 && (
                    <li key={`sep-${i}`} aria-hidden="true">
                      <div className="d_nav__sep" />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="d_actions">
            {/* Search */}
            <button
              className="d_btn-ghost"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search"
            >
              <FiSearch />
            </button>

            {/* User Profile / Login Dropdown */}
            <div className="d_user_dropdown" ref={userDropdownRef}>
              <button
                className={`d_btn-ghost d_user_btn ${userDropdownOpen ? "d_user_btn--active" : ""}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User account"
                title="Account"
              >
                <FiUser />
              </button>

              {userDropdownOpen && (
                <div className="d_user_menu">
                  <div className="d_user_menu__header">
                    <span className="d_user_menu__title">Account Settings</span>
                  </div>
                  <div className="d_user_menu__body">
                    {isLoggedIn ? (
                      <>
                        <Link to="/profile" className="d_user_menu__link" onClick={() => setUserDropdownOpen(false)}>
                          <MdPerson className="d_user_menu__icon" />
                          <span>My Profile</span>
                        </Link>
                        <div className="d_user_menu__sep" />
                        <button className="d_user_menu__link d_user_menu__link--logout" onClick={handleLogout}>
                          <MdLogout className="d_user_menu__icon" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth" className="d_user_menu__link" onClick={() => setUserDropdownOpen(false)}>
                          <MdLogin className="d_user_menu__icon" />
                          <span>Login / Register</span>
                        </Link>

                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Book Room — outlined, desktop only */}
            <button
              className="d_btn-room"
              onClick={handleBookRoom}
              aria-label="Book a room"
            >
              <MdHotel size={16} />
              <span className="d_btn-label">Book Room</span>
            </button>

            {/* Book Table — gold, desktop only */}
            <button
              className="d_btn-table"
              onClick={handleBookTable}
              aria-label="Reserve a table"
            >
              <MdTableRestaurant size={16} />
              <span className="d_btn-label">Reserve Table</span>
            </button>

            {/* Hamburger — mobile only */}
            <Hamburger
              open={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            />
          </div>
        </div>
      </header>

      {/* ── MARQUEE STRIP ── */}
      <Strip />

      {/* ── SEARCH ── */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ── MOBILE DRAWER ── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onBookTable={handleBookTable}
        onBookRoom={handleBookRoom}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Page content pusher */}
      <div className="d_spacer" aria-hidden="true" />
    </>
  );
}