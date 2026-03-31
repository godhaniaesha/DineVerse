import React, { useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/z_style.css'

export default function Register() {
  // authMode: 'signIn', 'signUp', 'forgotPassword'
  const [authMode, setAuthMode] = useState('signIn')
  
  // fpStep: 'email', 'otp', 'reset', 'success'
  const [fpStep, setFpStep] = useState('email')
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    phone: '',
    newPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    })
  }

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (authMode === 'forgotPassword') {
      if (fpStep === 'email') {
        console.log('Sending OTP to:', formData.email)
        setFpStep('otp')
      } else if (fpStep === 'otp') {
        console.log('Verifying OTP:', otp.join(''))
        setFpStep('reset')
      } else if (fpStep === 'reset') {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match!')
          return
        }
        console.log('Resetting password for:', formData.email)
        setFpStep('success')
      }
    } else {
      console.log(`${authMode} submitted:`, formData)
    }
  }

  const toggleMode = (mode) => {
    setAuthMode(mode)
    setFpStep('email')
    setError('')
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      restaurantName: '',
      phone: '',
      newPassword: ''
    })
    setOtp(['', '', '', ''])
  }

  return (
    <div className="z_reg_main-container">
      <div className="z_reg_background-pattern">
        <div className="z_reg_orb z_reg_orb-1"></div>
        <div className="z_reg_orb z_reg_orb-2"></div>
        <div className="z_reg_orb z_reg_orb-3"></div>
      </div>

      <div className="z_reg_auth-wrapper">
        {/* Left Side - Visual Content (Hidden on Mobile) */}
        <div className="z_reg_visual-section">
          <div className="z_reg_brand-showcase">
            <h1 className="z_reg_brand-title">DineVerse</h1>
            <p className="z_reg_brand-subtitle">
              {authMode === 'signIn' && "Experience the future of restaurant management with our all-in-one ecosystem."}
              {authMode === 'signUp' && "Join the elite network of culinary masters and scale your business globally."}
              {authMode === 'forgotPassword' && "Security is our priority. Let's get your account access restored safely."}
            </p>

            <div className="z_reg_visual-stats">
              <div className="z_reg_stat-card">
                <div className="z_reg_stat-icon">
                  <i className={`fas ${authMode === 'signUp' ? 'fa-rocket' : 'fa-store'}`}></i>
                </div>
                <div className="z_reg_stat-content">
                  <h3>{authMode === 'signUp' ? 'Quick Setup' : '2,847'}</h3>
                  <p>{authMode === 'signUp' ? 'Launch in under 10m' : 'Active Restaurants'}</p>
                </div>
              </div>
              <div className="z_reg_stat-card">
                <div className="z_reg_stat-icon">
                  <i className={`fas ${authMode === 'signUp' ? 'fa-chart-line' : 'fa-shopping-cart'}`}></i>
                </div>
                <div className="z_reg_stat-content">
                  <h3>{authMode === 'signUp' ? 'Growth Engine' : '15.2K'}</h3>
                  <p>{authMode === 'signUp' ? 'Advanced Analytics' : 'Daily Orders'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="z_reg_form-section">
          <div className="z_reg_form-header">
            <h2 className="z_reg_form-title">
              {authMode === 'signIn' && 'Welcome Back'}
              {authMode === 'signUp' && 'Create Account'}
              {authMode === 'forgotPassword' && (
                fpStep === 'email' ? 'Forgot Password?' : 
                fpStep === 'otp' ? 'Verify Email' : 
                fpStep === 'reset' ? 'New Password' : 'Reset Complete'
              )}
            </h2>
            <p className="z_reg_form-subtitle">
              {authMode === 'signIn' && 'Please enter your details to sign in'}
              {authMode === 'signUp' && 'Enter your business details to get started'}
              {authMode === 'forgotPassword' && (
                fpStep === 'email' ? 'Enter your email to receive a recovery OTP' : 
                fpStep === 'otp' ? `We've sent a 4-digit code to ${formData.email}` : 
                fpStep === 'reset' ? 'Create a strong new password for your account' :
                'Your password has been changed successfully!'
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="z_reg_auth-form">
            {error && <div className="z_reg_error-msg mb-3 text-danger text-center small">{error}</div>}

            {/* SUCCESS VIEW */}
            {authMode === 'forgotPassword' && fpStep === 'success' && (
              <div className="z_reg_success-view text-center py-4">
                <div className="z_reg_success-icon-wrapper mb-4">
                  <div className="z_reg_success-checkmark">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
                <p className="z_reg_success-text mb-4">
                  You can now sign in with your new password.
                </p>
                <button 
                  type="button" 
                  onClick={() => toggleMode('signIn')} 
                  className="z_reg_submit-btn"
                >
                  <span className="z_reg_btn-text">Back to Login</span>
                  <i className="fas fa-sign-in-alt z_reg_btn-icon"></i>
                </button>
              </div>
            )}
            {/* FORM FIELDS (Hidden on success) */}
            {fpStep !== 'success' && (
              <>
                {/* SIGN UP FIELDS */}
                {authMode === 'signUp' && (
              <>
                <div className="z_reg_form-group">
                  <label className="z_reg_form-label">Full Name</label>
                  <div className="z_reg_input-wrapper">
                    <i className="fas fa-user z_reg_input-icon"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="z_reg_form-control"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div className="z_reg_form-group">
                  <label className="z_reg_form-label">Business Name</label>
                  <div className="z_reg_input-wrapper">
                    <i className="fas fa-store z_reg_input-icon"></i>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      className="z_reg_form-control"
                      placeholder="The Gourmet Kitchen"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL FIELD (SignIn, SignUp, FP Step Email) */}
            {(authMode !== 'forgotPassword' || fpStep === 'email') && (
              <div className="z_reg_form-group">
                <label className="z_reg_form-label">Email Address</label>
                <div className="z_reg_input-wrapper">
                  <i className="fas fa-envelope z_reg_input-icon"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="z_reg_form-control"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* OTP FIELDS */}
            {authMode === 'forgotPassword' && fpStep === 'otp' && (
              <div className="z_reg_otp-container">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="z_reg_otp-input"
                    required
                  />
                ))}
              </div>
            )}

            {/* PASSWORD FIELD (SignIn, SignUp) */}
            {authMode !== 'forgotPassword' && (
              <div className="z_reg_form-group">
                <label className="z_reg_form-label">Password</label>
                <div className="z_reg_input-wrapper">
                  <i className="fas fa-lock z_reg_input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="z_reg_form-control"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="z_reg_password-toggle"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            )}

            {/* RESET PASSWORD FIELDS */}
            {authMode === 'forgotPassword' && fpStep === 'reset' && (
              <>
                <div className="z_reg_form-group">
                  <label className="z_reg_form-label">New Password</label>
                  <div className="z_reg_input-wrapper">
                    <i className="fas fa-lock z_reg_input-icon"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="z_reg_form-control"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="z_reg_password-toggle"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="z_reg_form-group">
                  <label className="z_reg_form-label">Confirm New Password</label>
                  <div className="z_reg_input-wrapper">
                    <i className="fas fa-shield-alt z_reg_input-icon"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="z_reg_form-control"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* FORGOT PASSWORD LINK */}
            {authMode === 'signIn' && (
              <div className="d-flex justify-content-end mb-3">
                <button 
                  type="button"
                  onClick={() => toggleMode('forgotPassword')}
                  className="z_reg_toggle-link" 
                  style={{fontSize: '0.85rem'}}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="z_reg_submit-btn">
              <span className="z_reg_btn-text">
                {authMode === 'signIn' && 'Sign In'}
                {authMode === 'signUp' && 'Create Account'}
                {authMode === 'forgotPassword' && (
                  fpStep === 'email' ? 'Send OTP' : 
                  fpStep === 'otp' ? 'Verify OTP' : 'Reset Password'
                )}
              </span>
              <i className="fas fa-arrow-right z_reg_btn-icon"></i>
            </button>

            {/* SOCIAL BUTTONS (Only for Login/Register) */}
            {authMode !== 'forgotPassword' && (
              <div className="z_reg_social-buttons">
                <button type="button" className="z_reg_social-btn">
                  <i className="fab fa-google"></i> Google
                </button>
                <button type="button" className="z_reg_social-btn">
                  <i className="fab fa-facebook-f"></i> Facebook
                </button>
              </div>
            )}

                {/* TOGGLE LINKS */}
                <div className="z_reg_toggle-form">
                  <p>
                    {authMode === 'signIn' && (
                      <>New to DineVerse? <button type="button" onClick={() => toggleMode('signUp')} className="z_reg_toggle-link">Create an account</button></>
                    )}
                    {authMode === 'signUp' && (
                      <>Already have an account? <button type="button" onClick={() => toggleMode('signIn')} className="z_reg_toggle-link">Sign in here</button></>
                    )}
                    {authMode === 'forgotPassword' && (
                      <>Remembered your password? <button type="button" onClick={() => toggleMode('signIn')} className="z_reg_toggle-link">Back to login</button></>
                    )}
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
