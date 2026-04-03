import { useState, useEffect, useRef } from "react";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { TbMaximize } from "react-icons/tb";
import { PiFrameCornersBold } from "react-icons/pi";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import "../style/GalleryPage.css";

/* ── GALLERY DATA ─────────────────────────────────────────── */
const GALLERY = [
  {
    id: 1,
    title: "The Dining Room at Dusk",
    category: "Restaurant",
    tag: "restaurant",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    shape: "z_slide_shape_arch",
  },
  {
    id: 2,
    title: "Truffle Risotto",
    category: "Signature Dish",
    tag: "food",
    img: "https://recipes.net/wp-content/uploads/2023/05/chanterelle-mushroom-risotto_f34effca58384b447accde25b8a6adc1.jpeg",
    shape: "z_slide_shape_square",
  },
  {
    id: 3,
    title: "The Midnight Bar",
    category: "Bar & Lounge",
    tag: "bar",
    img: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=700&q=80",
    shape: "z_slide_shape_pill",
  },
  {
    id: 4,
    title: "Anniversary Celebration",
    category: "Events",
    tag: "events",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80",
    shape: "z_slide_shape_diagonal",
  },
  {
    id: 5,
    title: "Midnight Negroni",
    category: "Bar & Lounge",
    tag: "bar",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    shape: "z_slide_shape_custom",
  },
  {
    id: 6,
    title: "The Grand Suite",
    category: "Rooms",
    tag: "rooms",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    shape: "z_slide_shape_arch_bottom",
  },
  {
    id: 7,
    title: "Smoked Duck Breast",
    category: "Signature Dish",
    tag: "food",
    img: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80",
    shape: "z_slide_shape_pill",
  },
  {
    id: 8,
    title: "Private Dining",
    category: "Events",
    tag: "events",
    img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=700&q=80",
    shape: "z_slide_shape_square",
  },
  {
    id: 9,
    title: "Burrata & Heirloom",
    category: "Café & Small Plates",
    tag: "cafe",
    img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80",
    shape: "z_slide_shape_arch",
  },
  {
    id: 10,
    title: "Wine Cellar",
    category: "Bar & Lounge",
    tag: "bar",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80",
    shape: "z_slide_shape_diagonal",
  },
  {
    id: 11,
    title: "Table by the Window",
    category: "Restaurant",
    tag: "restaurant",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    shape: "z_slide_shape_custom",
  },
  {
    id: 12,
    title: "Cardamom Latte Art",
    category: "Café",
    tag: "cafe",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    shape: "z_slide_shape_pill",
  },

  // extra restaurant / ambiance
  {
    id: 13,
    title: "Chef’s Counter",
    category: "Restaurant",
    tag: "restaurant",
    img: "https://images.unsplash.com/photo-1544022613-8dac05c2e26b?w=700&q=80",
    shape: "z_slide_shape_arch",
  },
  {
    id: 14,
    title: "Open Kitchen Pass",
    category: "Restaurant",
    tag: "restaurant",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=80",
    shape: "z_slide_shape_square",
  },

  // extra café
  {
    id: 15,
    title: "Morning Pastry Stand",
    category: "Café",
    tag: "cafe",
    img: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=700&q=80",
    shape: "z_slide_shape_pill",
  },
  {
    id: 16,
    title: "Reading Corner",
    category: "Café",
    tag: "cafe",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&q=80",
    shape: "z_slide_shape_diagonal",
  },

  // extra bar
  {
    id: 17,
    title: "Golden Hour Cocktails",
    category: "Bar & Lounge",
    tag: "bar",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=700&q=80",
    shape: "z_slide_shape_custom",
  },
  {
    id: 18,
    title: "Mixology in Motion",
    category: "Bar & Lounge",
    tag: "bar",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    shape: "z_slide_shape_arch_bottom",
  },

  // extra rooms
  {
    id: 19,
    title: "Suite Living Room",
    category: "Rooms",
    tag: "rooms",
    img: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&q=80",
    shape: "z_slide_shape_pill",
  },
  {
    id: 20,
    title: "Evening Turndown",
    category: "Rooms",
    tag: "rooms",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80",
    shape: "z_slide_shape_square",
  },

  // extra events
  {
    id: 21,
    title: "Intimate Celebration",
    category: "Events",
    tag: "events",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80",
    shape: "z_slide_shape_arch",
  },
  {
    id: 22,
    title: "Garden Reception",
    category: "Events",
    tag: "events",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80",
    shape: "z_slide_shape_diagonal",
  },
];

const TABS = [
  { id: "all",        label: "All",        icon: <MdOutlinePhotoLibrary /> },
  { id: "restaurant", label: "Restaurant", icon: <HiSparkles /> },
  { id: "cafe",       label: "Café",       icon: <HiSparkles /> },
  { id: "bar",        label: "Bar",        icon: <PiFrameCornersBold /> },
  { id: "rooms",      label: "Rooms",      icon: <HiSparkles /> },
  { id: "events",     label: "Events",     icon: <HiSparkles /> },
];

/* ── LIGHTBOX ─────────────────────────────────────────────── */
function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onNav]);

  if (!item) return null;

  return (
    <div
      className="gp_lightbox gp_lightbox--open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        className="gp_lightbox__close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="gp_lightbox__panel">
        <button
          className="gp_lightbox__nav gp_lightbox__nav--prev"
          onClick={() => onNav(-1)}
          aria-label="Previous"
        >
          <RiArrowLeftSLine />
        </button>

        <div className="gp_lightbox__img-wrap">
          <img src={item.img} alt={item.title} className="gp_lightbox__img" />
        </div>

        <div className="gp_lightbox__info">
          <div>
            <div className="gp_lightbox__title">{item.title}</div>
            <div className="gp_lightbox__cat">{item.category}</div>
          </div>
          <span className="gp_lightbox__counter">
            {index + 1} / {items.length}
          </span>
        </div>

        <button
          className="gp_lightbox__nav gp_lightbox__nav--next"
          onClick={() => onNav(1)}
          aria-label="Next"
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ────────────────────────────────────────────── */
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  const filtered =
    activeTab === "all"
      ? GALLERY
      : GALLERY.filter((g) => g.tag === activeTab);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
    document.body.style.overflow = "";
  };

  const navLightbox = (dir) =>
    setLightboxIdx((i) => (i + dir + filtered.length) % filtered.length);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <main className="gp_page">
      {/* HERO */}
      <section className="gp_hero">
        <div className="gp_container">
          <span className="gp_eyebrow">Spaces & Moments</span>
          <h1 className="gp_title">Gallery</h1>
          <p className="gp_intro">
            Restaurant, café, bar, rooms, and events — a quiet tour of the
            corners that make our house feel like a second home.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gp_section">
        <div className="gp_container">
          {/* Tabs */}
          <div className="gp_tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={
                  "gp_tab" +
                  (activeTab === tab.id ? " gp_tab--active" : "")
                }
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="gp_tab_icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Masonry grid with custom cursor logic restricted to the grid area */}
          <div 
            className="gp_grid_area"
            style={{ position: "relative" }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Custom Cursor Follower */}
            <div
              className={`z_slide_cursor_follower ${isHovering ? 'z_active' : ''}`}
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`
              }}
            >
              <span>VIEW</span>
            </div>

            <div className="gp_grid" role="tabpanel">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className={`gp_item ${item.shape}`}
                  onClick={() => openLightbox(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title}`}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="gp_item_img"
                    loading="lazy"
                  />
                  <div className="gp_item_overlay">
                    <div className="gp_item_caption">
                      <span className="gp_item_title">{item.title}</span>
                      <span className="gp_item_cat">{item.category}</span>
                    </div>
                  </div>
                  <span className="gp_item_expand" aria-hidden="true">
                    <TbMaximize />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIdx}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </main>
  );
}