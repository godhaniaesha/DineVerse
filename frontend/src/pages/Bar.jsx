import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdWineBar, MdNightlife, MdLocalBar, MdEvent } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const COCKTAILS = [
    {
        id: 1,
        name: "Smoked Old Fashioned",
        desc: "A timeless classic with a smoky twist of hickory and oak.",
        price: "$18",
        img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
    },
    {
        id: 2,
        name: "Purple Rain",
        desc: "Gin-based with elderflower, lavender syrup, and a touch of magic.",
        price: "$16",
        img: "https://i.pinimg.com/1200x/00/ff/a9/00ffa9058a23ab970de330254f7fed87.jpg"
    },
    {
        id: 3,
        name: "Spiced Margarita",
        desc: "Tequila Blanco with jalapeño, lime juice, and a tajin rim.",
        price: "$15",
        img: "https://i.pinimg.com/1200x/79/13/fe/7913fe6a2072c30055993aa70815e86d.jpg"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: "They say about us",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        author: "BY DORA JOHNS / SOMALIER"
    },
    {
        id: 2,
        title: "They say about us",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        author: "BY JAMES SMITH / MIXOLOGIST"
    },
    {
        id: 3,
        title: "They say about us",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
        author: "BY MARIA GARCIA / WINE EXPERT"
    }
];

export default function Bar() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <div className="z_bar_page z_bar_theme">
            {/* Hero Section */}
            <section className="z_bar_hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80')` }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <div className="z_bar_hero_badge">
                        <div className="z_bar_badge_line"></div>
                        <span className="z_bar_tag">Elevated Mixology</span>
                        <div className="z_bar_badge_line"></div>
                    </div>
                    <h1 className="z_bar_title">The Art of <br /><em>Liquid Alchemy</em></h1>
                    <p className="z_bar_desc">
                        Where every pour tells a story and every glass holds a masterpiece. 
                        Experience the finest spirits in a setting designed for the soul.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookTable" className="z_bar_btn_primary" style={{ background: 'var(--d-bar)', borderColor: 'var(--d-bar)' }}>Reserve a Table</Link>
                        <Link to="/menu" className="z_bar_btn_outline">View Menu</Link>
                    </div>
                </div>
            </section>


            {/* Signature Cocktails Section - Grid Layout */}
            <section className="z_bar_section">
                <div className="container">
                    <div className="z_bar_section_header">
                        <span className="z_bar_subtitle" style={{ color: 'var(--d-bar)' }}>Signature Menu</span>
                        <h2 className="z_bar_section_title">Our Crafted <em>Mixology</em></h2>
                    </div>
                    <div className="z_bar_grid_display">
                        {COCKTAILS.map((drink) => (
                            <div key={drink.id} className="z_bar_item_card">
                                <img src={drink.img} alt={drink.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div className="z_bar_item_overlay">
                                    <span style={{ color: 'var(--d-bar)', fontWeight: '700', fontSize: '1.2rem' }}>{drink.price}</span>
                                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{drink.name}</h3>
                                    <p style={{ color: 'var(--d-text-2)', fontSize: '0.9rem' }}>{drink.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Video Section - Full Width */}
            <section className="z_bar_video_immersive" style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src="/video/3152-166336023.mp4"
                ></video>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                    <div className="container">
                        <h2 className="z_bar_section_title" style={{ color: '#fff', fontSize: '4rem' }}>Crafted <em>With Passion</em></h2>
                        <p style={{ color: 'var(--d-text-1)', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>Watch our master mixologists create liquid poetry, one ingredient at a time.</p>
                    </div>
                </div>
            </section>
            {/* Mixology Experience - Two Column Dynamic */}
            <section className="z_bar_experience_section" style={{ padding: '120px 0', background: 'var(--d-surface-2)' }}>
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" 
                                    alt="Mixology" 
                                    style={{ width: '100%', borderRadius: 'var(--d-r-lg)', boxShadow: 'var(--d-shadow-lg)', filter: 'grayscale(30%)' }}
                                />
                                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'var(--d-bar)', padding: '2rem', borderRadius: 'var(--d-r-md)' }}>
                                    <h4 style={{ color: '#000', margin: 0 }}>Join The Club</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <span className="z_bar_subtitle" style={{ color: 'var(--current-accent)' }}>The Workshop</span>
                            <h2 className="z_bar_section_title" style={{ textAlign: 'left', marginBottom: '2rem' }}>The <em>Mixologist's</em> Masterclass</h2>
                            <p className="z_bar_desc" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
                                Step behind the bar and discover the secrets of high-end mixology. 
                                Our experts will guide you through the history, techniques, and flavors of our signature drinks.
                            </p>
                            <div className="row g-4">
                                <div className="col-6">
                                    <div style={{ background: 'var(--d-surface-3)', padding: '1.5rem', borderRadius: 'var(--d-r-md)' }}>
                                        <MdWineBar style={{ color: 'var(--d-bar)', fontSize: '2rem' }} />
                                        <h5 style={{ marginTop: '1rem' }}>Rare Spirits</h5>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div style={{ background: 'var(--d-surface-3)', padding: '1.5rem', borderRadius: 'var(--d-r-md)' }}>
                                        <MdLocalBar style={{ color: 'var(--d-bar)', fontSize: '2rem' }} />
                                        <h5 style={{ marginTop: '1rem' }}>Botanicals</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Slider Section */}
            <section className="z_bar_testimonial_section" style={{ background: 'var(--d-bg)', borderTop: '1px solid var(--d-border)' }}>
                <div className="z_bar_testimonial_container">
                    <button className="z_bar_testimonial_nav z_bar_testimonial_prev" onClick={prevTestimonial}>
                        <FaChevronLeft />
                    </button>
                    
                    <div className="z_bar_testimonial_content">
                        <h2 className="z_bar_testimonial_title" style={{ fontSize: '3.5rem' }}>"{TESTIMONIALS[currentTestimonial].title}"</h2>
                        <p className="z_bar_testimonial_text">{TESTIMONIALS[currentTestimonial].content}</p>
                        <p className="z_bar_testimonial_author" style={{ color: 'var(--d-bar)' }}>{TESTIMONIALS[currentTestimonial].author}</p>
                    </div>
                    
                    <button className="z_bar_testimonial_nav z_bar_testimonial_next" onClick={nextTestimonial}>
                        <FaChevronRight />
                    </button>
                </div>
            </section>

        </div>
    );
}