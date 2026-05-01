import { useState } from "react";
import { MdTableRestaurant, MdPhone, MdPerson, MdAccessTime, MdCalendarToday, MdEmail } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { PiUsersThreeBold, PiCheckCircleBold } from "react-icons/pi";
import { RiArrowRightSLine } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "./tableReservation.css";

const TIME_SLOTS = [
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM",
];

const GUEST_OPTIONS = ["1 Guest","2 Guests","3 Guests","4 Guests","5 Guests","6 Guests","7–10 Guests","10+ Guests"];

export default function TableReservation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ date:"", time:"", guests:"", guest_name:"", phone:"", email:"", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateFirstStep = () => {
    const e = {};
    if (!form.date)   e.date   = "Please pick a date";
    if (!form.time)   e.time   = "Please select a time";
    if (!form.guests) e.guests = "Please select guests";
    if (!form.guest_name.trim())  e.guest_name  = "Your name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) e.email = "Please enter a valid email address";
    return e;
  };

  const handleFirstStepSubmit = (ev) => {
    ev.preventDefault();
    const e = validateFirstStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    // Split guest_name into first and last name
    const nameParts = form.guest_name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Navigate to BookTable with step 2 and pass the form data
    const queryParams = new URLSearchParams({
      step: '2',
      date: form.date,
      time: form.time,
      guests: form.guests,
      firstName: firstName,
      lastName: lastName,
      phone: form.phone,
      email: form.email,
      notes: form.notes
    });
    navigate(`/bookTable?${queryParams.toString()}`);
  };

  return (
    <section className="d_resv_section">
      <div className="d_wrapper">
        <div className="d_resv_layout">

          {/* ── LEFT: atmospheric visual ── */}
          <div className="d_resv_visual">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85"
              alt="DineVerse dining room"
              className="d_resv_visual__img"
            />
            <div className="d_resv_visual__overlay" />
            <div className="d_resv_visual__content">
              <p className="d_resv_visual__eyebrow">
                <HiSparkles style={{ fontSize: 8, marginRight: 7, verticalAlign: "middle" }} />
                Reserve Your Evening
              </p>
              <h2 className="d_resv_visual__title">
                An Unforgettable<br />
                <em>Table Awaits</em>
              </h2>
              <p className="d_resv_visual__body">
                Every reservation at DineVerse is personally prepared — from
                your preferred seating to a curated amuse-bouche on arrival.
                Dinner, not just a meal.
              </p>
              <div className="d_resv_visual__pills">
                {[
                  { icon: <MdAccessTime />, label: "Open Daily 6–10 PM" },
                  { icon: <MdTableRestaurant />, label: "Private Dining Available" },
                  { icon: <HiSparkles />, label: "Chef's Table on Request" },
                ].map((p, i) => (
                  <span key={i} className="d_resv_visual__pill">
                    <span className="d_resv_visual__pill-icon">{p.icon}</span>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: form ── */}
          <div className="d_resv_form_panel">
            {submitted ? (
              <div className="d_resv_success">
                <div className="d_resv_success__icon"><PiCheckCircleBold /></div>
                <h3 className="d_resv_success__title">Table Reserved!</h3>
                <p className="d_resv_success__msg">
                  Thank you, <strong style={{ color: "var(--d-text-1)" }}>{form.guest_name}</strong>.
                  Your table for {form.guests} on {form.date} at {form.time} is confirmed.
                  We'll send a reminder to your phone.
                </p>
                <button className="d_resv_success__reset" onClick={() => { setSubmitted(false); setForm({ date:"",time:"",guests:"",guest_name:"",phone:"",email:"",notes:"" }); }}>
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <>
                <h3 className="d_resv_form__heading">Reserve a Table</h3>
                <p className="d_resv_form__sub">Complete the form and we'll confirm within minutes.</p>

                <form className="d_resv_form" onSubmit={handleFirstStepSubmit} noValidate>

                  {/* Date */}
                  <div className="d_resv_form__group">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><MdCalendarToday /></span>
                      Date
                    </label>
                    <input
                      type="date"
                      className="d_resv_form__input"
                      style={errors.date ? { borderColor: "#e06060" } : {}}
                      value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => update("date", e.target.value)}
                    />
                    {errors.date && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.date}</span>}
                  </div>

                  {/* Time */}
                  <div className="d_resv_form__group">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><MdAccessTime /></span>
                      Time
                    </label>
                    <div className="d_resv_form__select-wrap">
                      <select
                        className="d_resv_form__select"
                        style={errors.time ? { borderColor: "#e06060" } : {}}
                        value={form.time}
                        onChange={e => update("time", e.target.value)}
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {errors.time && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.time}</span>}
                  </div>

                  {/* Guests */}
                  <div className="d_resv_form__group ">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><PiUsersThreeBold /></span>
                      Number of Guests
                    </label>
                    <div className="d_resv_form__select-wrap">
                      <select
                        className="d_resv_form__select"
                        style={errors.guests ? { borderColor: "#e06060" } : {}}
                        value={form.guests}
                        onChange={e => update("guests", e.target.value)}
                      >
                        <option value="">Select guests</option>
                        {GUEST_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    {errors.guests && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.guests}</span>}
                  </div>
                  {/* Email */}
                  <div className="d_resv_form__group">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><MdEmail /></span>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="d_resv_form__input"
                      placeholder="you@example.com"
                      style={errors.email ? { borderColor: "#e06060" } : {}}
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                    />
                    {errors.email && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.email}</span>}
                  </div>
                  {/* Name */}
                  <div className="d_resv_form__group">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><MdPerson /></span>
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="d_resv_form__input"
                      placeholder="Full name"
                      style={errors.guest_name ? { borderColor: "#e06060" } : {}}
                      value={form.guest_name}
                      onChange={e => update("guest_name", e.target.value)}
                    />
                    {errors.guest_name && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.guest_name}</span>}
                  </div>

                  {/* Phone */}
                  <div className="d_resv_form__group">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><MdPhone /></span>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="d_resv_form__input"
                      placeholder="+1 (000) 000-0000"
                      style={errors.phone ? { borderColor: "#e06060" } : {}}
                      value={form.phone}
                      onChange={e => update("phone", e.target.value)}
                    />
                    {errors.phone && <span style={{ fontSize: 11, color: "#e06060" }}>{errors.phone}</span>}
                  </div>

                  {/* Special requests */}
                  <div className="d_resv_form__group d_resv_form__group--full">
                    <label className="d_resv_form__label">
                      <span className="d_resv_form__label-icon"><TbNotes /></span>
                      Special Requests
                    </label>
                    <textarea
                      className="d_resv_form__textarea"
                      placeholder="Dietary requirements, occasion, seating preference…"
                      value={form.notes}
                      onChange={e => update("notes", e.target.value)}
                    />
                  </div>

                  <button type="submit" className="d_resv_form__submit">
                    <MdTableRestaurant style={{ fontSize: 16 }} />
                    Continue to Preferences
                    <RiArrowRightSLine style={{ fontSize: 17 }} />
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}