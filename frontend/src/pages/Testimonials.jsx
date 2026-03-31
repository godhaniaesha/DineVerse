import { useState } from "react";
import { MdStar, MdStarBorder } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import "./testimonials.css";

const REVIEWS = [
  {
    id: 1,
    name: "Isabella Monroe",
    meta: "Visited · March 2025",
    platform: "Google",
    category: "Fine Dining",
    rating: 5,
    text: "Lumière is the most extraordinary dining experience I've had in years. The truffle risotto was poetry on a plate, and the sommelier perfectly paired every course. We'll be back for our anniversary.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 2,
    name: "James Whitfield",
    meta: "Stayed 3 Nights · Feb 2025",
    platform: "Tripadvisor",
    category: "Rooms & Bar",
    rating: 5,
    text: "The Grand Suite was beyond anything I expected. Floor-to-ceiling views, a perfectly stocked minibar, and the bar downstairs mixed the best Negroni I've ever tasted. Pure luxury.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
  {
    id: 3,
    name: "Priya Sharma",
    meta: "Visited · January 2025",
    platform: "Google",
    category: "Café",
    rating: 5,
    text: "The cardamom latte stopped me mid-sip. Rich, aromatic, perfectly balanced. The pastry selection rivals anything I've had in Paris. I now come every Sunday morning.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  },
  {
    id: 4,
    name: "Thomas Beaumont",
    meta: "Private Event · Dec 2024",
    platform: "Yelp",
    category: "Events",
    rating: 5,
    text: "We held our company dinner here for 40 guests — the private dining experience was seamless. The food arrived flawlessly timed and the staff remembered every dietary requirement without being asked twice.",
    avatar: null,
  },
  {
    id: 5,
    name: "Sofia Andersson",
    meta: "Visited · March 2025",
    platform: "Google",
    category: "Restaurant",
    rating: 5,
    text: "Sea bass en papillote — I'm still dreaming about it. Every dish was a conversation between flavour and finesse. The atmosphere is intimate without feeling stuffy. Extraordinary.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: 6,
    name: "Ravi Mehta",
    meta: "Visited · Feb 2025",
    platform: "Tripadvisor",
    category: "Bar",
    rating: 4,
    text: "The cocktail list is genuinely inspired — the Yuzu Paper Plane became my new favourite drink instantly. Great jazz playlist, beautiful lighting. The kind of bar you want to linger in all evening.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
];

const PLATFORMS = [
  { name: "Google",      score: "4.9", pct: 98 },
  { name: "Tripadvisor", score: "4.8", pct: 96 },
  { name: "Yelp",        score: "4.7", pct: 94 },
];

const PER_PAGE = 3;

function StarRow({ rating, max = 5 }) {
  return (
    <div className="d_testi_card__stars">
      {Array.from({ length: max }).map((_, i) =>
        i < rating
          ? <MdStar key={i} className="d_testi_card__star" />
          : <MdStarBorder key={i} className="d_testi_card__star d_testi_card__star--empty" />
      )}
    </div>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(REVIEWS.length / PER_PAGE);
  const visible = REVIEWS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="d_testi_section">
      <div className="d_wrapper">

        {/* Header */}
        <div className="d_testi_header">
          <p className="d_testi_header__eyebrow">
            <span className="d_testi_header__eyebrow-line" />
            Guest Stories
            <span className="d_testi_header__eyebrow-line" />
          </p>
          <h2 className="d_testi_header__title">
            Words from Our <em>Valued Guests</em>
          </h2>
          <p className="d_testi_header__sub">
            Over 1,200 reviews across Google, Tripadvisor & Yelp — and counting.
          </p>
        </div>

        {/* Aggregate score */}
        <div className="d_testi_score">
          <div className="d_testi_score__main">
            <span className="d_testi_score__num">4.9</span>
            <div className="d_testi_score__stars">
              {[1,2,3,4,5].map(i => <MdStar key={i} />)}
            </div>
            <span className="d_testi_score__count">1,240+ Reviews</span>
          </div>
          <div className="d_testi_score__divider" />
          <div className="d_testi_score__platforms">
            {PLATFORMS.map(p => (
              <div key={p.name} className="d_testi_score__platform">
                <span className="d_testi_score__platform-name">{p.name}</span>
                <div className="d_testi_score__bar-track">
                  <div className="d_testi_score__bar-fill" style={{ width: `${p.pct}%` }} />
                </div>
                <span className="d_testi_score__platform-val">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="d_testi_slider">
          <div className="d_testi_track">
            {visible.map(r => (
              <div key={r.id} className="d_testi_card">
                <span className="d_testi_card__quote-mark">"</span>
                <StarRow rating={r.rating} />
                <p className="d_testi_card__text">"{r.text}"</p>
                <span className="d_testi_card__tag">
                  <HiSparkles style={{ fontSize: 8 }} />
                  {r.category}
                </span>
                <div className="d_testi_card__author">
                  {r.avatar
                    ? <img src={r.avatar} alt={r.name} className="d_testi_card__avatar" />
                    : <div className="d_testi_card__avatar-fallback">{r.name[0]}</div>
                  }
                  <div className="d_testi_card__info">
                    <span className="d_testi_card__name">{r.name}</span>
                    <span className="d_testi_card__meta">{r.meta}</span>
                  </div>
                  <span className="d_testi_card__platform">{r.platform}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="d_testi_dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                className={`d_testi_dot${i === page ? " d_testi_dot--active" : ""}`}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}