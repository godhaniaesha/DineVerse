import React from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="z_footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand & About */}
          <div className="col-lg-4 col-md-6">
            <div className="z_footer_brand">
              <h2 className="z_footer_logo">
                <HiSparkles className="z_footer_sparkle" />
                DineVerse
              </h2>
              <p className="z_footer_about">
                Crafting culinary memories through fine dining, signature drinks, 
                and luxury stays. A symphony of flavors, aesthetics, and refined hospitality.
              </p>
              <div className="z_footer_socials">
                <a href="#" className="z_footer_social_link"><FaFacebookF /></a>
                <a href="#" className="z_footer_social_link"><FaInstagram /></a>
                <a href="#" className="z_footer_social_link"><FaTwitter /></a>
                <a href="#" className="z_footer_social_link"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h4 className="z_footer_heading">Explore</h4>
            <ul className="z_footer_links list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/bar">The Bar</Link></li>
              <li><Link to="/rooms">Stay With Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 col-6">
            <h4 className="z_footer_heading">Contact</h4>
            <ul className="z_footer_info list-unstyled">
              <li>
                <MdLocationOn className="z_footer_icon" />
                <span>123 Lumière Lane, Surat, GJ</span>
              </li>
              <li>
                <MdPhone className="z_footer_icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <MdEmail className="z_footer_icon" />
                <span>hello@dineverse.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="col-lg-3 col-md-6">
            <h4 className="z_footer_heading">Hours</h4>
            <ul className="z_footer_info list-unstyled">
              <li>
                <MdAccessTime className="z_footer_icon" />
                <div>
                  <strong>Restaurant:</strong><br />
                  Mon – Sun: 6 PM – 11 PM
                </div>
              </li>
              <li>
                <MdAccessTime className="z_footer_icon" />
                <div>
                  <strong>The Bar:</strong><br />
                  Mon – Sun: 5 PM – 2 AM
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="z_footer_bottom mt-5 pt-4 border-top border-secondary border-opacity-25">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="z_footer_copy mb-0">
                &copy; {new Date().getFullYear()} DineVerse. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="z_footer_bottom_links list-inline mb-0">
                <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                <li className="list-inline-item"><a href="#">Terms of Service</a></li>
                <li className="list-inline-item"><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
