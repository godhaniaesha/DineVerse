import React from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdArrowForward } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="z_footer">
            {/* Background Elements */}
            <div className="z_footer_glow z_footer_glow_1"></div>
            <div className="z_footer_glow z_footer_glow_2"></div>

            <div className="container position-relative">
                <div className="row g-5">
                    {/* Brand & About */}
                    <div className="col-lg-4 col-md-12 z_footer_col">
                        <div className="z_footer_brand">
                            <Link to="/" className="z_footer_logo_link">
                                    <h2 className="z_footer_logo">
                                        <HiSparkles className="z_footer_sparkle" />
                                        DineVerse
                                    </h2>
                                </Link>
                            <p className="z_footer_about">
                                Experience the pinnacle of hospitality at DineVerse. From our artisanal café 
                                and Michelin-starred dining to our curated bar and luxury suites, we craft 
                                every moment with obsessive intention and refined aesthetics.
                            </p>
                            <div className="z_footer_socials">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="z_footer_social_link" title="Facebook"><FaFacebookF /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="z_footer_social_link" title="Instagram"><FaInstagram /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="z_footer_social_link" title="Twitter"><FaTwitter /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="z_footer_social_link" title="LinkedIn"><FaLinkedinIn /></a>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div className="col-lg-8">
                        <div className="row g-4">
                            {/* Quick Links */}
                            <div className="col-md-3 col-6 z_footer_col">
                                <h4 className="z_footer_heading">Explore</h4>
                                <ul className="z_footer_links list-unstyled mb-0">
                                    <li><Link to="/"><MdArrowForward className="z_link_icon" /> Home</Link></li>
                                    <li><Link to="/about"><MdArrowForward className="z_link_icon" /> About Us</Link></li>
                                    <li><Link to="/services"><MdArrowForward className="z_link_icon" /> Services</Link></li>
                                    <li><Link to="/blog"><MdArrowForward className="z_link_icon" />Blog</Link></li>
                                    <li><Link to="/gallerypage"><MdArrowForward className="z_link_icon" /> Gallery</Link></li>
                                </ul>
                            </div>

                            {/* Booking Links */}
                            <div className="col-md-3 col-6 z_footer_col">
                                <h4 className="z_footer_heading">Reservations</h4>
                                <ul className="z_footer_links list-unstyled mb-0">
                                    <li><Link to="/bookTable"><MdArrowForward className="z_link_icon" /> Book a Table</Link></li>
                                    <li><Link to="/bookRoom"><MdArrowForward className="z_link_icon" /> Book a Room</Link></li>
                                    <li><Link to="/bar"><MdArrowForward className="z_link_icon" /> Bar Access</Link></li>
                                    <li><Link to="/contact"><MdArrowForward className="z_link_icon" /> Private Events</Link></li>
                                    <li><Link to="/faq"><MdArrowForward className="z_link_icon" /> FAQ</Link></li>
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className="col-md-6 z_footer_col">
                                <h4 className="z_footer_heading">Connect</h4>
                                <ul className="z_footer_info list-unstyled">
                                    <li className="z_info_item">
                                        <div className="z_info_icon_wrap">
                                            <MdLocationOn className="z_footer_icon" />
                                        </div>
                                        <div className="z_info_text">
                                            <strong>Location</strong>
                                            <span>123 DineVerse Lane, Vesu district, Surat, GJ 395007</span>
                                        </div>
                                    </li>
                                    <li className="z_info_item">
                                        <div className="z_info_icon_wrap">
                                            <MdEmail className="z_footer_icon" />
                                        </div>
                                        <div className="z_info_text">
                                            <strong>Email Us</strong>
                                            <span>hello@dineverse.com</span>
                                        </div>
                                    </li>
                                    <li className="z_info_item">
                                        <div className="z_info_icon_wrap">
                                            <MdPhone className="z_footer_icon" />
                                        </div>
                                        <div className="z_info_text">
                                            <strong>Call Us</strong>
                                            <span>+91 98765 43210</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter / Subscription Section Placeholder could go here */}

                {/* Bottom Bar */}
                <div className="z_footer_bottom">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="z_footer_copy mb-0">
                                &copy; {new Date().getFullYear()} <strong>DineVerse</strong>. Crafted with Passion.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <ul className="z_footer_bottom_links list-inline mb-0">
                                <li className="list-inline-item"><Link to="/privacy">Privacy Policy</Link></li>
                                <li className="list-inline-item"><Link to="/terms">Terms of Service</Link></li>
                                <li className="list-inline-item"><Link to="/faq">Cookie Settings</Link></li>
                                <li className="list-inline-item"><Link to="/contact">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
