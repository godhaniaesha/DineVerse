import React, { useState, useEffect, useRef } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCoffee, FiStar, FiArrowLeft, FiPhone } from "react-icons/fi";
import { GiWineGlass, GiKnifeFork, GiCoffeeCup } from "react-icons/gi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Auth.css";
import { useAuth } from "../contexts/AuthContext";

const ALL_ROLES = [
  'Super Admin',
  'Manager',
  'Housekeeping',
  'Cafe Waiter',
  'Res Waiter',
  'Bar Waiter',
  'Chef',
  'User'
];

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

const Field = ({ label, id, icon, type = "text", placeholder, value, onChange, error, isPassword, disabled }) => {
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
          disabled={disabled}
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

const SelectField = ({ label, id, icon, options, value, onChange, error }) => {
  return (
    <div className="z_field_group">
      <label className="z_field_label" htmlFor={id}>{label}</label>
      <div className="z_field_wrap">
        <span className="z_field_icon">{icon}</span>
        <select
          id={id}
          className={`z_field_input z_select_input${error ? " z_error" : ""}`}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      {error && <div className="z_error_msg">{error}</div>}
    </div>
  );
};

const LoginForm = ({ onSuccess, onToast }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getFirstAllowedRoute = (role) => {
    const ROLE_ROUTE_MAP = {
      "Super Admin": [
        "/admin",
        "/admin/analytics",
        "/admin/reservations",
        "/admin/admin-menu",
        "/admin/room-bookings",
        "/admin/staff",
        "/admin/cuisines",
        "/admin/orders",
        "/admin/kds",
        "/admin/waiter-panel",
        "/admin/cafe-waiter",
        "/admin/restaurant-waiter",
        "/admin/bar-waiter",
        "/admin/cafe-chef",
        "/admin/restaurant-chef",
        "/admin/bar-chef",
        "/admin/manager-panel",
        "/admin/housekeeping-panel",
        "/admin/guests",
        "/admin/admin-menu",
        "/admin/tables",
        "/admin/rooms",
        "/admin/gallery",
        "/admin/blogs",
        "/admin/reviews",
        "/admin/inquiries",
        "/admin/admin-users",
        "/admin/profile",
        "/admin/sales-history",
      ],
      Manager: [
        "/admin",
        "/admin/analytics",
        "/admin/reservations",
        "/admin/admin-menu",
        "/admin/room-bookings",
        "/admin/staff",
        "/admin/cuisines",
        "/admin/categories",
        "/admin/dishes",
        "/admin/orders",
        "/admin/kds",
        "/admin/waiter-panel",
        "/admin/cafe-waiter",
        "/admin/restaurant-waiter",
        "/admin/bar-waiter",
        "/admin/cafe-chef",
        "/admin/restaurant-chef",
        "/admin/bar-chef",
        "/admin/manager-panel",
        "/admin/housekeeping-panel",
        "/admin/guests",
        "/admin/admin-menu",
        "/admin/tables",
        "/admin/rooms",
        "/admin/gallery",
        "/admin/blogs",
        "/admin/reviews",
        "/admin/inquiries",
        "/admin/admin-users",
        "/admin/profile",
        "/admin/sales-history",
      ],
      Waiter: [
        "/admin/profile",
        "/admin/waiter-panel",
        "/admin/cafe-waiter",
        "/admin/restaurant-waiter",
        "/admin/bar-waiter",
        "/admin/orders",
      ],
      "Cafe Waiter": [
        "/admin/profile",
        "/admin/cafe-waiter",
        "/admin/cafe-book-table",
        "/admin/cafe-menu",
        "/admin/orders",
        "/admin/billing",
      ],
      "Restaurant Waiter": [
        "/admin/profile",
        "/admin/restaurant-waiter",
        "/admin/res-book-table",
        "/admin/restaurant-menu",
        "/admin/orders",
        "/admin/billing",
      ],
      "Bar Waiter": [
        "/admin/profile",
        "/admin/bar-waiter",
        "/admin/bar-book-table",
        "/admin/bar-menu",
        "/admin/orders",
        "/admin/billing",
      ],
      Bartender: [
        "/admin/profile",
        "/admin/bar-menu",
      ],
      Housekeeping: [
        "/admin/profile",
        "/admin/housekeeping-panel",
        "/admin/room-bookings",
        "/admin/rooms",
      ],
      Chef: [
        "/admin/profile",
        "/admin/cuisines",
        "/admin/categories",
        "/admin/dishes",
        "/admin/admin-menu",
        "/admin/orders",
        "/admin/kds",
      ],
      User: ["/admin"],
    };

    const isChefRole = role === "Chef" || role === "Cafe Chef" || role === "Restaurant Chef" || role === "Bar Chef";
    const allowed = isChefRole ? ["/admin/profile", "/admin", "/admin/cuisines", "/admin/categories", "/admin/dishes", "/admin/admin-menu", "/admin/orders", "/admin/kds"] : ROLE_ROUTE_MAP[role];
    
    return allowed && allowed.length > 0 ? allowed[0] : "/admin";
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const targetPath = user.role === "User" ? "/" : getFirstAllowedRoute(user.role);
      navigate(targetPath);
    }
  }, [isAuthenticated, user, navigate]);

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
    
    const result = await login(form.email, form.password);
    
    if (result.success) {
      onToast("Welcome back! Redirecting…", "success");
      setTimeout(() => {
        const targetPath = result.data.data.role === "User" ? "/" : getFirstAllowedRoute(result.data.data.role);
        navigate(targetPath);
      }, 1000);
    } else {
      onToast(result.error, "error");
    }
    
    setLoading(false);
  };

  const handleSocialLogin = (platform) => {
    onToast(`Redirecting to ${platform} login...`, "success");
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

      {/* <SelectField 
        label="Role" 
        id="login_role" 
        icon={<FiUser />}
        options={ALL_ROLES}
        value={form.role}
        onChange={set("role")}
      /> */}

      <div className="z_forgot_row">
        <button type="button" className="z_forgot_link" onClick={() => onSuccess('forgot')}>Forgot password?</button>
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

const RegisterForm = ({ onSuccess, onToast }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name)               e.name    = "Full name is required";
    if (!form.email)              e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone)              e.phone   = "Phone number is required";
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
    
    const result = await register(form.name, form.email, form.phone, form.password);
    
    if (result.success) {
      onToast("Account created! Please login.", "success");
      onSuccess("register");
    } else {
      onToast(result.error, "error");
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="z_slide_in">
      <div className="z_form_title">Create an <em>Account.</em></div>
      <div className="z_form_desc">Join us for exclusive dining, café &amp; bar access.</div>

      <Field label="Full name" id="reg_name" icon={<FiUser />}
        placeholder="Your name"
        value={form.name} onChange={set("name")} error={errors.name} />
        
      <Field label="Phone number" id="reg_phone" icon={<FiPhone />}
        placeholder="+91 98765 43210"
        value={form.phone} onChange={set("phone")} error={errors.phone} />
        
      <Field label="Email address" id="reg_email" icon={<FiMail />}
        type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />
        
      {/* <SelectField 
        label="Role" 
        id="reg_role" 
        icon={<FiUser />}
        options={ALL_ROLES}
        value={form.role}
        onChange={set("role")}
      /> */}
        
      <Field label="Password" id="reg_pw" icon={<FiLock />}
        isPassword placeholder="Min. 8 characters"
        value={form.password} onChange={set("password")} error={errors.password} />
        
      <Field label="Confirm password" id="reg_cpw" icon={<FiLock />}
        isPassword placeholder="Repeat password"
        value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

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

const ForgotPasswordForm = ({ onBack, onSuccess, onToast }) => {
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = form.otp.split('');
    newOtp[index] = value.slice(-1);
    const updatedOtp = newOtp.join('');
    setForm(f => ({ ...f, otp: updatedOtp }));

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !form.otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const validateEmail = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const validateOtp = () => {
    const e = {};
    if (!form.otp || form.otp.length !== 6) e.otp = "Please enter complete OTP";
    return e;
  };

  const validatePassword = () => {
    const e = {};
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8) e.newPassword = "At least 8 characters";
    if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleEmailSubmit = async (ev) => {
    ev.preventDefault();
    const e = validateEmail();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    
    const result = await forgotPassword(form.email);
    
    if (result.success) {
      onToast("OTP sent to your email!", "success");
      setStep("otp");
    } else {
      onToast(result.error, "error");
    }
    
    setLoading(false);
  };

  const handleOtpSubmit = async (ev) => {
    ev.preventDefault();
    const e = validateOtp();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    
    const result = await verifyOTP(form.email, form.otp);
    
    if (result.success) {
      setResetToken(result.resetToken);
      onToast("OTP verified!", "success");
      setStep("reset");
    } else {
      onToast(result.error, "error");
    }
    
    setLoading(false);
  };

  const handleResetSubmit = async (ev) => {
    ev.preventDefault();
    const e = validatePassword();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    
    const result = await resetPassword(form.email, form.newPassword, form.confirmPassword);
    
    if (result.success) {
      onToast("Password reset successfully!", "success");
      setStep("success");
    } else {
      onToast(result.error, "error");
    }
    
    setLoading(false);
  };

  return (
    <form 
      onSubmit={step === "email" ? handleEmailSubmit : step === "otp" ? handleOtpSubmit : handleResetSubmit} 
      noValidate 
      className="z_slide_in"
    >
      <div className="z_form_title">Reset <em>password.</em></div>
      <div className="z_form_desc">
        {step === "email" && "Enter your email and we'll send you an OTP."}
        {step === "otp" && `Enter the 4-digit code sent to ${form.email}`}
        {step === "reset" && "Create a strong new password for your account."}
        {step === "success" && "Your password has been changed successfully!"}
      </div>

      {step === "success" ? (
        <div className="text-center">
          <div className="z_success_box z_fade_in">
            <div className="z_success_icon"><FiStar /></div>
            <div className="z_success_title">All set!</div>
            <div className="z_success_desc" style={{ marginBottom: 28 }}>
              You can now sign in with your new password.
            </div>
            <button type="button" className="z_submit_btn" onClick={() => onSuccess('login')} style={{ maxWidth: 200, margin: "0 auto" }}>
              <span className="z_btn_text">Back to Login</span><FiArrowRight className="z_btn_arrow" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {step === "email" && (
            <Field label="Email address" id="forgot_email" icon={<FiMail />}
              type="email" placeholder="you@example.com"
              value={form.email} onChange={set("email")} error={errors.email} />
          )}

          {step === "otp" && (
            <div className="z_field_group">
              <label className="z_field_label">OTP Code</label>
              <div className="z_reg_otp-container">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength="1"
                    value={form.otp[idx] || ""}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="z_reg_otp-input"
                    required
                  />
                ))}
              </div>
              {errors.otp && <div className="z_error_msg">{errors.otp}</div>}
            </div>
          )}

          {step === "reset" && (
            <>
              <Field label="New Password" id="new_pw" icon={<FiLock />}
                isPassword placeholder="Min. 8 characters"
                value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} />
              <Field label="Confirm Password" id="confirm_new_pw" icon={<FiLock />}
                isPassword placeholder="Repeat password"
                value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
            </>
          )}

          <button type="submit" className="z_submit_btn" disabled={loading}>
            {loading
              ? <><div className="z_spinner" /><span className="z_btn_text">Processing…</span></>
              : <><span className="z_btn_text">
                  {step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
                </span><FiArrowRight className="z_btn_arrow" /></>}
          </button>

          <div className="z_forgot_row" style={{ justifyContent: "center", marginTop: 20, marginBottom: 0 }}>
            <button type="button" className="z_forgot_link" onClick={onBack}>
              <FiArrowLeft size={12} style={{ marginRight: 6 }} />
              {step === "email" ? "Back to sign in" : "Go back"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

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
        ? "Check your email for the password reset OTP."
        : "Your account has been created. Please login."}
    </div>
    <button className="z_submit_btn" onClick={onBack} style={{ maxWidth: 200, margin: "0 auto" }}>
      <span className="z_btn_text">Continue</span><FiArrowRight className="z_btn_arrow" />
    </button>
  </div>
);

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [success, setSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSuccess = (mode) => {
    if (mode === 'forgot') {
      setTab('forgot');
    } else {
      setSuccess(mode);
    }
  };
  
  const handleToast = (msg, type) => setToast({ msg, type, key: Date.now() });

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
      <div className="z_bg_canvas">
        <div className="z_bg_orb z_bg_orb_1" />
        <div className="z_bg_orb z_bg_orb_2" />
        <div className="z_bg_orb z_bg_orb_3" />
      </div>
      <div className="z_bg_grain" />

      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="z_auth_layout">
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
                {tab !== "forgot" && (
                  <div className="z_tab_strip">
                    <div className={`z_tab_indicator z_${tab}`} />
                    <button className={`z_tab_btn${tab === "login" ? " z_active" : ""}`} onClick={() => handleTabSwitch("login")}>Sign In</button>
                    <button className={`z_tab_btn${tab === "register" ? " z_active" : ""}`} onClick={() => handleTabSwitch("register")}>Register</button>
                  </div>
                )}
                <div className="z_form_container" key={tab}>
                  {tab === "login"
                    ? <LoginForm    onSuccess={handleSuccess} onToast={handleToast} />
                    : tab === "register"
                    ? <RegisterForm onSuccess={handleSuccess} onToast={handleToast} />
                    : <ForgotPasswordForm onBack={() => handleTabSwitch("login")} onSuccess={handleTabSwitch} onToast={handleToast} />}
                </div>
                <div className="z_terms_text" style={{ marginTop: 24 }}>
                  Protected by enterprise-grade security &amp; encryption.
                </div>
              </>
            ) : (
              <SuccessView mode={success} onBack={() => handleTabSwitch("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
