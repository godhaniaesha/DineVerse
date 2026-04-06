import React, { useState, useEffect, useRef } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCoffee, FiStar, FiArrowLeft, FiFacebook } from "react-icons/fi";
import { GiWineGlass, GiKnifeFork, GiCoffeeCup } from "react-icons/gi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Auth.css";

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
const Toast = ({ msg, type, onDone }) => {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setExiting(true); setTimeout(onDone, 300); }, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`z_toast${type === "error" ? " z_toast_error" : ""}${exiting ? " z_toast_exit" : ""}`}>
      <div className={`z_toast_dot${type === "error" ? " z_dot_error" : ""}`} />
      {msg}
    </div>
  );
};

/* ─────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────── */
const Field = ({ label, id, icon, type = "text", placeholder, value, onChange, error, isPassword }) => {
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;
  return (
    <div className="z_field_group">
      <label className="z_field_label" htmlFor={id}>{label}</label>
      <div className="z_field_wrap">
        <span className="z_field_icon">{icon}</span>
        <input
          id={id}
          className={`z_field_input${error ? " z_error" : ""}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={isPassword ? "current-password" : undefined}
          style={isPassword ? { paddingRight: "42px" } : {}}
        />
        {isPassword && (
          <button type="button" className="z_pw_toggle" onClick={() => setShow(s => !s)}>
            {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        )}
      </div>
      {error && <div className="z_error_msg">{error}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────────── */
const LoginForm = ({ onSuccess, onToast, onForgot }) => {
  const [form, setForm] = useState({ email: "", password: "", role: "Super Admin" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email)              e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)           e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    localStorage.setItem("adminRole", form.role);
    localStorage.setItem("adminName", form.email || "Admin User");
    onSuccess("login");
    onToast("Welcome back! Redirecting…", "success");
  };

  const handleSocialLogin = (platform) => {
    onToast(`Redirecting to ${platform} login...`, "success");
    // You can replace these with actual OAuth URLs
    if (platform === "Google") {
      window.location.href = "https://accounts.google.com/o/oauth2/auth";
    } else if (platform === "Facebook") {
      window.location.href = "https://www.facebook.com/v12.0/dialog/oauth";
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="z_slide_in">
      <div className="z_form_title">Welcome <em>back.</em></div>
      <div className="z_form_desc">Sign in to manage your reservations &amp; experience.</div>

      <Field label="Email address" id="login_email" icon={<FiMail />}
        type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />

      <Field label="Password" id="login_pw" icon={<FiLock />}
        isPassword placeholder="••••••••"
        value={form.password} onChange={set("password")} error={errors.password} />

      <div className="z_field_group">
        <label className="z_field_label" htmlFor="login_role">Role</label>
        <select
          id="login_role"
          className="z_field_input"
          value={form.role}
          onChange={set("role")}
          style={{ marginTop: 4 }}
        >
          <option>Super Admin</option>
          <option>Manager</option>
          <option>Cafe Chef</option>
          <option>Restaurant Chef</option>
          <option>Bar Chef</option>
          <option>Waiter</option>
          <option>Bartender</option>
          <option>Housekeeping</option>
        </select>
      </div>

      <div className="z_forgot_row">
        <button type="button" className="z_forgot_link" onClick={onForgot}>Forgot password?</button>
      </div>

      <button type="submit" className="z_submit_btn" disabled={loading}>
        {loading
          ? <><div className="z_spinner" /><span className="z_btn_text">Signing in…</span></>
          : <><span className="z_btn_text">Sign In</span><FiArrowRight className="z_btn_arrow" /></>}
      </button>

      <div className="z_or_divider">
        <div className="z_or_line" /><span className="z_or_text">or continue with</span><div className="z_or_line" />
      </div>
      <div className="z_social_row">
        <button type="button" className="z_social_btn" onClick={() => handleSocialLogin("Google")}>
          <FaGoogle size={14} color="#EA4335" />
          <span>Google</span>
        </button>
        <button type="button" className="z_social_btn" onClick={() => handleSocialLogin("Facebook")}>
          <FaFacebookF size={14} color="#1877F2" />
          <span>Facebook</span>
        </button>
      </div>
    </form>
  );
};

/* ─────────────────────────────────────────────
   REGISTER FORM
───────────────────────────────────────────── */
const RegisterForm = ({ onSuccess, onToast }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "Super Admin" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name)               e.name    = "Full name is required";
    if (!form.email)              e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)           e.password = "Password is required";
    else if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    if (!agreed)                  e.terms   = "Please accept the terms";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    localStorage.setItem("adminRole", form.role);
    localStorage.setItem("adminName", form.name || form.email || "Admin User");
    onSuccess("register");
    onToast("Account created! Welcome aboard.", "success");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="z_slide_in">
      <div className="z_form_title">Create an <em>Account.</em></div>
      <div className="z_form_desc">Join us for exclusive dining, café &amp; bar access.</div>

      <Field label="Full name" id="reg_name" icon={<FiUser />}
        placeholder="Your name"
        value={form.name} onChange={set("name")} error={errors.name} />
      <Field label="Email address" id="reg_email" icon={<FiMail />}
        type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />
      <Field label="Password" id="reg_pw" icon={<FiLock />}
        isPassword placeholder="Min. 8 characters"
        value={form.password} onChange={set("password")} error={errors.password} />
      <Field label="Confirm password" id="reg_cpw" icon={<FiLock />}
        isPassword placeholder="Repeat password"
        value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

      <div className="z_field_group">
        <label className="z_field_label" htmlFor="reg_role">Role</label>
        <select
          id="reg_role"
          className="z_field_input"
          value={form.role}
          onChange={set("role")}
          style={{ marginTop: 4 }}
        >
          <option>Super Admin</option>
          <option>Manager</option>
          <option>Cafe Chef</option>
          <option>Restaurant Chef</option>
          <option>Bar Chef</option>
          <option>Waiter</option>
          <option>Bartender</option>
          <option>Housekeeping</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, marginTop: 4 }}>
        <input
          type="checkbox" id="agree" checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: "var(--d-gold)", cursor: "pointer" }}
        />
        <label htmlFor="agree" style={{ fontSize: 12, color: "var(--d-text-3)", cursor: "pointer", lineHeight: 1.5 }}>
          I agree to the{" "}
          <button type="button" className="z_terms_link">Terms of Service</button>
          {" "}&amp;{" "}
          <button type="button" className="z_terms_link">Privacy Policy</button>
        </label>
      </div>
      {errors.terms && <div className="z_error_msg" style={{ marginTop: -14, marginBottom: 12 }}>{errors.terms}</div>}

      <button type="submit" className="z_submit_btn" disabled={loading}>
        {loading
          ? <><div className="z_spinner" /><span className="z_btn_text">Creating account…</span></>
          : <><span className="z_btn_text">Create Account</span><FiArrowRight className="z_btn_arrow" /></>}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────
   FORGOT PASSWORD FORM
───────────────────────────────────────────── */
const ForgotPasswordForm = ({ onBack, onSuccess, onToast }) => {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    onSuccess("forgot");
    onToast("Password reset link sent! Check your email.", "success");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="z_slide_in">
      <div className="z_form_title">Reset <em>password.</em></div>
      <div className="z_form_desc">Enter your email and we'll send you a reset link.</div>

      <Field label="Email address" id="forgot_email" icon={<FiMail />}
        type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />

      <button type="submit" className="z_submit_btn" disabled={loading}>
        {loading
          ? <><div className="z_spinner" /><span className="z_btn_text">Sending…</span></>
          : <><span className="z_btn_text">Send Reset Link</span><FiArrowRight className="z_btn_arrow" /></>}
      </button>

      <div className="z_forgot_row" style={{ justifyContent: "center", marginTop: 20, marginBottom: 0 }}>
        <button type="button" className="z_forgot_link" onClick={onBack}>
          <FiArrowLeft size={12} style={{ marginRight: 6 }} />
          Back to sign in
        </button>
      </div>
    </form>
  );
};

/* ─────────────────────────────────────────────
   SUCCESS STATE
───────────────────────────────────────────── */
const SuccessView = ({ mode, onBack }) => (
  <div className="z_success_box z_fade_in">
    <div className="z_success_icon"><FiStar /></div>
    <div className="z_success_title">
      {mode === "login" ? "You're in!" : mode === "forgot" ? "Email sent!" : "All set!"}
    </div>
    <div className="z_success_desc" style={{ marginBottom: 28 }}>
      {mode === "login"
        ? "Successfully signed in. Redirecting you to your dashboard…"
        : mode === "forgot"
        ? "Check your email for the password reset link."
        : "Your account has been created. Welcome to the family."}
    </div>
    <button className="z_submit_btn" onClick={onBack} style={{ maxWidth: 200, margin: "0 auto" }}>
      <span className="z_btn_text">Continue</span><FiArrowRight className="z_btn_arrow" />
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   ROOT AUTH COMPONENT
───────────────────────────────────────────── */
export default function Auth() {
  const [tab, setTab] = useState("login");
  const [success, setSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSuccess = (mode) => setSuccess(mode);
  const handleToast   = (msg, type) => setToast({ msg, type, key: Date.now() });

  const handleTabSwitch = (t) => { setTab(t); setSuccess(null); };

  const sideData = {
    login: {
      img: "https://i.pinimg.com/1200x/63/ef/71/63ef7150bef2aaa7cc3dbbd825f3622c.jpg",
      icon: <GiWineGlass size={40} className="z_image_icon" />,
      title: "Exquisite Taste",
      desc: "Experience the finest dining and spirits in the city."
    },
    register: {
      img: "https://i.pinimg.com/736x/70/e2/4d/70e24d7713367a5e5ca1f908ef72d617.jpg",
      icon: <GiKnifeFork size={40} className="z_image_icon" />,
      title: "Join the Family",
      desc: "Create an account to unlock exclusive rewards and reservations."
    },
    forgot: {
      img: "https://i.pinimg.com/736x/48/7d/04/487d0404dc376220fc74b2333a70f8ce.jpg",
      icon: <FiLock size={40} className="z_image_icon" />,
      title: "Secure Access",
      desc: "Recover your account and get back to your dining experience."
    }
  };

  const currentSide = sideData[tab] || sideData.login;

  return (
    <div className="z_auth_wrapper">
      {/* ambient background */}
      <div className="z_bg_canvas">
        <div className="z_bg_orb z_bg_orb_1" />
        <div className="z_bg_orb z_bg_orb_2" />
        <div className="z_bg_orb z_bg_orb_3" />
      </div>
      <div className="z_bg_grain" />

      {/* toast */}
      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="z_auth_layout">
        {/* ── Side Image (Hidden on mobile) ── */}
        <div className="z_auth_image_side" key={tab}>
          <img 
            src={currentSide.img} 
            alt={currentSide.title} 
            className="z_auth_side_img"
          />
          <div className="z_auth_image_overlay">
            <div className="z_auth_image_text">
              {currentSide.icon}
              <h3>{currentSide.title}</h3>
              <p>{currentSide.desc}</p>
            </div>
          </div>
        </div>

        <div className="z_auth_form_side">
          {/* ── Brand Header ── */}
          <div className="z_auth_brand">
            <div className="z_brand_icon">
              <GiCoffeeCup size={22} color="#080705" />
            </div>
            <div>
              <div className="z_brand_name">DINEVERSE</div>
              <div className="z_brand_tagline">Dining &amp; Spirits</div>
            </div>
          </div>

          <div className="z_form_card">
            {!success ? (
              <>
                <div className="z_tab_strip">
                  <div className={`z_tab_indicator z_${tab}`} />
                  <button className={`z_tab_btn${tab === "login" ? " z_active" : ""}`} onClick={() => handleTabSwitch("login")}>Sign In</button>
                  <button className={`z_tab_btn${tab === "register" ? " z_active" : ""}`} onClick={() => handleTabSwitch("register")}>Register</button>
                </div>
                <div className="z_form_container" key={tab}>
                  {tab === "login"
                    ? <LoginForm    onSuccess={handleSuccess} onToast={handleToast} onForgot={() => setTab("forgot")} />
                    : tab === "register"
                    ? <RegisterForm onSuccess={handleSuccess} onToast={handleToast} />
                    : <ForgotPasswordForm onBack={() => setTab("login")} onSuccess={handleSuccess} onToast={handleToast} />}
                </div>
                <div className="z_terms_text" style={{ marginTop: 24 }}>
                  Protected by enterprise-grade security &amp; encryption.
                </div>
              </>
            ) : (
              <SuccessView mode={success} onBack={() => setSuccess(null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}