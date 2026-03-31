import { useState } from "react";
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaRegBuilding, FaRegCreditCard, FaRegCheckCircle, FaRegTimesCircle, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import { IoRestaurantOutline, IoWineOutline, IoCafeOutline, IoBedOutline } from 'react-icons/io5';
import "../style/h_style.css"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}
function genRef() { return "LN·" + Math.random().toString(36).substring(2,7).toUpperCase(); }

function StepIndicator({ current }) {
  const steps = ["Details", "Preferences", "Confirm"];
  return (
    <div className="h_steps">
      {steps.map((lbl, i) => {
        const n = i + 1;
        const cls = `h_step${current > n ? " h_done" : current === n ? " h_active" : ""}`;
        return (
          <div key={lbl} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
            <div className={cls}>
              <div className="h_step_n">{current > n ? "✓" : n}</div>
              <span className="h_step_lbl">{lbl}</span>
            </div>
            {i < steps.length - 1 && <div className="h_step_con" />}
          </div>
        );
      })}
    </div>
  );
}

function GuestSelector({ value, onChange }) {
  return (
    <div className="h_guests">
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <div className="h_g_mid">
        <div className="h_g_num">{value}</div>
        <div className="h_g_txt">Guest{value !== 1 ? "s" : ""}</div>
      </div>
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.min(20, value + 1))}>+</button>
    </div>
  );
}

function CalendarPicker({ selectedDate, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const cells = buildCalendar(view.year, view.month);
  const prev = () => setView(v => v.month === 0 ? {year:v.year-1,month:11} : {...v,month:v.month-1});
  const next = () => setView(v => v.month === 11 ? {year:v.year+1,month:0} : {...v,month:v.month+1});
  const isPast = d => new Date(view.year,view.month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const isToday = d => d===today.getDate() && view.month===today.getMonth() && view.year===today.getFullYear();
  const isSel = d => selectedDate && d===selectedDate.getDate() && view.month===selectedDate.getMonth() && view.year===selectedDate.getFullYear();
  return (
    <div className="h_cal">
      <div className="h_cal_head">
        <button className="h_cal_nav" type="button" onClick={prev}>‹</button>
        <span className="h_cal_mth">{MONTHS[view.month]} {view.year}</span>
        <button className="h_cal_nav" type="button" onClick={next}>›</button>
      </div>
      <div className="h_cal_grid">
        {DAYS.map(d => <div key={d} className="h_cal_dn">{d}</div>)}
        {cells.map((d, i) => d === null
          ? <div key={`e${i}`} className="h_cal_d h_empty" />
          : <div key={d}
              className={`h_cal_d${isPast(d)?" h_past":""}${isToday(d)?" h_today":""}${isSel(d)?" h_sel":""}`}
              onClick={() => !isPast(d) && onSelect(new Date(view.year,view.month,d))}>
              {d}
            </div>
        )}
      </div>
    </div>
  );
}

export default function BookTable() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(genRef);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [occasion, setOccasion] = useState("");
  const [requests, setRequests] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const times = [
    {label:"12:00 PM",avail:true},{label:"12:30 PM",avail:true},
    {label:"1:00 PM",avail:false},{label:"1:30 PM",avail:true},
    {label:"2:00 PM",avail:true},{label:"6:00 PM",avail:true},
    {label:"6:30 PM",avail:true},{label:"7:00 PM",avail:true},
    {label:"7:30 PM",avail:false},{label:"8:00 PM",avail:true},
    {label:"8:30 PM",avail:true},{label:"9:00 PM",avail:true},
  ];
  const areas = [
    {id:"main",   icon:<IoRestaurantOutline />, name:"Main Dining",  desc:"Classic ambience"},
    {id:"terrace",icon:<IoCafeOutline />, name:"Terrace",       desc:"Open-air seating"},
    {id:"bar",    icon:<IoWineOutline />, name:"Bar Lounge",    desc:"Cocktails & bites"},
    {id:"private",icon:<IoBedOutline />, name:"Private Room",  desc:"Intimate events"},
  ];
  const occasions = ["Anniversary","Birthday","Business","Date Night","Family","Celebration","Other"];

  const validate1 = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!phone.trim()) e.phone = "Phone required";
    if (!date) e.date = "Please select a date";
    if (!time) e.time = "Please select a time";
    setErrors(e); return !Object.keys(e).length;
  };
  const validate2 = () => {
    const e = {};
    if (!area) e.area = "Please select a seating area";
    if (!agree) e.agree = "Please accept our policy";
    setErrors(e); return !Object.keys(e).length;
  };
  const goNext = () => { if (step===1&&validate1()) setStep(2); if (step===2&&validate2()) setStep(3); };
  const submit = e => { e.preventDefault(); if (!agree) return; setSubmitted(true); };
  const fmtDate = d => d ? d.toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric",year:"numeric"}) : null;
  const reset = () => {
    setSubmitted(false);setStep(1);setFirstName("");setLastName("");setEmail("");setPhone("");
    setGuests(2);setDate(null);setTime("");setArea("");setOccasion("");setRequests("");setAgree(false);setErrors({});
  };

  return (
    <>
      <div className="h_page">
        <div className="h_atm" />
        <div className="h_atm_mid" />
        <div className="h_grid_veil" />
        <div className="h_grain" />

        {/* MAIN */}
        <main className="h_main">
          <div className="h_wrap">
            <div className="h_layout">

              {/* LEFT */}
              <div className="h_card">
                <div className="h_card_head">
                  <div>
                    <div className="h_card_title">Table Reservation</div>
                    <div className="h_card_sub">
                      {step===1?"Your details & schedule":step===2?"Seating preferences":"Review & confirm"}
                    </div>
                  </div>
                  <StepIndicator current={step} />
                </div>

                <div className={`h_success${submitted?" h_show":""}`}>
                  <div className="h_success_ring"><span className="h_success_ico">✓</span></div>
                  <div className="h_success_ttl">Reservation Confirmed</div>
                  <p className="h_success_msg">
                    Your table has been reserved. A confirmation will be sent to{" "}
                    <strong style={{color:"var(--h-champ-lt)"}}>{email}</strong>.{" "}
                    We look forward to welcoming you.
                  </p>
                  <div className="h_ref">Booking Ref: {bookingRef}</div>
                  <button className="h_again_btn" onClick={reset}>← Make Another Reservation</button>
                </div>

                {!submitted && (
                  <form onSubmit={submit} noValidate>
                    {step === 1 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Guest Information</div>
                          <div className="h_row_2">
                            <div className="h_field">
                              <label className="h_label">First Name</label>
                              <input className={`h_input${errors.firstName?" h_err":""}`} type="text" placeholder="Alexandre" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                              {errors.firstName && <div className="h_err_msg">{errors.firstName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Last Name</label>
                              <input className={`h_input${errors.lastName?" h_err":""}`} type="text" placeholder="Dupont" value={lastName} onChange={e=>setLastName(e.target.value)} />
                              {errors.lastName && <div className="h_err_msg">{errors.lastName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Email Address</label>
                              <input className={`h_input${errors.email?" h_err":""}`} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
                              {errors.email && <div className="h_err_msg">{errors.email}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Phone Number</label>
                              <input className={`h_input${errors.phone?" h_err":""}`} type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={e=>setPhone(e.target.value)} />
                              {errors.phone && <div className="h_err_msg">{errors.phone}</div>}
                            </div>
                          </div>
                          <div className="h_field" style={{marginTop:".3rem"}}>
                            <label className="h_label">Number of Guests</label>
                            <GuestSelector value={guests} onChange={setGuests} />
                          </div>
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Date</div>
                          {errors.date && <div className="h_err_msg" style={{marginBottom:".6rem"}}>{errors.date}</div>}
                          <CalendarPicker selectedDate={date} onSelect={d=>{setDate(d);setErrors(p=>({...p,date:null}));}} />
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Time</div>
                          {errors.time && <div className="h_err_msg" style={{marginBottom:".6rem"}}>{errors.time}</div>}
                          <div className="h_times">
                            {times.map(t=>(
                              <div key={t.label}
                                className={`h_time${!t.avail?" h_unavail":""}${time===t.label&&t.avail?" h_tsel":""}`}
                                onClick={()=>t.avail&&setTime(t.label)}>
                                {t.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Seating Area</div>
                          {errors.area && <div className="h_err_msg" style={{marginBottom:".6rem"}}>{errors.area}</div>}
                          <div className="h_areas">
                            {areas.map(a=>(
                              <div key={a.id} className={`h_area${area===a.id?" h_asel":""}`}
                                onClick={()=>{setArea(a.id);setErrors(p=>({...p,area:null}));}}>
                                <span className="h_area_ico">{a.icon}</span>
                                <div className="h_area_name">{a.name}</div>
                                <div className="h_area_desc">{a.desc}</div>
                                <div className="h_area_chk">✓</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Occasion</div>
                          <div className="h_occs">
                            {occasions.map(o=>(
                              <div key={o} className={`h_occ${occasion===o?" h_osel":""}`}
                                onClick={()=>setOccasion(occasion===o?"":o)}>
                                {o}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Requests</div>
                          <div className="h_field">
                            <label className="h_label">Dietary requirements, allergies, or other notes</label>
                            <textarea className="h_textarea" placeholder="E.g. gluten-free, wheelchair access, window table…" value={requests} onChange={e=>setRequests(e.target.value)} />
                          </div>
                        </div>
                        <div className="h_fsec">
                          <label className="h_chk_wrap">
                            <input type="checkbox" className="h_chk" checked={agree}
                              onChange={e=>{setAgree(e.target.checked);setErrors(p=>({...p,agree:null}));}} />
                            <span className="h_chk_lbl">I agree to the <a href="#">Reservation Policy</a> and understand cancellations must be made 24 hours in advance.</span>
                          </label>
                          {errors.agree && <div className="h_err_msg">{errors.agree}</div>}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Reservation Summary</div>
                          {[
                            ["Guest",`${firstName} ${lastName}`],
                            ["Email",email],["Phone",phone],
                            ["Guests",`${guests} ${guests>1?"Guests":"Guest"}`],
                            ["Date",fmtDate(date)],["Time",time],
                            ["Area",areas.find(a=>a.id===area)?.name||"—"],
                            ["Occasion",occasion||"—"],["Requests",requests||"None"],
                          ].map(([k,v])=>(
                            <div className="h_sum_row" key={k}>
                              <span className="h_sum_k">{k}</span>
                              <span className="h_sum_v">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="h_policy">
                          <div className="h_policy_t">Cancellation Policy</div>
                          <p className="h_policy_p">Cancellations must be made at least 24 hours in advance. Late cancellations or no-shows may incur a fee. Confirmation will be emailed to you.</p>
                        </div>
                      </div>
                    )}

                    <div className="h_ffoot">
                      <div className="h_fnote"><span><FaLock /></span> Encrypted &amp; secure</div>
                      <div className="h_fbtns">
                        {step>1 && <button type="button" className="h_btn_back" onClick={()=>setStep(s=>s-1)}>← Back</button>}
                        {step<3
                          ? <button type="button" className="h_btn_prime" onClick={goNext}>Continue <span className="h_btn_arr">→</span></button>
                          : <button type="submit" className="h_btn_prime">Confirm Reservation <span className="h_btn_arr">✓</span></button>
                        }
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT */}
              <div className="h_right">
                <div className="h_panel">
                  <div className="h_panel_head">
                    <div className="h_panel_title">Your Reservation</div>
                    <div className="h_panel_sub">Live Preview</div>
                  </div>
                  <div className="h_panel_body">
                    {[
                      {key:"Guest", val:firstName||lastName?`${firstName} ${lastName}`.trim():null},
                      {key:"Date",  val:fmtDate(date)},
                      {key:"Time",  val:time},
                      {key:"Guests",val:`${guests} ${guests>1?"guests":"guest"}`},
                      {key:"Area",  val:area?areas.find(a=>a.id===area)?.name:null},
                      {key:"Occasion",val:occasion||null},
                    ].map(({key,val})=>(
                      <div className="h_p_row" key={key}>
                        <span className="h_p_k">{key}</span>
                        <span className={`h_p_v${!val?" h_empty":""}`}>{val||"Not selected"}</span>
                      </div>
                    ))}
                    <div className="h_policy" style={{marginTop:"1.1rem"}}>
                      <div className="h_policy_t">House Policy</div>
                      <p className="h_policy_p">Reservations held 15 min. Smart casual attire appreciated.</p>
                    </div>
                  </div>
                </div>

                <div className="h_info_cards">
                  {[
                    {icon:<FaRegBuilding />,title:"Location",    text:"12 Rue de la Paix, Paris\nValet parking available"},
                    {icon:<FaRegClock />,title:"Opening Hours",text:"Mon–Fri  12PM – 11PM\nSat–Sun   11AM – 12AM"},
                    {icon:<FaRegCreditCard />,title:"Reservations", text:"+1 (800) 555-NOIR\nreservations@lanoire.com"},
                  ].map(c=>(
                    <div className="h_info_card" key={c.title}>
                      <div className="h_info_ico">{c.icon}</div>
                      <div>
                        <div className="h_info_ttl">{c.title}</div>
                        <div className="h_info_txt" style={{whiteSpace:"pre-line"}}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}