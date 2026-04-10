import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaWifi, FaSwimmingPool, FaParking } from "react-icons/fa";
import { MdHotel, MdKingBed, MdMeetingRoom } from "react-icons/md";

const ROOM_ITEMS = [
    {
        id: 1,
        name: "Deluxe Suite",
        desc: "A spacious suite with a king-sized bed and a private balcony overlooking the city.",
        price: "$250",
        img: "https://i.pinimg.com/1200x/f6/bf/2e/f6bf2ead8546606c5da8094f461b7299.jpg"
    },
    {
        id: 2,
        name: "Executive Room",
        desc: "Perfect for business travelers, with a dedicated workspace and premium amenities.",
        price: "$180",
        img: "https://i.pinimg.com/736x/09/f8/eb/09f8eb6b19adf6a08ba57b1597fdcddd.jpg"
    },
    {
        id: 3,
        name: "Royal Suite",
        desc: "The pinnacle of luxury, featuring a separate living area and a spa-like bathroom.",
        price: "$450",
        img: "https://i.pinimg.com/1200x/69/79/2f/69792faa9e9bc101a9bd753334c409e4.jpg"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: "A Truly Royal Experience",
        content: "The Royal Suite exceeded all our expectations. The attention to detail and service were impeccable.",
        author: "BY SARAH JOHNSON / FREQUENT TRAVELER"
    },
    {
        id: 2,
        title: "Perfect Business Stay",
        content: "The Executive Room had everything I needed for my work trip. Quiet, comfortable, and great Wi-Fi.",
        author: "BY MICHAEL CHEN / CORPORATE GUEST"
    }
];

export default function Rooms() {
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
        <div className="z_bar_page z_room_theme">
            {/* Hero Section */}
            <section className="z_bar_hero" style={{ backgroundImage: `url('https://avatars.mds.yandex.net/get-altay/13482651/2a00000192ea5b8aa6b2e24ecd9b7b364ee4/orig')` }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <div className="z_bar_hero_badge">
                        <div className="z_bar_badge_line" style={{ background: 'var(--d-room)' }}></div>
                        <span className="z_bar_tag" style={{ color: 'var(--d-room)' }}>Luxury Stays</span>
                        <div className="z_bar_badge_line" style={{ background: 'var(--d-room)' }}></div>
                    </div>
                    <h1 className="z_bar_title">Refined <em>Comfort</em></h1>
                    <p className="z_bar_desc">
                        Experience the perfect blend of elegance and tranquility.
                        Your sanctuary awaits in the heart of the city.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookRoom" className="z_bar_btn_primary" style={{ background: 'var(--d-room)', borderColor: 'var(--d-room)' }}>Book Your Stay</Link>
                        <Link to="/gallerypage" className="z_bar_btn_outline">View Gallery</Link>
                    </div>
                </div>
            </section>

            {/* Room Features - Wide Alternating Layout */}
            <section className="z_bar_section" style={{ background: 'var(--d-bg)' }}>
                <div className="container">
                    <div className="z_bar_section_header">
                        <span className="z_bar_subtitle" style={{ color: 'var(--d-room)' }}>Our Selection</span>
                        <h2 className="z_bar_section_title">Signature <em>Suites</em></h2>
                    </div>

                    <div className="z_room_showcase">
                        {ROOM_ITEMS.map((room) => (
                            <div key={room.id} className="z_room_feature_row">
                                <div className="z_room_feature_img">
                                    <img src={room.img} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="z_room_feature_info">
                                    <span style={{ color: 'var(--d-room)', fontWeight: '700', fontSize: '1.2rem' }}>Starting from {room.price}</span>
                                    <h3 style={{ fontSize: '3rem', margin: '1rem 0', fontFamily: 'var(--d-font-serif)' }}>{room.name}</h3>
                                    <p className="z_bar_desc" style={{ textAlign: 'left', fontSize: '1.1rem', marginBottom: '2rem' }}>{room.desc}</p>
                                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <MdKingBed style={{ fontSize: '2rem', color: 'var(--d-room)' }} />
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>King Bed</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <FaWifi style={{ fontSize: '2rem', color: 'var(--d-room)' }} />
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Free Wi-Fi</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <MdMeetingRoom style={{ fontSize: '2rem', color: 'var(--d-room)' }} />
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Balcony</p>
                                        </div>
                                    </div>
                                    <Link to="/bookRoom" className="z_bar_btn_primary" style={{ background: 'var(--d-room)', borderColor: 'var(--d-room)' }}>Book This Room</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Room Video Section */}
            <section style={{ height: '80vh', position: 'relative' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src="/video/106674-673786323.mp4"
                ></video>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', maxWidth: '700px', padding: '2rem' }}>
                        <h2 className="z_bar_section_title" style={{ color: '#fff', fontSize: '4.5rem' }}>Luxury <em>Redefined</em></h2>
                        <p style={{ color: '#fff', fontSize: '1.3rem' }}>Wake up to breathtaking views and unparalleled comfort in our most exclusive accommodations.</p>
                    </div>
                </div>
            </section>

            {/* Amenities Section - Minimal Icons */}
            <section className="z_bar_section" style={{ padding: '120px 0', background: 'var(--d-surface-2)' }}>
                <div className="container">
                    <div className="row g-5">
                        <div className="col-xl-3 col-sm-6">
                            <div style={{ textAlign: 'center' }}>
                                <FaSwimmingPool style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>Infinity Pool</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>A refreshing escape with city views.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div style={{ textAlign: 'center' }}>
                                <MdHotel style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>24/7 Service</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>We are here for your every need.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div style={{ textAlign: 'center' }}>
                                <FaParking style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>Valet Parking</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>Secure and hassle-free arrival.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div style={{ textAlign: 'center' }}>
                                <FaWifi style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>High-Speed Wi-Fi</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>Stay connected effortlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Elegant Overlay */}
            <section style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80" alt="Testimonial BG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                        <span style={{ color: 'var(--d-room)', fontSize: '3rem' }}><FaChevronLeft onClick={prevTestimonial} style={{ cursor: 'pointer', marginRight: '2rem' }} /><FaChevronRight onClick={nextTestimonial} style={{ cursor: 'pointer' }} /></span>
                        <h2 style={{ color: '#fff', fontFamily: 'var(--d-font-serif)', fontSize: '2.5rem', margin: '2rem 0' }}>{TESTIMONIALS[currentTestimonial].title}</h2>
                        <p style={{ color: 'var(--d-text-2)', fontSize: '1.2rem' }}>{TESTIMONIALS[currentTestimonial].content}</p>
                        <p style={{ color: 'var(--d-room)', fontWeight: '700', marginTop: '2rem', letterSpacing: '2px' }}>{TESTIMONIALS[currentTestimonial].author}</p>
                    </div>
                </div>
            </section>

        </div>
    );
}
