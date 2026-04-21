import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useGallery } from "../contexts/GalleryContext";
import "../style/z_style.css";

const SHAPES = [
    "z_slide_shape_arch",
    "z_slide_shape_square",
    "z_slide_shape_pill",
    "z_slide_shape_diagonal",
    "z_slide_shape_custom",
    "z_slide_shape_arch_bottom",
    "z_slide_shape_circle",
];

export default function GallerySlider() {
    const { images, loading } = useGallery();
    const [previewImage, setPreviewImage] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    // Filter only visible images and map them with shapes (limit to first 6)
    const visibleImages = images
        .filter((img) => img.visibility === "Visible")
        .slice(0, 7)
        .map((img, index) => ({
            ...img,
            id: img._id,
            shape: SHAPES[index % SHAPES.length],
        }));

    // Doubling images for infinite marquee effect
    const displayImages = [...visibleImages, ...visibleImages];

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

    if (loading) return null; // Or a small loader if preferred

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
                            onClick={() => openPreview(img.img)}
                        >
                            <img src={img.img} alt={`Gallery ${img.id}`} className="z_slide_img" />
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


