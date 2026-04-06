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
            <section className="z_bar_hero z_restaurant_hero" style={{ 
                backgroundImage: `url('https://www.fourcentric.com/wp-content/uploads/2025/01/fc-french-scaled.webp')`
            }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <div className="z_bar_hero_badge">
                        <div className="z_bar_badge_line"></div>
                        <span className="z_bar_tag">Haute Cuisine</span>
                        <div className="z_bar_badge_line"></div>
                    </div>
                    <h1 className="z_bar_title">The Epicurean <br /><em>Masterpiece</em></h1>
                    <p className="z_bar_desc">
                        Where culinary tradition meets modern innovation. 
                        Experience a symphony of flavors choreographed by our award-winning chefs.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookTable" className="z_bar_btn_primary" style={{ background: 'var(--d-restaurant)', borderColor: 'var(--d-restaurant)' }}>Reserve a Table</Link>
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
                            <div key={dish.id} className="row g-0 align-items-center z_res_dish_row">
                                <div className={`col-lg-7 ${index % 2 !== 0 ? 'order-lg-2' : ''}`}>
                                    <div className="z_parallax_container z_res_dish_img">
                                        <img src={dish.img} alt={dish.name} className="z_reveal_img" />
                                    </div>
                                </div>
                                <div className={`col-lg-5 ${index % 2 !== 0 ? 'order-lg-1' : ''} z_res_dish_content_col`}>
                                    <div className="z_floating_card">
                                        <span className="z_res_dish_price">{dish.price}</span>
                                        <h3 className="z_res_dish_name">{dish.name}</h3>
                                        <p className="z_res_dish_desc">{dish.desc}</p>
                                        <Link to="/menu" className="z_bar_btn_outline z_res_dish_btn">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Culinary Video */}
            <section className="z_res_video_section">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="z_res_video"
                    src="/video/201947-916877801.mp4"
                ></video>
                <div className="z_res_video_overlay">
                    <div className="container text-center">
                        <h2 className="z_bar_section_title z_res_video_title">Passion in <em>Every Plate</em></h2>
                        <div className="z_res_video_divider"></div>
                        <p className="z_res_video_desc">Experience the dedication and artistry that goes into every single serving.</p>
                    </div>
                </div>
            </section>

            {/* Wine & Dine - Modern Grid */}
            <section className="z_res_wine_section">
                <div className="container">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-4">
                            <div className="z_glass_header z_res_wine_header">
                                <span className="z_bar_subtitle" style={{ color: 'var(--d-restaurant)' }}>Sommelier's Choice</span>
                                <h2 className="z_bar_section_title z_res_wine_title">The <em>Wine</em> Cellar</h2>
                                <p className="z_res_wine_text">A hand-picked collection of over 500 labels from the world's most prestigious vineyards.</p>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="row g-4 h-100">
                                <div className="col-md-6">
                                    <div className="z_wine_feature h-100 z_res_wine_feature">
                                        <GiWineGlass className="z_res_wine_icon" />
                                        <h3 className="z_res_wine_feat_title">Vintage Selection</h3>
                                        <p className="z_res_wine_feat_desc">Rare vintages and limited editions from around the globe.</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="z_wine_feature h-100 z_res_wine_feature">
                                        <FaStar className="z_res_wine_icon" />
                                        <h3 className="z_res_wine_feat_title">Michelin Standards</h3>
                                        <p className="z_res_wine_feat_desc">Service excellence recognized by the world's top culinary critics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Minimalist Elegance */}
            <section className="z_res_testimonial_section">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-10">
                            <div className="z_res_testimonial_quote">"</div>
                            <h2 className="z_res_testimonial_content">{TESTIMONIALS[currentTestimonial].content}</h2>
                            <div className="z_res_testimonial_author_wrap">
                                <div className="z_res_testimonial_line"></div>
                                <span className="z_res_testimonial_author">{TESTIMONIALS[currentTestimonial].author}</span>
                                <div className="z_res_testimonial_line"></div>
                            </div>
                            <div className="z_res_testimonial_btns">
                                <button onClick={prevTestimonial} className="z_res_testimonial_btn z_method_hover"><FaChevronLeft /></button>
                                <button onClick={nextTestimonial} className="z_res_testimonial_btn z_method_hover"><FaChevronRight /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
