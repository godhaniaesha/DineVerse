import React from 'react';
import { Utensils, Wine, Building2, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/services.css';

const SERVICES = [
  {
    id: "01",
    title: "Restaurant Dining",
    desc: "A curated gastronomic journey featuring seasonal ingredients and avant-garde culinary techniques.",
    icon: <Utensils size={32} />,
    link: "/bookTable"
  },
  {
    id: "02",
    title: "Bar & Drinks",
    desc: "Expertly crafted cocktails and a selection of vintage labels served in an intimate, low-light setting.",
    icon: <Wine size={32} />,
    link: "/bar"
  },
  {
    id: "03",
    title: "Room Booking",
    desc: "Luxury redefined. Experience architectural elegance and bespoke service in our signature suites.",
    icon: <Building2 size={32} />,
    link: "/bookRoom"
  },
  {
    id: "04",
    title: "Private Events",
    desc: "From corporate galas to intimate celebrations, we provide the perfect canvas for your milestones.",
    icon: <Ticket size={32} />,
    link: "/contact"
  }
];

const Services = () => {
  return (
    <section className="d_serv_wrapper">
      <div className="d_serv_container">

        <header className="d_serv_header">
          <span className="d_serv_eyebrow">Exquisite Offerings</span>
          <h2 className="d_serv_main_title">Our Services</h2>
        </header>

        <div className="d_serv_slider">

          <div className="d_serv_grid">

            {SERVICES.map((service) => (

              <div key={service.id} className="d_serv_card">

                <div className="d_serv_card_glow"></div>

                <div className="d_serv_icon_box">
                  <div className="d_serv_icon_ring"></div>

                  <div className="d_serv_icon_inner">
                    {service.icon}
                  </div>
                </div>

                <span className="d_serv_number">{service.id}</span>

                <h3 className="d_serv_card_title">{service.title}</h3>

                <p className="d_serv_card_desc">{service.desc}</p>

                <Link to={service.link} className="d_serv_card_footer" style={{ textDecoration: 'none' }}>
                  <span className="d_serv_link">Explore More</span>
                  <div className="d_serv_dot"></div>
                </Link>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Services;