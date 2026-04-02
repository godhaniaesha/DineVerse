import React, { useState } from "react";
import {
    FiUser,
    FiCalendar,
    FiCreditCard,
    FiLock,
    FiLogOut,
    FiEdit2,
    FiMapPin,
    FiPhone,
    FiMail,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiFileText,
    FiEye,
    FiEyeOff,
    FiAlertCircle
} from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/z_style.css";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="z_prof_section">
                        <h2 className="z_prof_section_title">Personal <span>Details</span></h2>

                        <div className="z_prof_user_info z_md">
                            <div className="z_prof_avatar_wrap">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                                    alt="Profile"
                                    className="z_prof_avatar"
                                />
                                <div className="z_prof_avatar_edit">
                                    <FiEdit2 size={16} />
                                </div>
                            </div>
                            <h3 className="z_prof_user_name">John Doe</h3>
                            <div className="z_prof_user_tag">Elite Member</div>
                        </div>
                        <div className="z_prof_grid">
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Legal Name</label>
                                <input type="text" className="z_prof_input" defaultValue="John Doe" />
                            </div>
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Email Identity</label>
                                <input type="email" className="z_prof_input" defaultValue="john.doe@example.com" />
                            </div>
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Contact Number</label>
                                <input type="tel" className="z_prof_input" defaultValue="+91 98765 43210" />
                            </div>
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Current City</label>
                                <input type="text" className="z_prof_input" defaultValue="Mumbai, India" />
                            </div>
                        </div>
                            <div className="w-100 justify-content-center d-flex mt-3">
                                <button className="z_prof_save_btn">Update Profile</button>
                            </div>
                    </div>
                );
            case "bookings":
                return (
                    <div className="z_prof_section">
                        <h2 className="z_prof_section_title">Reservation <span>History</span></h2>
                        <div className="z_prof_bookings_list">
                            {[
                                { id: 1, venue: "The Restaurant", date: "Oct 24, 2023", time: "08:30 PM", status: "confirmed", accent: "var(--d-restaurant)" },
                                { id: 2, venue: "The Bar", date: "Oct 28, 2023", time: "10:00 PM", status: "pending", accent: "var(--d-bar)" },
                                { id: 3, venue: "The Café", date: "Nov 02, 2023", time: "09:00 AM", status: "confirmed", accent: "var(--d-cafe)" },
                            ].map((booking) => (
                                <div key={booking.id} className="z_prof_booking_card" style={{ '--accent': booking.accent }}>
                                    <div className="z_prof_booking_info">
                                        <h4>{booking.venue}</h4>
                                        <div className="z_prof_booking_meta">
                                            <span><FiCalendar /> {booking.date}</span>
                                            <span><FiClock /> {booking.time}</span>
                                        </div>
                                    </div>
                                    <span className={`z_prof_booking_status z_prof_status_${booking.status}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "billing":
                return (
                    <div className="z_prof_section">
                        <div className="z_prof_billing_history" >
                            <h3 className="z_prof_label" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <FiFileText /> Transaction History
                            </h3>
                            <div className="z_prof_history_table_wrap">
                                <table className="z_prof_history_table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Service</th>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { date: 'Oct 24, 2023', service: 'Restaurant', id: '#DV-9821', amount: '₹4,500' },
                                            { date: 'Oct 15, 2023', service: 'The Bar', id: '#DV-9540', amount: '₹2,800' },
                                            { date: 'Sep 30, 2023', service: 'The Café', id: '#DV-9102', amount: '₹1,250' },
                                            { date: 'Sep 12, 2023', service: 'Room Booking', id: '#DV-8744', amount: '₹12,000' },
                                        ].map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.date}</td>
                                                <td>{item.service}</td>
                                                <td style={{ opacity: 0.6 }}>{item.id}</td>
                                                <td className="z_prof_amount">{item.amount}</td>
                                                <td>
                                                    <button className="z_prof_download_btn">
                                                        <FiDownload /> Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case "password":
                return (
                    <div className="z_prof_section">
                        <h2 className="z_prof_section_title">Security <span>Access</span></h2>
                        <div className="z_prof_grid">
                            <div className="z_prof_field_group" style={{ gridColumn: "span 2" }}>
                                <label className="z_prof_label">Current Credentials</label>
                                <div className="z_prof_pass_wrapper">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        className="z_prof_input"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="z_prof_eye_btn"
                                        onClick={() => togglePasswordVisibility('current')}
                                    >
                                        {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">New Key</label>
                                <div className="z_prof_pass_wrapper">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        className="z_prof_input"
                                        placeholder="New password"
                                    />
                                    <button
                                        type="button"
                                        className="z_prof_eye_btn"
                                        onClick={() => togglePasswordVisibility('new')}
                                    >
                                        {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Verify Key</label>
                                <div className="z_prof_pass_wrapper">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        className="z_prof_input"
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        className="z_prof_eye_btn"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                    >
                                        {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <button className="z_prof_save_btn">Change Access Key</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="z_prof_page_wrapper">
            <Header />

            <div className="z_prof_hero_banner"></div>

            <div className="z_prof_container">
                {/* Sidebar */}
                <aside className="z_prof_sidebar">
                    <div className="z_prof_user_info z_all">
                        <div className="z_prof_avatar_wrap">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                                alt="Profile"
                                className="z_prof_avatar"
                            />
                            <div className="z_prof_avatar_edit">
                                <FiEdit2 size={16} />
                            </div>
                        </div>
                        <h3 className="z_prof_user_name">John Doe</h3>
                        <div className="z_prof_user_tag">Elite Member</div>
                    </div>

                    <nav className="z_prof_nav">
                        <button
                            className={`z_prof_nav_item ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <FiUser className="z_prof_nav_icon" />
                            Profile
                        </button>
                        <button
                            className={`z_prof_nav_item ${activeTab === "bookings" ? "active" : ""}`}
                            onClick={() => setActiveTab("bookings")}
                        >
                            <FiCalendar className="z_prof_nav_icon" />
                            Bookings
                        </button>
                        <button
                            className={`z_prof_nav_item ${activeTab === "billing" ? "active" : ""}`}
                            onClick={() => setActiveTab("billing")}
                        >
                            <FiCreditCard className="z_prof_nav_icon" />
                            Billing
                        </button>
                        <button
                            className={`z_prof_nav_item ${activeTab === "password" ? "active" : ""}`}
                            onClick={() => setActiveTab("password")}
                        >
                            <FiLock className="z_prof_nav_icon" />
                            Security
                        </button>

                        <div className="z_prof_nav_logout">
                            <button
                                className="z_prof_nav_item z_prof_logout_btn"
                                onClick={() => setShowLogoutModal(true)}
                            >
                                <FiLogOut className="z_prof_nav_icon" />
                                Sign Out
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="z_prof_content">
                    {renderContent()}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="z_modal_overlay">
                    <div className="z_modal_content">
                        <div className="z_modal_icon">
                            <FiAlertCircle />
                        </div>
                        <h2 className="z_modal_title">Sign Out?</h2>
                        <p className="z_modal_text">
                            Are you sure you want to sign out from DineVerse? <br />
                            You will need to login again to access your bookings.
                        </p>
                        <div className="z_modal_actions">
                            <button
                                className="z_modal_btn z_modal_btn_cancel"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Stay Logged In
                            </button>
                            <button
                                className="z_modal_btn z_modal_btn_confirm"
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    alert("Logging out..."); // Replace with actual logout logic
                                }}
                            >
                                Yes, Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}