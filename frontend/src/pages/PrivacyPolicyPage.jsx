import React from 'react';
import '../style/PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <main className="pp_page">
      {/* HERO / INTRO */}
      <section className="pp_hero">
        <div className="pp_container">
          <span className="pp_eyebrow">Legal & Privacy</span>
          <h1 className="pp_title">Privacy Policy</h1>
          <p className="pp_intro">
            This Privacy Policy explains how we collect, use, and protect your information
            when you visit our website or use our services.
          </p>
          <p className="pp_effective">
            Effective date: 01 April 2026
          </p>
        </div>
      </section>

      {/* QUICK INDEX */}
      {/* <section className="pp_index">
        <div className="pp_container pp_index_inner">
          <h2 className="pp_index_title">On this page</h2>
          <div className="pp_index_grid">
            <a href="#info-we-collect" className="pp_index_link">Information we collect</a>
            <a href="#how-we-use" className="pp_index_link">How we use your information</a>
            <a href="#cookies" className="pp_index_link">Cookies & tracking</a>
            <a href="#sharing" className="pp_index_link">Sharing of data</a>
            <a href="#security" className="pp_index_link">Data security</a>
            <a href="#rights" className="pp_index_link">Your rights</a>
            <a href="#changes" className="pp_index_link">Changes to this policy</a>
            <a href="#contact" className="pp_index_link">Contact us</a>
          </div>
        </div>
      </section> */}

      {/* CONTENT SECTIONS */}
      <section className="pp_content">
        <div className="pp_container">

          {/* 1. Info we collect */}
          <section id="info-we-collect" className="pp_block">
            <h2 className="pp_block_title">1. Information we collect</h2>
            <p className="pp_block_text">
              We may collect different types of information depending on how you interact with us,
              for example when you browse our website, make a reservation, or contact our team.[web:51]
            </p>

            <div className="pp_two_col">
              <div className="pp_col">
                <h3 className="pp_subtitle">1.1 Information you provide directly</h3>
                <ul className="pp_list">
                  <li>Name and contact details (such as email address and phone number).</li>
                  <li>Booking and stay details (dates, preferences, special requests).</li>
                  <li>Payment information that you share with our secure payment provider.</li>
                  <li>Messages you send us via forms, email, or chat.</li>
                </ul>
              </div>
              <div className="pp_col">
                <h3 className="pp_subtitle">1.2 Information collected automatically</h3>
                <ul className="pp_list">
                  <li>Device and browser information.</li>
                  <li>IP address and approximate location.</li>
                  <li>Pages viewed and actions taken on our site.</li>
                  <li>Cookies and similar technologies (see section 3).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How we use */}
          <section id="how-we-use" className="pp_block">
            <h2 className="pp_block_title">2. How we use your information</h2>
            <p className="pp_block_text">
              We use your information only for legitimate purposes connected to providing and improving our services.[web:52]
            </p>
            <ul className="pp_list">
              <li>To process reservations, payments, and manage your stay experience.</li>
              <li>To respond to your questions, requests, or feedback.</li>
              <li>To personalise offers and recommendations based on your preferences.</li>
              <li>To maintain the security and performance of our website.</li>
              <li>To comply with legal obligations and enforce our policies.</li>
            </ul>
          </section>

          {/* 3. Cookies */}
          <section id="cookies" className="pp_block">
            <h2 className="pp_block_title">3. Cookies and tracking technologies</h2>
            <p className="pp_block_text">
              Our website may use cookies and similar technologies to remember your preferences and
              understand how visitors use the site.[web:52]
            </p>
            <ul className="pp_list">
              <li>
                Essential cookies that help the site function correctly (for example, keeping your session active).
              </li>
              <li>
                Analytics cookies that help us understand traffic and improve our design.
              </li>
              <li>
                Preference cookies that remember options such as language or region.
              </li>
            </ul>
            <p className="pp_block_text">
              You can usually control cookies through your browser settings. If you disable certain cookies,
              some parts of the website may not work as intended.
            </p>
          </section>

          {/* 4. Sharing */}
          <section id="sharing" className="pp_block">
            <h2 className="pp_block_title">4. How we share your information</h2>
            <p className="pp_block_text">
              We do not sell your personal information. We may share it only in limited situations:[web:51]
            </p>
            <ul className="pp_list">
              <li>
                With trusted service providers (such as payment processors or booking platforms) who help us run our business.
              </li>
              <li>
                When required by law, regulation, or legal process.
              </li>
              <li>
                To protect the rights, property, or safety of our guests, team, or the public.
              </li>
            </ul>
            <p className="pp_block_text">
              When we share information with third parties, we require them to handle it securely and only for the purposes we specify.
            </p>
          </section>

          {/* 5. Security */}
          <section id="security" className="pp_block">
            <h2 className="pp_block_title">5. How we protect your data</h2>
            <p className="pp_block_text">
              We use technical and organisational measures designed to protect your information from
              unauthorised access, loss, or misuse.[web:52]
            </p>
            <ul className="pp_list">
              <li>Encrypted connections (HTTPS) on our website where appropriate.</li>
              <li>Restricted access to personal data for team members who need it.</li>
              <li>Regular checks and updates to our systems and processes.</li>
            </ul>
            <p className="pp_block_text">
              No method of transmission or storage is completely secure, but we aim to keep your data as safe as reasonably possible.
            </p>
          </section>

          {/* 6. Rights */}
          <section id="rights" className="pp_block">
            <h2 className="pp_block_title">6. Your choices and rights</h2>
            <p className="pp_block_text">
              Depending on your location and local laws, you may have certain rights regarding your personal information.[web:52]
            </p>
            <ul className="pp_list">
              <li>Access: You can request a copy of the personal data we hold about you.</li>
              <li>Correction: You can ask us to correct inaccurate or incomplete information.</li>
              <li>Deletion: You can ask us to delete certain information, subject to legal requirements.</li>
              <li>Objection: You can object to some types of processing, such as direct marketing.</li>
            </ul>
            <p className="pp_block_text">
              To exercise your rights, please contact us using the details in the “Contact us” section below.
              We may need to verify your identity before responding.
            </p>
          </section>

          {/* 7. Changes */}
          <section id="changes" className="pp_block">
            <h2 className="pp_block_title">7. Changes to this Privacy Policy</h2>
            <p className="pp_block_text">
              We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements.[web:52]
            </p>
            <p className="pp_block_text">
              When we make important changes, we will update the “Effective date” at the top of this page
              and, where appropriate, notify you through our website or by other means.
            </p>
          </section>

          {/* 8. Contact */}
          <section id="contact" className="pp_block">
            <h2 className="pp_block_title">8. Contact us</h2>
            <p className="pp_block_text">
              If you have any questions about this Privacy Policy or how we handle your data, you can contact us at:
            </p>
            <ul className="pp_list">
              <li>Email: privacy@example.com</li>
              <li>Phone: +91 00000 00000</li>
              <li>Address: Your Hotel Name, Street, City, Country</li>
            </ul>
          </section>

        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;