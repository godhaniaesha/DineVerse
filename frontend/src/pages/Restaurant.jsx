import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUtensils, FaGlassWhiskey, FaStar } from "react-icons/fa";
import { GiWineGlass } from "react-icons/gi";

const DISH_ITEMS = [
    {
        id: 1,
        name: "Seared Scallops",
        desc: "With saffron risotto and a lemon-butter sauce.",
        price: "$28",
        img: "https://i.pinimg.com/736x/c0/f2/6a/c0f26a4c05ff228be22ca915327692a1.jpg"
    },
    {
        id: 2,
        name: "Filet Mignon",
        desc: "8oz center-cut, with truffle mashed potatoes and grilled asparagus.",
        price: "$45",
        img: "https://i.pinimg.com/736x/4a/de/de/4adede9899cf5f61c2e9a2784ff12e85.jpg"
    },
    {
        id: 3,
        name: "Lobster Thermidor",
        desc: "A classic, rich and creamy, baked in its shell.",
        price: "$55",
        img: "https://i.pinimg.com/1200x/74/4c/b1/744cb1dd548cf968adb9f348c7637aee.jpg"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: "An Unforgettable Meal",
        content: "Every dish was a work of art. The flavors were complex and perfectly balanced. A true fine dining experience.",
        author: "BY ANNA REID / FOOD CRITIC"
    },
    {
        id: 2,
        title: "Impeccable Service",
        content: "The staff was attentive and knowledgeable, making our evening truly special. We will be back!",
        author: "BY MARK ROBERTS / REGULAR GUEST"
    }
];

export default function Restaurant() {
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
        <div className="z_bar_page z_restaurant_theme">
            {/* Hero Section - Parallax Style */}
            <section className="z_bar_hero" style={{ 
                backgroundImage: `url('https://www.fourcentric.com/wp-content/uploads/2025/01/fc-french-scaled.webp')`,
                backgroundAttachment: 'fixed' 
            }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <div className="z_bar_hero_badge">
                        <div className="z_bar_badge_line"></div>
                        <span className="z_bar_tag">Haute Cuisine</span>
                        <div className="z_bar_badge_line"></div>
                    </div>
                    <h1 className="z_bar_title">The Epicurean <br /><em>Masterpiece</em></h1>
                    <p className="z_bar_desc" style={{ maxWidth: '800px' }}>
                        Where culinary tradition meets modern innovation. 
                        Experience a symphony of flavors choreographed by our award-winning chefs.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookTable" className="z_bar_btn_primary" style={{ background: 'var(--d-restaurant)', borderColor: 'var(--d-restaurant)', padding: '1.2rem 3.5rem' }}>Reserve a Table</Link>
                    </div>
                </div>
            </section>

            {/* Signature Showcase - Floating Design */}
            <section className="z_bar_section" style={{ background: 'var(--d-bg)', paddingTop: '80px' }}>
                <div className="container">
                    <div className="z_bar_section_header" style={{ marginBottom: '60px' }}>
                        <span className="z_bar_subtitle" style={{ color: 'var(--d-restaurant)' }}>The Tasting Menu</span>
                        <h2 className="z_bar_section_title">Chef's <em>Signature</em> Creations</h2>
                    </div>
                    
                    <div className="z_res_showcase_flow">
                        {DISH_ITEMS.map((dish, index) => (
                            <div key={dish.id} className="row g-0 align-items-center" style={{ marginBottom: '80px' }}>
                                <div className={`col-lg-7 ${index % 2 !== 0 ? 'order-lg-2' : ''}`}>
                                    <div className="z_parallax_container" style={{ borderRadius: 'var(--d-r-xl)', overflow: 'hidden', height: '450px' }}>
                                        <img src={dish.img} alt={dish.name} className="z_reveal_img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div className={`col-lg-5 ${index % 2 !== 0 ? 'order-lg-1' : ''}`} style={{ 
                                    marginLeft: index % 2 === 0 ? '-60px' : '0',
                                    marginRight: index % 2 !== 0 ? '-60px' : '0',
                                    zIndex: 10
                                }}>
                                    <div className="z_floating_card">
                                        <span style={{ color: 'var(--d-restaurant)', fontWeight: '700', letterSpacing: '2px', fontSize: '0.8rem' }}>{dish.price}</span>
                                        <h3 style={{ fontSize: '2.2rem', margin: '0.5rem 0', fontFamily: 'var(--d-font-serif)' }}>{dish.name}</h3>
                                        <p style={{ color: 'var(--d-text-2)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{dish.desc}</p>
                                        <Link to="/menu" className="z_bar_btn_outline" style={{ borderColor: 'var(--d-restaurant)', color: 'var(--d-restaurant)', padding: '0.8rem 2rem' }}>View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Culinary Video */}
            <section style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src="/video/201947-916877801.mp4"
                ></video>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="container text-center">
                        <h2 className="z_bar_section_title" style={{ color: '#fff', fontSize: '3.5rem' }}>Passion in <em>Every Plate</em></h2>
                        <div style={{ width: '80px', height: '2px', background: 'var(--d-restaurant)', margin: '1.5rem auto' }}></div>
                        <p style={{ color: 'var(--d-text-1)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Experience the dedication and artistry that goes into every single serving.</p>
                    </div>
                </div>
            </section>

            {/* Wine & Dine - Modern Grid */}
            <section style={{ padding: '80px 0', background: 'var(--d-surface-1)' }}>
                <div className="container">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-4">
                            <div className="z_glass_header" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem' }}>
                                <span className="z_bar_subtitle" style={{ color: 'var(--d-restaurant)' }}>Sommelier's Choice</span>
                                <h2 className="z_bar_section_title" style={{ textAlign: 'left', fontSize: '2.5rem' }}>The <em>Wine</em> Cellar</h2>
                                <p style={{ color: 'var(--d-text-2)', marginTop: '1rem', fontSize: '0.95rem' }}>A hand-picked collection of over 500 labels from the world's most prestigious vineyards.</p>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="row g-4" style={{ height: '100%' }}>
                                <div className="col-md-6">
                                    <div className="z_wine_feature h-100" style={{ background: 'var(--d-surface-2)', padding: '2.5rem', borderRadius: 'var(--d-r-lg)', border: '1px solid var(--d-border)' }}>
                                        <GiWineGlass style={{ color: 'var(--d-restaurant)', fontSize: '3rem', marginBottom: '1.5rem' }} />
                                        <h3 style={{ fontSize: '1.6rem' }}>Vintage Selection</h3>
                                        <p style={{ color: 'var(--d-text-3)', fontSize: '0.9rem' }}>Rare vintages and limited editions from around the globe.</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="z_wine_feature h-100" style={{ background: 'var(--d-surface-2)', padding: '2.5rem', borderRadius: 'var(--d-r-lg)', border: '1px solid var(--d-border)' }}>
                                        <FaStar style={{ color: 'var(--d-restaurant)', fontSize: '3rem', marginBottom: '1.5rem' }} />
                                        <h3 style={{ fontSize: '1.6rem' }}>Michelin Standards</h3>
                                        <p style={{ color: 'var(--d-text-3)', fontSize: '0.9rem' }}>Service excellence recognized by the world's top culinary critics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Minimalist Elegance */}
            <section style={{ padding: '80px 0', background: 'var(--d-bg)' }}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-10">
                            <div style={{ fontSize: '6rem', lineHeight: '1', color: 'rgba(200, 150, 90, 0.1)', fontFamily: 'serif', marginBottom: '-3rem' }}>"</div>
                            <h2 style={{ fontSize: '2.2rem', fontStyle: 'italic', color: 'var(--d-text-1)', marginBottom: '2.5rem', fontWeight: '300', lineHeight: '1.4' }}>{TESTIMONIALS[currentTestimonial].content}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '40px', height: '1px', background: 'var(--d-restaurant)' }}></div>
                                <span style={{ fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--d-restaurant)', fontSize: '0.8rem' }}>{TESTIMONIALS[currentTestimonial].author}</span>
                                <div style={{ width: '40px', height: '1px', background: 'var(--d-restaurant)' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3.5rem' }}>
                                <button onClick={prevTestimonial} style={{ background: 'none', border: '1px solid var(--d-border)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', transition: 'all 0.3s' }} className="z_method_hover"><FaChevronLeft /></button>
                                <button onClick={nextTestimonial} style={{ background: 'none', border: '1px solid var(--d-border)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', transition: 'all 0.3s' }} className="z_method_hover"><FaChevronRight /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
