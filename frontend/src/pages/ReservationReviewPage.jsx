import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/ReservationReviewPage.css';

const ReservationReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dish = location.state?.dish;

  if (!dish) {
    return (
      <main className="rr_page">
        <section className="rr_container rr_empty">
          <p>No dish selected for reservation.</p>
          <button className="rr_btn_outline" onClick={() => navigate('/menu')}>
            Go to menu
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="rr_page">
      <section className="rr_shell">
        <div className="rr_container">
          <button className="rr_back_link" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="rr_card">
            <header className="rr_header">
              <span className="rr_eyebrow">Reservation</span>
              <h1 className="rr_title">Review your selection</h1>
              <p className="rr_subtitle">
                Confirm this dish for your visit. You can share final date and time with our team in the next step.
              </p>
            </header>

            <div className="rr_body">
              <div className="rr_row">
                <span className="rr_label">Dish</span>
                <div className="rr_value_col">
                  <span className="rr_value_main">{dish.name}</span>
                  <span className="rr_value_sub">{dish.shortDesc}</span>
                </div>
              </div>

              <div className="rr_row">
                <span className="rr_label">Category</span>
                <span className="rr_value">{dish.category}</span>
              </div>

              <div className="rr_row">
                <span className="rr_label">Guests</span>
                <div className="rr_guest_control">
                  <button type="button" className="rr_guest_btn" disabled>
                    -
                  </button>
                  <span className="rr_guest_count">1</span>
                  <button type="button" className="rr_guest_btn" disabled>
                    +
                  </button>
                </div>
              </div>

              <div className="rr_row rr_row_total">
                <span className="rr_label">Estimated total</span>
                <span className="rr_value rr_value_price">{dish.price}</span>
              </div>
            </div>

            <footer className="rr_footer">
              <button
                className="rr_btn_primary"
                onClick={() => navigate('/contact')}
              >
                Confirm and share visit details
              </button>
              <button
                className="rr_btn_outline"
                onClick={() => navigate('/menu')}
              >
                Add another dish
              </button>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReservationReviewPage;