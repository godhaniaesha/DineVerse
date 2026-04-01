import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/DishDetailsPage.css';

const DISHES = [
  {
    id: '1',
    name: 'Truffle Risotto',
    category: 'Main Course',
    price: '₹1,450',
    badge: 'Chef’s signature',
    image:
      'https://images.pexels.com/photos/3298180/pexels-photo-3298180.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc:
      'Creamy arborio rice finished with shaved black truffle and aged parmesan.',
    description:
      'Slow-cooked arborio rice, layered with house vegetable stock, mascarpone, and aged parmesan, then finished with hand-shaved black truffle and a drizzle of truffle oil for depth and aroma.',
    serves: '1 guest',
    prepTime: '25–30 min',
    spiceLevel: 'Mild',
    chefNote:
      'We recommend enjoying this risotto as soon as it reaches your table for the ideal texture.',
    ingredients: [
      'Arborio rice',
      'Black truffle',
      'Parmesan',
      'Mascarpone',
      'White wine',
      'Vegetable stock',
      'Fresh herbs',
    ],
    allergens: ['Milk / Dairy'],
    bestPairedWith: ['Old-world Chardonnay', 'Sparkling water'],
  },
  {
    id: '2',
    name: 'Charred Sea Bass',
    category: 'Main Course',
    price: '₹1,850',
    badge: 'Limited availability',
    image:
      'https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc:
      'Pan-roasted sea bass with smoked butter sauce and citrus fennel salad.',
    description:
      'Line-caught sea bass pan-roasted and kissed by charcoal, served with a smoked butter jus, charred lemon, and a refreshing fennel–citrus salad to balance richness.',
    serves: '1 guest',
    prepTime: '20–25 min',
    spiceLevel: 'Medium',
    chefNote:
      'Best enjoyed medium-well; please let us know if you prefer a different doneness.',
    ingredients: [
      'Sea bass',
      'Smoked butter',
      'Fennel',
      'Citrus',
      'Charcoal oil',
      'Fresh herbs',
    ],
    allergens: ['Fish', 'Milk / Dairy'],
    bestPairedWith: ['Dry Riesling', 'Citrus spritz'],
  },
];

const DishDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dish = DISHES.find((d) => d.id === id);

  if (!dish) {
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
// inside DishDetailsPage component
const handleAddToReservation = () => {
  navigate('/reservation-review', {
    state: {
      dish: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        shortDesc: dish.shortDesc,
        category: dish.category,
      },
    },
  });
};
  return (
    <main className="dd_page">
      <section className="dd_shell">
        <div className="dd_container">
          <button className="dd_back_link" onClick={() => navigate(-1)}>
            ← Back to menu
          </button>

          <article className="dd_card">
            {/* IMAGE */}
            <div className="dd_media">
              <div className="dd_media_inner">
                <img src={dish.image} alt={dish.name} className="dd_image" />
                {dish.badge && <span className="dd_badge">{dish.badge}</span>}
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="dd_body">
              <span className="dd_category">{dish.category}</span>
              <h1 className="dd_title">{dish.name}</h1>
              <p className="dd_short">{dish.shortDesc}</p>

              <div className="dd_meta_row">
                <div className="dd_meta_item">
                  <span className="dd_meta_label">Price</span>
                  <span className="dd_meta_value dd_price">{dish.price}</span>
                </div>
                <div className="dd_meta_item">
                  <span className="dd_meta_label">Serving</span>
                  <span className="dd_meta_value">{dish.serves}</span>
                </div>
                <div className="dd_meta_item">
                  <span className="dd_meta_label">Prep time</span>
                  <span className="dd_meta_value">{dish.prepTime}</span>
                </div>
                <div className="dd_meta_item">
                  <span className="dd_meta_label">Spice</span>
                  <span className="dd_meta_value">{dish.spiceLevel}</span>
                </div>
              </div>

              <p className="dd_description">{dish.description}</p>

              {dish.chefNote && (
                <div className="dd_chef_note">
                  <span className="dd_chef_label">Chef&apos;s note</span>
                  <p className="dd_chef_text">{dish.chefNote}</p>
                </div>
              )}

              <div className="dd_grid">
                <div>
                  <h2 className="dd_subtitle">Ingredients</h2>
                  <ul className="dd_tag_list">
                    {dish.ingredients.map((item) => (
                      <li className="dd_tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="dd_subtitle">Allergens</h2>
                  <ul className="dd_tag_list">
                    {dish.allergens.map((item) => (
                      <li className="dd_tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {dish.bestPairedWith?.length > 0 && (
                    <>
                      <h2 className="dd_subtitle dd_subtitle_mt">Best enjoyed with</h2>
                      <ul className="dd_tag_list dd_tag_list--wrap">
                        {dish.bestPairedWith.map((item) => (
                          <li className="dd_tag" key={item}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <div className="dd_actions">
  <button className="dd_primary_btn" onClick={handleAddToReservation}>
    Add to reservation
  </button>
  <button className="dd_ghost_btn">Ask for variations</button>
</div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default DishDetailsPage;