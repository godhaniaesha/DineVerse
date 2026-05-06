import React, { useState, useEffect } from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/hero.css';

const SLIDES = [
  {
    id: "01",
    label: "The Dining Room",
    title: "A Symphony of Fine Flavors",
    desc: "Experience meticulously curated seasonal menus served in an atmosphere of quiet luxury and golden hues.",
    img: "https://i.pinimg.com/originals/08/63/87/08638786d40e58679143291092b9915a.jpg?nii=t"
  },
  {
    id: "02",
    label: "The Observatory",
    title: "Sip Under the Midnight Sky",
    desc: "Our award-winning mixologists blend rare botanicals with vintage spirits for the ultimate twilight escape.",
    img: "https://i.pinimg.com/originals/27/80/f1/2780f17e939a1f206138bbdef0306881.jpg"
  },
  {
    id: "03",
    label: "Private Suites",
    title: "The Art of Restful Living",
    desc: "Where minimalist architecture meets maximum comfort. Your private sanctuary in the heart of the city.",
    img: "https://i.pinimg.com/originals/7c/c8/a1/7cc8a186126767fe2a1653e39b3c744b.jpg"
  }
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: 'ease-out',
    });

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="d_hero_sec_wrapper">
      {SLIDES.map((slide, i) => (
        <div key={slide.id} className={`d_hero_sec_slide ${i === active ? 'd_hero_sec_slide--active' : ''}`}>
          
          <div className="d_hero_sec_visual">
            <img src={slide.img} alt={slide.title} className="d_hero_sec_img" />
          </div>

          <div className="d_hero_sec_content">
            <span className="d_hero_sec_eyebrow" data-aos="fade-down" data-aos-delay="100">{slide.label}</span>
            <h1 className="d_hero_sec_title" data-aos="zoom-in" data-aos-delay="200">{slide.title}</h1>
            <p className="d_hero_sec_desc" data-aos="fade-up" data-aos-delay="300">{slide.desc}</p>
            
            <div className="d_hero_sec_cta_group" data-aos="fade-up" data-aos-delay="400">
              <button className="d_hero_sec_btn d_hero_sec_btn--gold" onClick={() => navigate('/services')}>Discover More</button>
              <button className="d_hero_sec_btn" onClick={() => navigate('/gallerypage')}>Virtual Tour</button>
            </div>
          </div>

        </div>
      ))}

      {/* Modern Editorial Controls */}
      <div className="d_hero_sec_controls" data-aos="fade-left" data-aos-delay="500">
        <span className="d_hero_sec_number">{SLIDES[active].id}</span>
        <div className="d_hero_sec_progress">
          <div 
            className="d_hero_sec_progress_inner" 
            style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
        <button 
          className="d_hero_sec_btn" 
          style={{ padding: '10px 20px', border: 'none' }}
          onClick={() => setActive((active + 1) % SLIDES.length)}
        >
          <HiArrowLongRight size={24} color="var(--d-gold)" />
        </button>
      </div>
    </section>
  );
};

export default Hero;