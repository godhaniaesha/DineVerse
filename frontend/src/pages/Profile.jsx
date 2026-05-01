import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
    FiAlertCircle,
    FiStar
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/z_style.css";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, changePassword, updateProfile, isAuthenticated, token } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reviewStars, setReviewStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [reviewTags, setReviewTags] = useState("");
    const [reviewProfession, setReviewProfession] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");

    const [profileForm, setProfileForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        img: null
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState("");

    useEffect(() => {
        if (user) {
            setProfileForm({
                full_name: user.full_name || "",
                email: user.email || "",
                phone: user.phone || "",
                img: null
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!token || !isAuthenticated) return;
            try {
                setBookingsLoading(true);
                setBookingsError("");
                const response = await fetch("http://localhost:8000/api/user/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok || !data?.success) {
                    throw new Error(data?.msg || "Failed to load bookings");
                }
                setBookings(data?.data || []);
            } catch (error) {
                setBookings([]);
                setBookingsError(error.message || "Failed to load bookings");
            } finally {
                setBookingsLoading(false);
            }
        };

        fetchBookings();
    }, [token, isAuthenticated]);

    const formatBookingDate = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
    };

    const formatStatus = (status = "") => status.toLowerCase().replace(/\s+/g, "_");

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("full_name", profileForm.full_name);
            formData.append("email", profileForm.email);
            formData.append("phone", profileForm.phone);
            if (profileForm.img) {
                formData.append("img", profileForm.img);
            }
            
            const result = await updateProfile(user._id, formData);
            if (result.success) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        
        try {
            setLoading(true);
            const result = await changePassword(
                passwordForm.oldPassword, 
                passwordForm.newPassword
            );
            
            if (result.success) {
                toast.success("Password changed successfully!");
                setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(result.error || "Failed to change password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error changing password");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const downloadInvoice = (item) => {
        const doc = new jsPDF();
        
        // Brand Identity
        doc.setFillColor(8, 7, 5); // var(--h-void)
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(200, 150, 90); // var(--h-champ)
        doc.setFontSize(28);
        doc.setFont("bodoni", "italic");
        doc.text("DineVerse", 105, 25, { align: "center" });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Luxury Dining & Stays", 105, 32, { align: "center" });

        // Invoice Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(20);
        doc.text("INVOICE", 20, 60);
        
        doc.setFontSize(10);
        doc.text(`Invoice No: ${item.id}`, 20, 70);
        doc.text(`Date: ${item.date}`, 20, 75);
        doc.text(`Transaction Status: Completed`, 20, 80);

        // Customer Details
        doc.setFontSize(12);
        doc.text("Billed To:", 140, 60);
        doc.setFontSize(10);
        doc.text(user?.full_name || "Guest User", 140, 67);
        doc.text(user?.email || "", 140, 72);
        doc.text(user?.phone || "", 140, 77);

        // Table
        doc.autoTable({
            startY: 95,
            head: [['Description', 'Service Type', 'Total']],
            body: [
                [`Booking Reference ${item.id}`, item.service, item.amount]
            ],
            headStyles: { fillColor: [200, 150, 90], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { top: 95 }
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Amount Paid: ${item.amount}`, 140, finalY + 10);

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing DineVerse. We hope to see you again!", 105, 280, { align: "center" });
        doc.text("12 Rue de la Paix, Paris | +1 (800) 555-NOIR", 105, 285, { align: "center" });

        doc.save(`Invoice_${item.id}.pdf`);
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
                                    src={user?.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                                    alt="Profile"
                                    className="z_prof_avatar"
                                />
                                <div className="z_prof_avatar_edit">
                                    <FiEdit2 size={16} />
                                </div>
                            </div>
                            <h3 className="z_prof_user_name">{user?.full_name || "User"}</h3>
                            <div className="z_prof_user_tag">{user?.role || "Member"}</div>
                        </div>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="row g-4">
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Legal Name</label>
                                        <input 
                                            type="text" 
                                            className="z_prof_input" 
                                            value={profileForm.full_name}
                                            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Email Identity</label>
                                        <input 
                                            type="email" 
                                            className="z_prof_input" 
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Contact Number</label>
                                        <input 
                                            type="tel" 
                                            className="z_prof_input" 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Profile Image</label>
                                        <input 
                                            type="file" 
                                            className="z_prof_input" 
                                            accept="image/*"
                                            onChange={(e) => setProfileForm({ ...profileForm, img: e.target.files[0] })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 justify-content-center d-flex mt-3">
                                <button type="submit" className="z_prof_save_btn" disabled={loading}>
                                    {loading ? "Updating..." : "Update Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case "bookings":
                return (
                    <div className="z_prof_section">
                        <h2 className="z_prof_section_title">Reservation <span>History</span></h2>
                        <div className="z_prof_bookings_list">
                            {bookingsLoading && <p>Loading bookings...</p>}
                            {bookingsError && <p style={{ color: "var(--d-danger, #dc3545)" }}>{bookingsError}</p>}
                            {!bookingsLoading && !bookingsError && bookings.length === 0 && <p>No bookings found yet.</p>}
                            {bookings.map((booking) => (
                                <div key={booking.id} className="z_prof_booking_card" style={{ '--accent': booking.type === "Room" ? "var(--d-room)" : "var(--d-restaurant)" }}>
                                    <div className="z_prof_booking_info">
                                        <h4>{booking.service}</h4>
                                        <div className="z_prof_booking_meta">
                                            <span><FiCalendar /> {formatBookingDate(booking.date)}</span>
                                            <span><FiClock /> {booking.time || "-"}</span>
                                        </div>
                                        <div className="z_prof_booking_meta">
                                            <span><FiFileText /> {booking.bookingRef || "-"}</span>
                                        </div>
                                        {formatStatus(booking.status) === "completed" && (
                                            <div 
                                                className="z_prof_booking_stars"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setReviewStars(0);
                                                    setHoverStars(0);
                                                    setReviewTags([]);
                                                    setReviewProfession("");
                                                    setReviewMessage("");
                                                    setShowReviewModal(true);
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FiStar key={star} className="z_prof_star_icon" />
                                                ))}
                                                <span className="z_prof_rate_text">Rate your experience</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={`z_prof_booking_status z_prof_status_${formatStatus(booking.status)}`}>
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
                              <h2 className="z_prof_section_title">Transaction <span>History</span></h2>
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
                                                    <button 
                                                        className="z_prof_download_btn"
                                                        onClick={() => downloadInvoice(item)}
                                                    >
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
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="row g-4">
                                <div className="col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Current Credentials</label>
                                        <div className="z_prof_pass_wrapper">
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                className="z_prof_input"
                                                placeholder="Enter current password"
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
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
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">New Key</label>
                                        <div className="z_prof_pass_wrapper">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                className="z_prof_input"
                                                placeholder="New password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
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
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="z_prof_field_group">
                                        <label className="z_prof_label">Verify Key</label>
                                        <div className="z_prof_pass_wrapper">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                className="z_prof_input"
                                                placeholder="Confirm password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
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
                                </div>
                                <div className="col-12 justify-content-center d-flex ">
                                    <button type="submit" className="z_prof_save_btn" disabled={loading}>
                                        {loading ? "Changing..." : "Change Access Key"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="z_prof_page_wrapper">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="z_prof_hero_banner"></div>

            <div className="z_prof_container">
                {/* Sidebar */}
                <aside className="z_prof_sidebar">
                    <div className="z_prof_user_info z_all">
                        <div className="z_prof_avatar_wrap">
                            <img
                                src={user?.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                                alt="Profile"
                                className="z_prof_avatar"
                            />
                            <div className="z_prof_avatar_edit">
                                <FiEdit2 size={16} />
                            </div>
                        </div>
                        <h3 className="z_prof_user_name">{user?.full_name || "User"}</h3>
                        <div className="z_prof_user_tag">{user?.role || "Member"}</div>
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
                            Are you sure you want to sign out from DineVerse? 
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
                                    handleLogout();
                                }}
                            >
                                Yes, Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <div className="z_modal_overlay z_review_overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="z_modal_content z_review_content" onClick={(e) => e.stopPropagation()}>
                        <div className="z_review_header">
                            <h2 className="z_modal_title">Review Your Experience</h2>
                            <p className="z_review_venue">{selectedBooking.venue}</p>
                        </div>

                        <div className="z_review_form">
                            {/* Star Rating */}
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Rating</label>
                                <div className="z_review_stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar
                                            key={star}
                                            className={`z_review_star ${star <= (hoverStars || reviewStars) ? 'active' : ''}`}
                                            onMouseEnter={() => setHoverStars(star)}
                                            onMouseLeave={() => setHoverStars(0)}
                                            onClick={() => setReviewStars(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Tags</label>
                                <input
                                    type="text"
                                    className="z_prof_input"
                                    placeholder="Add tags (comma separated)"
                                    value={reviewTags}
                                    onChange={(e) => setReviewTags(e.target.value)}
                                />
                            </div>

                            {/* Profession */}
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">Profession</label>
                                <input
                                    type="text"
                                    className="z_prof_input"
                                    placeholder="Your profession (optional)"
                                    value={reviewProfession}
                                    onChange={(e) => setReviewProfession(e.target.value)}
                                />
                            </div>

                            {/* Message */}
                            <div className="z_prof_field_group">
                                <label className="z_prof_label">
                                    Review Message
                                    <span className="z_char_count">{reviewMessage.length}/230</span>
                                </label>
                                <textarea
                                    className="z_prof_input z_review_textarea"
                                    placeholder="Share your experience..."
                                    maxLength={230}
                                    value={reviewMessage}
                                    onChange={(e) => setReviewMessage(e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="z_modal_actions z_review_actions">
                                <button
                                    className="z_modal_btn z_modal_btn_cancel"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="z_modal_btn z_modal_btn_confirm z_review_submit"
                                    onClick={() => {
                                        toast.success("Review submitted! Thank you for your feedback.");
                                        setShowReviewModal(false);
                                    }}
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
