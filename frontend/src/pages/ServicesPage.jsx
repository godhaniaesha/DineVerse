import React from 'react';
import { Utensils, Wine, Building2, Ticket } from 'lucide-react';
import '../style/ServicePage.css';

const SERVICES = [
  {
    id: '01',
    title: 'Restaurant Dining',
    desc: 'A curated gastronomic journey featuring seasonal ingredients and avant-garde culinary techniques.',
    icon: <Utensils size={28} />,
    category: 'restaurant',
  },
  {
    id: '02',
    title: 'Bar & Drinks',
    desc: 'Expertly crafted cocktails and a selection of vintage labels served in an intimate, low-light setting.',
    icon: <Wine size={28} />,
    category: 'bar',
  },
  {
    id: '03',
    title: 'Room Booking',
    desc: 'Luxury redefined with architectural elegance and bespoke service in our signature suites.',
    icon: <Building2 size={28} />,
    category: 'room',
  },
  {
    id: '04',
    title: 'Private Events',
    desc: 'From corporate galas to intimate celebrations, we provide the perfect canvas for your milestones.',
    icon: <Ticket size={28} />,
    category: 'events',
  },
];

const HIGHLIGHTS = [
  {
    label: 'Suites',
    value: '40+',
    note: 'Signature stays',
  },
  {
    label: 'Dining Concepts',
    value: '3',
    note: 'Fine, casual, bar',
  },
  {
    label: 'Events Hosted',
    value: '250+',
    note: 'Every year',
  },
];

const WHY_POINTS = [
  {
    title: 'Seamless planning',
    desc: 'From first enquiry to check-out, one concierge team coordinates all services for you.',
  },
  {
    title: 'Tailored experiences',
    desc: 'Menus, room touches, and event details can be adjusted around your preferences.',
  },
  {
    title: 'Central location',
    desc: 'Perfectly placed in the city, minutes from cultural and business districts.',
  },
];

const TIMELINE = [
  {
    time: 'Morning',
    label: 'Slow rituals',
    desc: 'Breakfast in bed, spa access, and quiet corners in the café.',
  },
  {
    time: 'Afternoon',
    label: 'Light & leisure',
    desc: 'Meetings, pool time, or a relaxed long lunch in the restaurant.',
  },
  {
    time: 'Evening',
    label: 'Atmosphere',
    desc: 'Tasting menus, terrace cocktails, and live music in the bar.',
  },
  {
    time: 'Late',
    label: 'Unwind',
    desc: 'Nightcap service, turn-down, and 24/7 room service.',
  },
];

const FAQ = [
  {
    q: 'Do I need a reservation for dining?',
    a: 'Walk-ins are welcome, but we recommend reserving for dinner, weekends, and chef’s table experiences.',
  },
  {
    q: 'Can you arrange airport transfers?',
    a: 'Yes, our concierge can organise private transfers or local transport for your arrival and departure.',
  },
  {
    q: 'Are private events fully customizable?',
    a: 'Menus, layouts, and decor can be tailored with our in-house planning and partner network.',
  },
];

const ServicePage = () => {
  return (
    <main className="sp_page">
      {/* HERO */}
      <section className="sp_hero">
        <div className="sp_hero_inner">
          <div className="sp_hero_content">
            <span className="sp_eyebrow">Services & Experiences</span>
            <h1 className="sp_title">
              Crafted indulgence,
              <br />
              for every moment.
            </h1>
            <p className="sp_subtitle">
              Discover a considered collection of services designed to make every stay effortless,
              from dawn espresso rituals to after-midnight tastings.
            </p>

            <div className="sp_hero_cta_row">
              <button className="sp_btn_primary">View all services</button>
              <button className="sp_btn_ghost">Plan your visit</button>
            </div>

            <div className="sp_highlights">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="sp_highlight_item">
                  <span className="sp_highlight_value">{item.value}</span>
                  <span className="sp_highlight_label">{item.label}</span>
                  <span className="sp_highlight_note">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sp_hero_panel">
            <div className="sp_hero_panel_inner">
              <div className="sp_hero_tag">Open Daily</div>
              <p className="sp_hero_panel_text">
                From breakfast in bed to private tasting menus, our team curates every detail so you can simply arrive and unwind.
              </p>
              <div className="sp_hero_badge_row">
                <span className="sp_hero_badge">Concierge 24/7</span>
                <span className="sp_hero_badge">City centre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="d_serv_wrapper sp_services_section">
        <div className="d_serv_container">
          <header className="d_serv_header sp_services_header">
            <span className="d_serv_eyebrow">Exquisite Offerings</span>
            <h2 className="d_serv_main_title">All Services</h2>
            <p className="sp_services_intro">
              Explore the full spectrum of services that define our house —
              each card reveals a different way to experience your stay.
            </p>
          </header>

          <div className="d_serv_slider">
            <div className="d_serv_grid">
              {SERVICES.map((service) => (
                <article key={service.id} className="d_serv_card">
                  <div className="d_serv_card_glow" />

                  <div className="d_serv_icon_box">
                    <div className="d_serv_icon_ring" />
                    <div className="d_serv_icon_inner">{service.icon}</div>
                  </div>

                  <span className="d_serv_number">{service.id}</span>

                  <h3 className="d_serv_card_title">{service.title}</h3>
                  <p className="d_serv_card_desc">{service.desc}</p>

                  <div className="d_serv_card_footer">
                    <span className="d_serv_link">Explore more</span>
                    <div className="d_serv_dot" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY STAY WITH US */}
      <section className="sp_why">
        <div className="sp_why_inner">
          <header className="sp_section_header">
            <span className="sp_section_eyebrow">Why guests return</span>
            <h2 className="sp_section_title">More than just a stay.</h2>
          </header>

          <div className="sp_why_grid">
            {WHY_POINTS.map((item) => (
              <div key={item.title} className="sp_why_card">
                <h3 className="sp_why_title">{item.title}</h3>
                <p className="sp_why_desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE TIMELINE */}
      <section className="sp_timeline">
        <div className="sp_timeline_inner">
          <header className="sp_section_header sp_timeline_header">
            <span className="sp_section_eyebrow">A day at the house</span>
            <h2 className="sp_section_title">How your day can flow.</h2>
            <p className="sp_timeline_intro">
              From first coffee to last nightcap, every hour has a service designed around it.
            </p>
          </header>

          <div className="sp_timeline_track">
            {TIMELINE.map((slot, index) => (
              <div key={slot.time} className="sp_timeline_item">
                <div className="sp_timeline_point" />
                {index < TIMELINE.length - 1 && <div className="sp_timeline_line" />}
                <div className="sp_timeline_content">
                  <span className="sp_timeline_time">{slot.time}</span>
                  <h3 className="sp_timeline_label">{slot.label}</h3>
                  <p className="sp_timeline_desc">{slot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sp_faq">
        <div className="sp_faq_inner">
          <header className="sp_section_header">
            <span className="sp_section_eyebrow">Questions</span>
            <h2 className="sp_section_title">Everything you might ask.</h2>
          </header>

          <div className="sp_faq_grid">
            {FAQ.map((item) => (
              <details key={item.q} className="sp_faq_item">
                <summary className="sp_faq_question">{item.q}</summary>
                <p className="sp_faq_answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="sp_bottom_cta">
        <div className="sp_bottom_cta_inner">
          <div className="sp_bottom_cta_text">
            <h2>Ready to design your stay?</h2>
            <p>
              Share your dates and we will craft a bespoke itinerary across dining,
              rooms, and experiences tailored around you.
            </p>
          </div>
          <div className="sp_bottom_cta_actions">
            <button className="sp_btn_primary sp_btn_primary--sm">Talk to concierge</button>
            <button className="sp_btn_ghost sp_btn_ghost--sm">Download brochure</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicePage;