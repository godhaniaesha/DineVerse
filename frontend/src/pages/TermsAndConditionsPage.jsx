import React from 'react';
import '../style/TermsAndConditionsPage.css';

const TermsAndConditionsPage = () => {
  return (
    <main className="tc_page">
      {/* HERO / INTRO */}
      <section className="tc_hero">
        <div className="tc_container">
          <span className="tc_eyebrow">Legal & Use</span>
          <h1 className="tc_title">Terms & Conditions</h1>
          <p className="tc_intro">
            These Terms & Conditions explain the rules for using our website and services.
            By accessing or using this site, you agree to these terms.
          </p>
          <p className="tc_effective">Effective date: 01 April 2026</p>
        </div>
      </section>


      {/* CONTENT */}
      <section className="tc_content">
        <div className="tc_container">
          {/* 1. Acceptance */}
          <section id="acceptance" className="tc_block">
            <h2 className="tc_block_title">1. Acceptance of terms</h2>
            <p className="tc_block_text">
              By accessing or using our website, making a reservation, or staying with us, you agree
              to be bound by these Terms & Conditions and any additional terms referenced here.[web:65]
            </p>
            <p className="tc_block_text">
              If you do not agree with these terms, you should not use this website or proceed with a booking.
              We recommend reviewing this page regularly as the terms may change over time.
            </p>
          </section>

          {/* 2. Reservations & bookings */}
          <section id="bookings" className="tc_block">
            <h2 className="tc_block_title">2. Reservations and bookings</h2>
            <p className="tc_block_text">
              When you make a reservation, you confirm that all information provided is accurate,
              complete, and up to date.[web:61]
            </p>
            <ul className="tc_list">
              <li>All bookings are subject to availability and our confirmation.</li>
              <li>
                Certain rates, offers, or packages may have additional conditions that will be shown at the time of booking.
              </li>
              <li>
                We reserve the right to refuse or cancel any reservation that appears fraudulent or incomplete.
              </li>
            </ul>
          </section>

          {/* 3. Prices & payments */}
          <section id="payments" className="tc_block">
            <h2 className="tc_block_title">3. Prices and payments</h2>
            <p className="tc_block_text">
              All prices shown on our website are displayed in the currency indicated and are subject to change
              until your booking is confirmed.[web:61]
            </p>
            <ul className="tc_list">
              <li>
                Taxes, service charges, or local fees may be added to the displayed price where applicable.
              </li>
              <li>
                Payment methods accepted will be shown during the booking process. Some rates may require
                full or partial prepayment.
              </li>
              <li>
                If payment is declined or cannot be completed, we may cancel your reservation.
              </li>
            </ul>
          </section>

          {/* 4. Cancellations */}
          <section id="cancellations" className="tc_block">
            <h2 className="tc_block_title">4. Cancellations, no-shows, and changes</h2>
            <p className="tc_block_text">
              Our cancellation and modification rules depend on the rate or package you select at the
              time of booking.[web:61]
            </p>
            <ul className="tc_list">
              <li>
                Flexible rates may allow free cancellation or changes up to a specified time before arrival.
              </li>
              <li>
                Non-refundable or advance purchase rates may not permit cancellations, changes, or refunds.
              </li>
              <li>
                No-shows may result in a fee up to the total cost of the stay booked.
              </li>
            </ul>
            <p className="tc_block_text">
              Please review the specific conditions attached to your chosen rate carefully before confirming.
            </p>
          </section>

          {/* 5. Guest conduct */}
          <section id="conduct" className="tc_block">
            <h2 className="tc_block_title">5. Guest conduct and use of services</h2>
            <p className="tc_block_text">
              We aim to provide a calm and respectful environment for all guests. You agree to use our
              property and services in a responsible manner at all times.[web:61]
            </p>
            <ul className="tc_list">
              <li>
                You must follow all house rules, safety instructions, and lawful requests from our team.
              </li>
              <li>
                Any behaviour that causes damage, disturbance, or risk to others may result in immediate
                termination of your stay, without refund.
              </li>
              <li>
                You are responsible for any damage caused to rooms, facilities, or property during your stay.
              </li>
            </ul>
          </section>

          {/* 6. Intellectual property */}
          <section id="ip" className="tc_block">
            <h2 className="tc_block_title">6. Website content and intellectual property</h2>
            <p className="tc_block_text">
              All content on this website, including text, images, graphics, logos, and layouts, is owned by us
              or used under licence.[web:62]
            </p>
            <ul className="tc_list">
              <li>
                You may view and print pages from this site for personal, non-commercial use only.
              </li>
              <li>
                You may not copy, modify, distribute, or use our content for any commercial purpose without
                prior written permission.
              </li>
              <li>
                Trademarks, service marks, and logos displayed on the site remain the property of their
                respective owners.
              </li>
            </ul>
          </section>

          {/* 7. Liability */}
          <section id="liability" className="tc_block">
            <h2 className="tc_block_title">7. Disclaimer and limitation of liability</h2>
            <p className="tc_block_text">
              We aim to keep all information on this website accurate and up to date, but it is provided
              “as is” without any guarantees.[web:62]
            </p>
            <ul className="tc_list">
              <li>
                We are not responsible for minor errors, temporary unavailability, or inaccuracies that may appear.
              </li>
              <li>
                To the fullest extent permitted by law, we are not liable for any indirect, incidental, or
                consequential damages arising from your use of this website or services.
              </li>
              <li>
                Nothing in these terms excludes liability where it cannot be limited under applicable law.
              </li>
            </ul>
          </section>

          {/* 8. Governing law */}
          <section id="law" className="tc_block">
            <h2 className="tc_block_title">8. Governing law and disputes</h2>
            <p className="tc_block_text">
              These Terms & Conditions are governed by the laws that apply in the jurisdiction where our
              property is located, without regard to conflict of law rules.[web:65]
            </p>
            <p className="tc_block_text">
              Any disputes arising out of or relating to these terms, your booking, or your stay may be
              subject to the exclusive jurisdiction of the local courts, unless mandatory law provides otherwise.
            </p>
          </section>

          {/* 9. Changes */}
          <section id="changes" className="tc_block">
            <h2 className="tc_block_title">9. Changes to these Terms & Conditions</h2>
            <p className="tc_block_text">
              We may update these Terms & Conditions from time to time to reflect changes in our services,
              website, or legal requirements.[web:65]
            </p>
            <p className="tc_block_text">
              Any changes will take effect when posted on this page. Your continued use of the website
              after changes are published means you accept the updated terms.
            </p>
          </section>

          {/* 10. Contact */}
          <section id="contact" className="tc_block">
            <h2 className="tc_block_title">10. Contact us</h2>
            <p className="tc_block_text">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <ul className="tc_list">
              <li>Email: legal@example.com</li>
              <li>Phone: +91 00000 00000</li>
              <li>Address: Your Hotel Name, Street, City, Country</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditionsPage;