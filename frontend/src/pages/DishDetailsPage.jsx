import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/DishDetailsPage.css';
import { MENU_ITEMS, BADGE_META } from './Menu';

const DishDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find dish from MENU_ITEMS. Handle both string and number ID comparison.
  const foundItem = MENU_ITEMS.find((d) => d.id.toString() === id);

  if (!foundItem) {
    return (
      <main className="dd_page">
        <section className="dd_container dd_not_found">
          <p>We couldn&apos;t find this dish. It may have been updated or removed.</p>
          <button className="dd_back_btn" onClick={() => navigate(-1)}>
            Go back
          </button>
        </section>
      </main>
    );
  }

  // Map MENU_ITEMS structure to the expected dish structure
  const dish = {
    ...foundItem,
    image: foundItem.img,
    description: foundItem.desc,
    shortDesc: foundItem.tag || foundItem.category,
    serves: foundItem.serves || '1 guest',
    prepTime: foundItem.time || '20 min',
    spiceLevel: foundItem.badges?.includes('spicy') ? 'Spicy' : 'Mild',
    chefNote: foundItem.chefNote || 'Chef’s special preparation for the evening.',
    ingredients: foundItem.ingredients || ['Fresh ingredients', 'House-made sauce', 'Organic herbs'],
    allergens: foundItem.allergens || (foundItem.badges?.includes('veg') ? ['None'] : ['Check with server']),
    bestPairedWith: foundItem.bestPairedWith || ['House White Wine', 'Sparkling Water'],
    badge: foundItem.badges?.[0] ? BADGE_META[foundItem.badges[0]]?.label : null
   };
 
   return (
     <main className="dd_page">
      <div className="dd_canvas">
        {/* Navigation */}
        <nav className="dd_nav">
          <button className="dd_back_link" onClick={() => navigate(-1)}>
            <span className="dd_arrow">←</span> Return to Selection
          </button>
        </nav>

        <div className="dd_grid_layout">
          {/* Hero Media Section */}
          <section className="dd_hero">
            <div className="dd_media_frame">
              <img src={dish.image} alt={dish.name} className="dd_hero_img" />
              {dish.badge && <div className="dd_hero_badge">{dish.badge}</div>}
              <div className="dd_img_overlay"></div>
            </div>
          </section>

          {/* Detailed Info Section */}
          <section className="dd_info_panel">
            <header className="dd_header">
              <span className="dd_pre_title">{dish.category}</span>
              <h1 className="dd_main_title">{dish.name}</h1>
              <div className="dd_price_tag">{dish.price}</div>
            </header>

            <div className="dd_divider_ornament">
              <span className="dd_line"></span>
              <span className="dd_dot"></span>
              <span className="dd_line"></span>
            </div>

            <div className="dd_description_block">
              <p className="dd_intro">{dish.shortDesc}</p>
              <p className="dd_full_desc">{dish.description}</p>
            </div>

            <div className="dd_meta_grid">
              <div className="dd_meta_box">
                <span className="dd_meta_key">Portion</span>
                <span className="dd_meta_val">{dish.serves}</span>
              </div>
              <div className="dd_meta_box">
                <span className="dd_meta_key">Duration</span>
                <span className="dd_meta_val">{dish.prepTime}</span>
              </div>
              <div className="dd_meta_box">
                <span className="dd_meta_key">Intensity</span>
                <span className="dd_meta_val">{dish.spiceLevel}</span>
              </div>
            </div>

            {dish.chefNote && (
              <blockquote className="dd_chef_quote">
                <span className="dd_quote_icon">“</span>
                <p className="dd_quote_text">{dish.chefNote}</p>
                <cite className="dd_quote_author">— Executive Chef</cite>
              </blockquote>
            )}

            <div className="dd_details_columns">
              <div className="dd_column">
                <h3 className="dd_column_title">Composition</h3>
                <ul className="dd_classic_list">
                  {dish.ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="dd_column">
                <h3 className="dd_column_title">Affinities</h3>
                <ul className="dd_classic_list">
                  {dish.allergens.map((item) => (
                    <li key={item} className="dd_allergen">
                      {item}
                    </li>
                  ))}
                </ul>
                {dish.bestPairedWith?.length > 0 && (
                  <div className="dd_pairing_section">
                    <h3 className="dd_column_title">Accompaniment</h3>
                    <ul className="dd_classic_list">
                      {dish.bestPairedWith.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* <footer className="dd_actions">
              <button className="dd_order_btn">Experience this dish</button>
            </footer> */}
          </section>
        </div>
      </div>
    </main>
  );
};

export default DishDetailsPage;