import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import "../style/z_style.css";

const GALLERY_IMAGES = [
    { id: 1, url: "https://i.pinimg.com/736x/70/e2/4d/70e24d7713367a5e5ca1f908ef72d617.jpg", shape: "z_slide_shape_arch" }, // Restaurant Interior
    { id: 2, url: "https://i.pinimg.com/1200x/3b/32/f5/3b32f5151c15b5f7c8ce9eb1f0e9502f.jpg", shape: "z_slide_shape_square" }, // Cafe Coffee
    { id: 3, url: "https://i.pinimg.com/1200x/3e/94/ce/3e94ce6becaba0b6e1faa5f811bdeae3.jpg", shape: "z_slide_shape_pill" }, // Bar Cocktails
    { id: 4, url: "https://i.pinimg.com/736x/8d/ba/de/8dbade02b886e09ad83524a67b1375fd.jpg", shape: "z_slide_shape_diagonal" }, // Fine Dining Food
    { id: 5, url: "https://i.pinimg.com/1200x/76/e1/e3/76e1e3bea5eb4cb5cd3f043dc6ce5501.jpg", shape: "z_slide_shape_custom" }, // Cafe Interior
    { id: 6, url: "https://i.pinimg.com/1200x/1b/bc/ee/1bbceeb8ab57c6070bd545b3a7375207.jpg", shape: "z_slide_shape_arch_bottom" }, // Bar Interior
    { id: 7, url: "https://i.pinimg.com/736x/f3/c4/84/f3c48464426236c998b42fc51b643d69.jpg", shape: "z_slide_shape_pill" }, // Gourmet Dish
    { id: 8, url: "https://i.pinimg.com/736x/ec/f3/a9/ecf3a92d57be34ef9b0702378238b373.jpg", shape: "z_slide_shape_square" }, // Restaurant Pasta
];

export default function GallerySlider() {
    const [previewImage, setPreviewImage] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    // Doubling images for infinite marquee effect
    const displayImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const openPreview = (url) => {
        setPreviewImage(url);
        document.body.style.overflow = "hidden";
    };

    const closePreview = () => {
        setPreviewImage(null);
        document.body.style.overflow = "auto";
    };

    return (
        <section className="z_slide_wrapper">
            <div className="z_slide_header">
                <span className="z_slide_subtitle">Visual Experience</span>
                <h2 className="z_slide_title">A Symphony of <em>Flavors & Aesthetics</em></h2>

                <Link to="/gallerypage">
                    <button className="z_slide_view_gallery_btn">
                        View Full Gallery
                    </button>
                </Link>
            </div>

            <div
                className="z_slide_container"
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

                <div className="z_slide_track">
                    {displayImages.map((img, index) => (
                        <div
                            key={`${img.id}-${index}`}
                            className={`z_slide_item ${img.shape}`}
                            onClick={() => openPreview(img.url)}
                        >
                            <img src={img.url} alt={`Gallery ${img.id}`} className="z_slide_img" />
                            <div className="z_slide_overlay">
                                <div className="z_slide_border_inner"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="z_slide_lightbox" onClick={closePreview}>
                    <button className="z_slide_lightbox_close" onClick={closePreview}>
                        <MdClose />
                    </button>
                    <div className="z_slide_lightbox_content" onClick={(e) => e.stopPropagation()}>
                        <img src={previewImage} alt="Preview" className="z_slide_lightbox_img" />
                    </div>
                </div>
            )}
        </section>
    );
}


