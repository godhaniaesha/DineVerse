import { useState, useEffect, useRef } from "react";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { TbMaximize } from "react-icons/tb";
import { PiFrameCornersBold } from "react-icons/pi";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { useGallery } from "../contexts/GalleryContext";
import "../style/GalleryPage.css";
import "../style/z_style.css";

/* ── SHAPES FOR MASONRY ───────────────────────────────────── */
const SHAPES = [
  "z_slide_shape_arch",
  "z_slide_shape_square",
  "z_slide_shape_pill",
  "z_slide_shape_diagonal",
  "z_slide_shape_custom",
  "z_slide_shape_arch_bottom",
];

const TABS = [
  { id: "all", label: "All", icon: <MdOutlinePhotoLibrary /> },
  { id: "Ambiance", label: "Ambiance", icon: <HiSparkles /> },
  { id: "Dishes", label: "Dishes", icon: <HiSparkles /> },
  { id: "Bar", label: "Bar", icon: <PiFrameCornersBold /> },
  { id: "Events", label: "Events", icon: <HiSparkles /> },
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
  const { images, loading } = useGallery();
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Filter only visible images and map them with shapes
  const allVisibleImages = images
    .filter((img) => img.visibility === "Visible")
    .map((img, index) => ({
      ...img,
      id: img._id,
      shape: SHAPES[index % SHAPES.length],
    }));

  const filtered =
    activeTab === "all"
      ? allVisibleImages
      : allVisibleImages.filter((g) => g.category === activeTab);

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
      y: e.clientY - rect.top,
    });
  };

  if (loading) {
    return (
      <div className="gp_page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="gp_title">Loading Gallery...</div>
      </div>
    );
  }

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
                  "gp_tab" + (activeTab === tab.id ? " gp_tab--active" : "")
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
              className={`z_slide_cursor_follower ${isHovering ? "z_active" : ""}`}
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
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
                      <span className="gp_item_expand" aria-hidden="true">
                        <TbMaximize />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No images found in this category.
              </div>
            )}
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
