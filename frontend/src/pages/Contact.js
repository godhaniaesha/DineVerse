import { useState, useEffect, useRef } from "react";
import {
  FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook,
  FiTwitter, FiSend, FiCheckCircle, FiAlertCircle,
  FiClock, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { GiWineGlass, GiKnifeFork, GiCoffeeCup } from "react-icons/gi";
import { TbBrandWhatsapp } from "react-icons/tb";

/* ─── DATA ─── */
const VENUES_INFO = [
  {
    id: "restaurant", icon: <GiKnifeFork />, accent: "var(--d-restaurant)",
    name: "The Restaurant",
    phone: "+91 98765 43210",
    hours: [
      { day: "Mon – Thu", time: "12:00 – 23:00" },
      { day: "Fri – Sat", time: "12:00 – 00:00" },
      { day: "Sunday",    time: "11:00 – 22:00" },
    ],
  },
  {
    id: "bar", icon: <GiWineGlass />, accent: "var(--d-bar)",
    name: "The Bar",
    phone: "+91 98765 43211",
    hours: [
      { day: "Mon – Thu", time: "17:00 – 01:00" },
      { day: "Fri – Sat", time: "17:00 – 02:00" },
      { day: "Sunday",    time: "16:00 – 00:00" },
    ],
  },
  {
    id: "cafe", icon: <GiCoffeeCup />, accent: "var(--d-cafe)",
    name: "The Café",
    phone: "+91 98765 43212",
    hours: [
      { day: "Mon – Fri", time: "07:00 – 18:00" },
      { day: "Sat – Sun", time: "08:00 – 17:00" },
    ],
  },
];

const REASONS = [
  "Table Reservation", "Event / Private Dining",
  "Catering Enquiry", "Feedback", "Partnership", "Other",
];

/* ─── HOOK ─── */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.10 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── HOURS ACCORDION ─── */
function HoursCard({ venue }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="x_hours_card"
      style={{ "--accent": venue.accent }}
    >
      <button className="x_hours_header" onClick={() => setOpen((p) => !p)}>
        <span className="x_hours_icon">{venue.icon}</span>
        <span className="x_hours_name">{venue.name}</span>
        <span className="x_hours_toggle">
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      <div className={`x_hours_body${open ? " x_hours_body--open" : ""}`}>
        <div className="x_hours_list">
          {venue.hours.map((h) => (
            <div key={h.day} className="x_hours_row">
              <span className="x_hours_day">{h.day}</span>
              <span className="x_hours_time">{h.time}</span>
            </div>
          ))}
          <a href={`tel:${venue.phone}`} className="x_hours_phone">
            <FiPhone /> {venue.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── CONTACT FORM ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [touched, setTouched] = useState({});
  const [ref, vis] = useReveal();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.reason) e.reason = "Please select a reason";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };
  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, reason: true, message: true });
    if (!isValid) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 2000);
  };

  if (status === "success") {
    return (
      <div ref={ref} className={`x_form_success${vis ? " x_visible" : ""}`}>
        <FiCheckCircle className="x_success_icon" />
        <h3 className="x_success_title">Message Received</h3>
        <p className="x_success_sub">Thank you for reaching out. We'll get back to you within 24 hours.</p>
        <button className="x_btn x_btn--ghost" onClick={() => { setStatus("idle"); setForm({ name:"",email:"",phone:"",reason:"",message:"" }); setTouched({}); }}>
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form ref={ref} className={`x_contact_form${vis ? " x_visible" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="x_form_row">
        <div className="x_field">
          <label className="x_label">Full Name <span className="x_required">*</span></label>
          <input
            className={`x_input${touched.name && errors.name ? " x_input--err" : ""}`}
            name="name" value={form.name}
            placeholder="Arjun Mehta"
            onChange={handleChange} onBlur={handleBlur}
          />
          {touched.name && errors.name && <span className="x_err_msg"><FiAlertCircle />{errors.name}</span>}
        </div>
        <div className="x_field">
          <label className="x_label">Email <span className="x_required">*</span></label>
          <input
            className={`x_input${touched.email && errors.email ? " x_input--err" : ""}`}
            name="email" type="email" value={form.email}
            placeholder="arjun@email.com"
            onChange={handleChange} onBlur={handleBlur}
          />
          {touched.email && errors.email && <span className="x_err_msg"><FiAlertCircle />{errors.email}</span>}
        </div>
      </div>

      <div className="x_form_row">
        <div className="x_field">
          <label className="x_label">Phone <span className="x_optional">(optional)</span></label>
          <input
            className="x_input"
            name="phone" value={form.phone}
            placeholder="+91 98765 43210"
            onChange={handleChange}
          />
        </div>
        <div className="x_field">
          <label className="x_label">Reason <span className="x_required">*</span></label>
          <select
            className={`x_input x_select${touched.reason && errors.reason ? " x_input--err" : ""}`}
            name="reason" value={form.reason}
            onChange={handleChange} onBlur={handleBlur}
          >
            <option value="">Select a reason…</option>
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {touched.reason && errors.reason && <span className="x_err_msg"><FiAlertCircle />{errors.reason}</span>}
        </div>
      </div>

      <div className="x_field">
        <label className="x_label">Message <span className="x_required">*</span></label>
        <textarea
          className={`x_input x_textarea${touched.message && errors.message ? " x_input--err" : ""}`}
          name="message" value={form.message}
          placeholder="Tell us how we can help you…"
          rows={5}
          onChange={handleChange} onBlur={handleBlur}
        />
        {touched.message && errors.message && <span className="x_err_msg"><FiAlertCircle />{errors.message}</span>}
      </div>

      <button
        type="submit"
        className={`x_submit_btn${status === "loading" ? " x_submit_btn--loading" : ""}${!isValid && Object.keys(touched).length > 0 ? " x_submit_btn--disabled" : ""}`}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <><span className="x_spinner" /> Sending…</>
        ) : (
          <><FiSend /> Send Message</>
        )}
      </button>
    </form>
  );
}

/* ─── MAIN PAGE ─── */
export default function Contact() {
  const [heroVis, setHeroVis] = useState(false);
  useEffect(() => { setTimeout(() => setHeroVis(true), 80); }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div className="x_contact_wrapper">

        {/* ── HERO ── */}
        <section className="x_contact_hero">
          <div className="x_ch_grain" />
          <div className="x_ch_glow_top" />
          <div className="x_ch_glow_bot" />
          <div className={`x_ch_inner${heroVis ? " x_visible" : ""}`}>
            <span className="x_kicker">Get in Touch</span>
            <h1 className="x_ch_title">
              Let's <em>Talk</em>
            </h1>
            <p className="x_ch_sub">
              Reservations, private events, or just saying hello — we'd love to hear from you.
            </p>
          </div>
          <div className="x_ch_orb x_ch_orb--l" />
          <div className="x_ch_orb x_ch_orb--r" />
        </section>

        {/* ── QUICK ACTIONS ── */}
        <div className="x_quick_bar">
          <a href="tel:+919876543210" className="x_quick_item">
            <FiPhone className="x_quick_icon" />
            <span>Call Us</span>
          </a>
          <a href="https://wa.me/919876543210" className="x_quick_item x_quick_item--wa" target="_blank" rel="noreferrer">
            <TbBrandWhatsapp className="x_quick_icon" />
            <span>WhatsApp</span>
          </a>
          <a href="mailto:hello@aurum.in" className="x_quick_item">
            <FiMail className="x_quick_icon" />
            <span>Email</span>
          </a>
          <a href="https://instagram.com" className="x_quick_item x_quick_item--ig" target="_blank" rel="noreferrer">
            <FiInstagram className="x_quick_icon" />
            <span>Instagram</span>
          </a>
        </div>

        {/* ── MAIN GRID ── */}
        <main className="x_contact_main">
          <div className="x_contact_grid">

            {/* LEFT — info panel */}
            <aside className="x_info_panel">
              {/* Address */}
              <div className="x_info_block">
                <h3 className="x_info_block_title">
                  <FiMapPin className="x_info_block_icon" /> Find Us
                </h3>
                <p className="x_info_addr">
                  12, Aurum House, Ring Road<br />
                  Vesu, Surat — 395007<br />
                  Gujarat, India
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="x_map_link"
                >
                  Open in Maps →
                </a>
              </div>

              {/* Map embed placeholder */}
              <div className="x_map_embed">
                <div className="x_map_overlay">
                  <FiMapPin className="x_map_pin" />
                  <span>Aurum, Surat</span>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="x_map_open_btn">
                    View on Google Maps
                  </a>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=60"
                  alt="Map"
                  className="x_map_img"
                  loading="lazy"
                />
              </div>

              {/* Hours accordion */}
              <div className="x_info_block">
                <h3 className="x_info_block_title">
                  <FiClock className="x_info_block_icon" /> Opening Hours
                </h3>
                <div className="x_hours_cards">
                  {VENUES_INFO.map((v) => <HoursCard key={v.id} venue={v} />)}
                </div>
              </div>

              {/* Social */}
              <div className="x_info_block">
                <h3 className="x_info_block_title">Follow Aurum</h3>
                <div className="x_socials">
                  {[
                    { icon: <FiInstagram />, label: "@aurumsurat", href: "#" },
                    { icon: <FiFacebook />,  label: "Aurum Surat",  href: "#" },
                    { icon: <FiTwitter />,   label: "@aurumsurat",  href: "#" },
                    { icon: <TbBrandWhatsapp />, label: "WhatsApp", href: "#" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} className="x_social_pill" target="_blank" rel="noreferrer">
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* RIGHT — form */}
            <section className="x_form_panel">
              <div className="x_form_panel_head">
                <span className="x_kicker">Write to Us</span>
                <h2 className="x_form_panel_title">Send a <em>Message</em></h2>
                <p className="x_form_panel_sub">
                  Fill out the form and our team will respond within 24 hours.
                </p>
              </div>
              <ContactForm />
            </section>
          </div>
        </main>

        <style>{STYLES}</style>
      </div>
    </>
  );
}

/* ─── FAQ ITEM ─── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`x_faq_item${vis ? " x_visible" : ""}`}>
      <button className="x_faq_q" onClick={() => setOpen((p) => !p)}>
        {q}
        <span className="x_faq_chevron">{open ? <FiChevronUp /> : <FiChevronDown />}</span>
      </button>
      <div className={`x_faq_a${open ? " x_faq_a--open" : ""}`}>{a}</div>
    </div>
  );
}

/* ─── STYLES ─── */
const STYLES = `
:root {
  --d-bg:             #080705;
  --d-surface:        #100e0b;
  --d-surface-2:      #181510;
  --d-surface-3:      #201c16;
  --d-surface-glass:  rgba(16, 14, 11, 0.82);
  --d-border:         rgba(200, 160, 90, 0.10);
  --d-border-hover:   rgba(200, 160, 90, 0.28);
  --d-border-strong:  rgba(200, 160, 90, 0.50);
  --d-gold:           #c8965a;
  --d-gold-light:     #e8b878;
  --d-gold-pale:      #f2d4a8;
  --d-gold-dark:      #9a6e3a;
  --d-gold-glow:      rgba(200, 150, 90, 0.22);
  --d-gold-subtle:    rgba(200, 150, 90, 0.08);
  --d-text-1:         #f5f0e8;
  --d-text-2:         #b8b0a0;
  --d-text-3:         #7a7060;
  --d-text-4:         #4a4438;
  --d-cafe:           #7ab898;
  --d-cafe-dim:       rgba(122, 184, 152, 0.10);
  --d-restaurant:     #c8965a;
  --d-restaurant-dim: rgba(200, 150, 90, 0.10);
  --d-bar:            #9b8fd4;
  --d-bar-dim:        rgba(155, 143, 212, 0.10);
  --d-room:           #d48fb5;
  --d-room-dim:       rgba(212, 143, 181, 0.10);
  --d-shadow-sm:   0 2px 12px rgba(0,0,0,0.40);
  --d-shadow-md:   0 8px 32px  rgba(0,0,0,0.55);
  --d-shadow-lg:   0 20px 60px rgba(0,0,0,0.70);
  --d-glow-gold:   0 0 40px rgba(200,150,90,0.12);
  --d-r-xs:   4px;
  --d-r-sm:   8px;
  --d-r-md:   14px;
  --d-r-lg:   22px;
  --d-r-xl:   32px;
  --d-r-pill: 999px;
  --d-font-serif: 'Cormorant Garamond','Georgia',serif;
  --d-font-sans:  'DM Sans',system-ui,sans-serif;
  --d-ease:   cubic-bezier(0.25,0.46,0.45,0.94);
  --d-spring: cubic-bezier(0.34,1.56,0.64,1);
  --d-dur:    0.30s;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.x_contact_wrapper{
  font-family:var(--d-font-sans);
  background:var(--d-bg);
  color:var(--d-text-1);
  min-height:100vh;overflow-x:hidden;
}

/* ── HERO ── */
.x_contact_hero{
  position:relative;
  padding:120px 24px 100px;
  text-align:center;
  overflow:hidden;
  background:var(--d-surface);
  border-bottom:1px solid var(--d-border);
}
.x_ch_grain{
  position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events:none;
}
.x_ch_glow_top{
  position:absolute;top:-80px;left:50%;transform:translateX(-50%);
  width:700px;height:320px;
  background:radial-gradient(ellipse,rgba(200,150,90,0.12) 0%,transparent 70%);
  pointer-events:none;
}
.x_ch_glow_bot{
  position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);
  width:500px;height:200px;
  background:radial-gradient(ellipse,rgba(155,143,212,0.07) 0%,transparent 70%);
  pointer-events:none;
}
.x_ch_orb{
  position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;
  animation:x_orb_float 10s ease-in-out infinite alternate;
}
.x_ch_orb--l{width:240px;height:240px;top:10%;left:5%;background:rgba(200,150,90,0.07);}
.x_ch_orb--r{width:200px;height:200px;top:20%;right:5%;background:rgba(155,143,212,0.06);animation-delay:-5s;}

.x_ch_inner{
  position:relative;z-index:1;max-width:600px;margin:0 auto;
  opacity:0;transform:translateY(28px);
  transition:opacity 0.85s var(--d-ease),transform 0.85s var(--d-ease);
}
.x_ch_inner.x_visible{opacity:1;transform:none;}

.x_kicker{
  display:inline-block;
  font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
  color:var(--d-gold);padding:4px 12px;
  border:1px solid var(--d-border-strong);border-radius:var(--d-r-pill);
  margin-bottom:18px;
}
.x_ch_title{
  font-family:var(--d-font-serif);
  font-size:clamp(50px,9vw,96px);
  font-weight:300;line-height:1;
  letter-spacing:-0.02em;margin-bottom:18px;
}
.x_ch_title em{font-style:italic;color:var(--d-gold-light);text-shadow:0 0 60px rgba(232,184,120,0.3);}
.x_ch_sub{font-size:15px;color:var(--d-text-3);line-height:1.7;}

/* ── QUICK BAR ── */
.x_quick_bar{
  display:flex;justify-content:center;gap:12px;flex-wrap:wrap;
  padding:20px 24px;
  background:var(--d-surface-2);
  border-bottom:1px solid var(--d-border);
}
.x_quick_item{
  display:flex;align-items:center;gap:8px;
  padding:10px 20px;border-radius:var(--d-r-pill);
  border:1px solid var(--d-border);
  background:none;color:var(--d-text-2);
  text-decoration:none;font-size:13px;font-weight:400;
  transition:all var(--d-dur) var(--d-ease);
}
.x_quick_item:hover{border-color:var(--d-border-hover);color:var(--d-text-1);background:var(--d-surface-3);}
.x_quick_item--wa:hover{border-color:#25d366;color:#25d366;}
.x_quick_item--ig:hover{border-color:#e1306c;color:#e1306c;}
.x_quick_icon{font-size:16px;}

/* ── MAIN ── */
.x_contact_main{
  max-width:1200px;margin:0 auto;
  padding:64px 24px 80px;
}
.x_contact_grid{
  display:grid;grid-template-columns:420px 1fr;gap:60px;align-items:flex-start;
}

/* ── INFO PANEL ── */
.x_info_panel{display:flex;flex-direction:column;gap:36px;}
.x_info_block{display:flex;flex-direction:column;gap:12px;}
.x_info_block_title{
  display:flex;align-items:center;gap:8px;
  font-family:var(--d-font-serif);font-size:20px;font-weight:400;
  color:var(--d-text-1);
}
.x_info_block_icon{color:var(--d-gold);font-size:18px;}
.x_info_addr{font-size:14px;color:var(--d-text-3);line-height:1.8;}
.x_map_link{
  font-size:12px;color:var(--d-gold);letter-spacing:0.06em;
  text-decoration:none;border-bottom:1px solid var(--d-border-strong);
  padding-bottom:2px;width:fit-content;
  transition:color var(--d-dur),border-color var(--d-dur);
}
.x_map_link:hover{color:var(--d-gold-light);border-color:var(--d-gold);}

.x_map_embed{
  position:relative;border-radius:var(--d-r-lg);overflow:hidden;
  aspect-ratio:4/3;border:1px solid var(--d-border);
}
.x_map_img{width:100%;height:100%;object-fit:cover;filter:brightness(0.5) saturate(0.3);}
.x_map_overlay{
  position:absolute;inset:0;z-index:2;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  background:rgba(8,7,5,0.35);
}
.x_map_pin{font-size:28px;color:var(--d-gold);}
.x_map_overlay span{font-family:var(--d-font-serif);font-size:16px;color:var(--d-text-1);}
.x_map_open_btn{
  font-size:12px;color:var(--d-gold);text-decoration:none;
  padding:6px 16px;border:1px solid var(--d-border-strong);border-radius:var(--d-r-pill);
  margin-top:4px;transition:background var(--d-dur),border-color var(--d-dur);
}
.x_map_open_btn:hover{background:var(--d-gold-subtle);border-color:var(--d-gold);}

/* hours */
.x_hours_cards{display:flex;flex-direction:column;gap:8px;}
.x_hours_card{
  background:var(--d-surface-2);
  border:1px solid var(--d-border);border-radius:var(--d-r-md);
  overflow:hidden;
  transition:border-color var(--d-dur);
}
.x_hours_card:hover{border-color:var(--d-border-hover);}
.x_hours_header{
  width:100%;display:flex;align-items:center;gap:10px;
  padding:12px 16px;background:none;border:none;cursor:pointer;
  color:var(--d-text-1);text-align:left;
}
.x_hours_icon{font-size:16px;color:var(--accent);}
.x_hours_name{flex:1;font-size:14px;font-weight:500;}
.x_hours_toggle{color:var(--d-text-4);font-size:14px;}
.x_hours_body{max-height:0;overflow:hidden;transition:max-height 0.35s var(--d-ease);}
.x_hours_body--open{max-height:200px;}
.x_hours_list{padding:4px 16px 14px;display:flex;flex-direction:column;gap:8px;}
.x_hours_row{display:flex;justify-content:space-between;font-size:13px;}
.x_hours_day{color:var(--d-text-3);}
.x_hours_time{color:var(--d-text-2);font-weight:500;}
.x_hours_phone{
  display:flex;align-items:center;gap:6px;
  font-size:12px;color:var(--accent);text-decoration:none;margin-top:4px;
  transition:opacity var(--d-dur);
}
.x_hours_phone:hover{opacity:0.75;}

/* socials */
.x_socials{display:flex;flex-wrap:wrap;gap:8px;}
.x_social_pill{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:var(--d-r-pill);
  border:1px solid var(--d-border);
  color:var(--d-text-3);text-decoration:none;font-size:12px;
  transition:all var(--d-dur) var(--d-ease);
}
.x_social_pill:hover{color:var(--d-gold);border-color:var(--d-border-hover);background:var(--d-gold-subtle);}

/* ── FORM PANEL ── */
.x_form_panel{
  background:var(--d-surface-2);
  border:1px solid var(--d-border);
  border-radius:var(--d-r-xl);
  padding:44px 40px 48px;
}
.x_form_panel_head{margin-bottom:36px;}
.x_form_panel_title{
  font-family:var(--d-font-serif);
  font-size:clamp(28px,3.5vw,42px);font-weight:300;
  margin:10px 0 10px;
}
.x_form_panel_title em{font-style:italic;color:var(--d-gold-light);}
.x_form_panel_sub{font-size:13px;color:var(--d-text-3);line-height:1.65;}

.x_contact_form,.x_form_success{
  opacity:0;transform:translateY(20px);
  transition:opacity 0.6s var(--d-ease),transform 0.6s var(--d-ease);
}
.x_contact_form.x_visible,.x_form_success.x_visible{opacity:1;transform:none;}

.x_form_row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
.x_field{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;}
.x_field:last-child{margin-bottom:0;}
.x_label{font-size:12px;letter-spacing:0.08em;color:var(--d-text-3);text-transform:uppercase;}
.x_required{color:var(--d-gold);}
.x_optional{font-size:10px;color:var(--d-text-4);text-transform:none;letter-spacing:0;}

.x_input{
  background:var(--d-surface-3);
  border:1px solid var(--d-border);border-radius:var(--d-r-md);
  color:var(--d-text-1);font-family:var(--d-font-sans);font-size:14px;
  padding:13px 16px;outline:none;width:100%;
  transition:border-color var(--d-dur),box-shadow var(--d-dur);
  appearance:none;-webkit-appearance:none;
}
.x_input::placeholder{color:var(--d-text-4);}
.x_input:focus{border-color:var(--d-border-hover);box-shadow:0 0 0 3px var(--d-gold-subtle);}
.x_input--err{border-color:rgba(232,112,112,0.6);}
.x_input--err:focus{box-shadow:0 0 0 3px rgba(232,112,112,0.12);}
.x_select{cursor:pointer;}
.x_textarea{resize:vertical;min-height:120px;}
.x_err_msg{
  display:flex;align-items:center;gap:5px;
  font-size:11px;color:#e87070;
}

.x_submit_btn{
  width:100%;display:flex;align-items:center;justify-content:center;gap:10px;
  padding:15px 28px;border-radius:var(--d-r-pill);border:none;
  background:var(--d-gold);color:var(--d-bg);
  font-family:var(--d-font-sans);font-size:15px;font-weight:500;
  cursor:pointer;margin-top:8px;
  transition:all var(--d-dur) var(--d-spring);
}
.x_submit_btn:hover:not(:disabled){background:var(--d-gold-light);transform:translateY(-2px);box-shadow:0 8px 28px var(--d-gold-glow);}
.x_submit_btn--loading{opacity:0.75;cursor:wait;}
.x_submit_btn--disabled{opacity:0.5;}
.x_spinner{
  width:16px;height:16px;border-radius:50%;
  border:2px solid rgba(0,0,0,0.2);border-top-color:var(--d-bg);
  animation:x_spin 0.7s linear infinite;display:inline-block;
}

/* success */
.x_form_success{
  text-align:center;
  padding:60px 24px;display:flex;flex-direction:column;align-items:center;gap:16px;
}
.x_success_icon{font-size:48px;color:var(--d-cafe);}
.x_success_title{font-family:var(--d-font-serif);font-size:28px;font-weight:400;}
.x_success_sub{font-size:14px;color:var(--d-text-3);max-width:340px;line-height:1.65;}

/* ── BUTTONS ── */
.x_btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 24px;border-radius:var(--d-r-pill);
  font-family:var(--d-font-sans);font-size:14px;font-weight:500;
  text-decoration:none;cursor:pointer;border:none;
  transition:all var(--d-dur) var(--d-spring);
}
.x_btn--ghost{background:none;color:var(--d-gold);border:1px solid var(--d-border-strong);}
.x_btn--ghost:hover{background:var(--d-gold-subtle);border-color:var(--d-gold);}

/* ── KEYFRAMES ── */
@keyframes x_orb_float{
  from{transform:translateY(0);}
  to{transform:translateY(-24px);}
}
@keyframes x_spin{to{transform:rotate(360deg);}}
@keyframes x_fadeUp{
  from{opacity:0;transform:translateY(20px);}
  to{opacity:1;transform:translateY(0);}
}

/* ── RESPONSIVE ── */
@media(max-width:1000px){
  .x_contact_grid{grid-template-columns:1fr;gap:40px;}
  .x_info_panel{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  .x_map_embed{grid-column:1/-1;}
}
@media(max-width:680px){
  .x_form_row{grid-template-columns:1fr;}
  .x_faq_grid{grid-template-columns:1fr;}
  .x_info_panel{grid-template-columns:1fr;}
  .x_form_panel{padding:28px 20px 32px;}
  .x_ch_title{font-size:clamp(42px,12vw,60px);}
}
`;