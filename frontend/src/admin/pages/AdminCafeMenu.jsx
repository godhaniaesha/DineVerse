import { useEffect, useMemo, useState } from "react";
import { MdOutlineClose } from "react-icons/md";


const ORDER_QUEUE_KEY = "admin-order-queue";

const MENU_CONFIG = {
  cafe: {
    title: "Cafe Menu",
    sub: "Manage cafe beverages, quick bites and signature desserts.",
    categories: ["All", "Coffee", "Tea", "Bakery", "Snacks", "Desserts"],
    items: [
      { id: 1, name: "Cappuccino", description: "Espresso, steamed milk and dense foam for all-day service.", price: 220, category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80", available: true, featured: true, prepTime: "5 min" },
      { id: 2, name: "Cold Brew Tonic", description: "Slow-steeped coffee finished with citrus tonic and orange peel.", price: 260, category: "Coffee", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=900&q=80", available: true, featured: false, prepTime: "4 min" },
      { id: 3, name: "Masala Chai Pot", description: "House-spiced tea served in a sharing kettle for two guests.", price: 180, category: "Tea", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&q=80", available: true, featured: false, prepTime: "6 min" },
      { id: 4, name: "Truffle Fries", description: "Crisp fries with parmesan dust and garlic aioli dip.", price: 320, category: "Snacks", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=900&q=80", available: true, featured: true, prepTime: "8 min" },
      { id: 5, name: "Butter Croissant", description: "Freshly baked laminated pastry finished with cultured butter.", price: 190, category: "Bakery", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80", available: false, featured: false, prepTime: "3 min" },
      { id: 6, name: "Hazelnut Tiramisu Jar", description: "Layered mascarpone cream, espresso sponge and hazelnut crunch.", price: 280, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80", available: true, featured: true, prepTime: "2 min" },
    ],
    notes: [
      "Coffee and bakery combos perform best during 8 AM to 11 AM.",
      "Featured desserts improve cafe upsell rate during evening bookings.",
    ],
  },
  restaurant: {
    title: "Restaurant Menu",
    sub: "Manage premium starters, mains and plated desserts in card format.",
    categories: ["All", "Starter", "Main Course", "Seafood", "Dessert", "Signature"],
    items: [
      { id: 1, name: "Burrata Garden Salad", description: "Heirloom tomatoes, basil oil and creamy burrata with sourdough crisp.", price: 540, category: "Starter", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80", available: true, featured: false, prepTime: "9 min" },
      { id: 2, name: "Smoked Truffle Pasta", description: "Fresh tagliatelle finished in truffle cream and aged parmesan.", price: 780, category: "Signature", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80", available: true, featured: true, prepTime: "14 min" },
      { id: 3, name: "Herb Crusted Salmon", description: "Pan-seared salmon with lemon beurre blanc and asparagus.", price: 920, category: "Seafood", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80", available: true, featured: true, prepTime: "16 min" },
      { id: 4, name: "Wild Mushroom Risotto", description: "Slow-cooked arborio rice with porcini, parmesan and herb oil.", price: 690, category: "Main Course", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80", available: true, featured: false, prepTime: "15 min" },
      { id: 5, name: "Lobster Bisque", description: "Velvety shellfish stock finished with cream and chive oil.", price: 610, category: "Starter", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80", available: false, featured: false, prepTime: "10 min" },
      { id: 6, name: "Chocolate Dome", description: "Dark chocolate shell with praline mousse and berry compote.", price: 360, category: "Dessert", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=900&q=80", available: true, featured: true, prepTime: "6 min" },
    ],
    notes: [
      "Signature mains drive the highest average bill value during dinner service.",
      "Seafood dishes need visibility for weekend pre-booking and waiter recommendations.",
    ],
  },
  bar: {
    title: "Bar Menu",
    sub: "Manage bar classics, premium pours and mocktail specials.",
    categories: ["All", "Cocktail", "Mocktail", "Wine", "Beer", "Premium Pour"],
    items: [
      { id: 1, name: "Smoked Old Fashioned", description: "Bourbon, bitters and orange oils with oak smoke finish.", price: 680, category: "Cocktail", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80", available: true, featured: true, prepTime: "5 min" },
      { id: 2, name: "Berry Basil Spritz", description: "Fresh berry puree, basil syrup and sparkling tonic.", price: 340, category: "Mocktail", image: "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?w=900&q=80", available: true, featured: false, prepTime: "4 min" },
      { id: 3, name: "Reserve Merlot Glass", description: "Full-bodied red pour with cherry and vanilla notes.", price: 520, category: "Wine", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80", available: true, featured: false, prepTime: "2 min" },
      { id: 4, name: "Belgian Wheat", description: "Crisp, citrus-forward wheat beer on tap.", price: 280, category: "Beer", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=900&q=80", available: true, featured: false, prepTime: "2 min" },
    ],
    notes: [
      "Cocktails perform best after 7 PM and pair well with bar snacks.",
      "Premium pours should stay highlighted for upsell during lounge seating.",
    ],
  },
};

export default function AdminCafeMenu({ title, sub, variant = "cafe" }) {
  const config = MENU_CONFIG[variant] ?? MENU_CONFIG.cafe;
  const storageKey = `admin-${variant}-draft-order`;
  const targetLabel = variant === "bar" ? "Seat / Tab" : "Table";
  const submitLabel = variant === "bar" ? "Send to Bar Queue" : "Send to Kitchen Queue";
  const adminRole = localStorage.getItem("adminRole") || "Super Admin";
  const adminName = localStorage.getItem("adminName") || adminRole;
  const isOrderingRole = ["Waiter", "Cafe Waiter", "Restaurant Waiter", "Bar Waiter", "Bartender"].includes(adminRole);
  const [items, setItems] = useState(config.items);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [lineQuantities, setLineQuantities] = useState({});
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [orderDraft, setOrderDraft] = useState(() => {
    const savedDraft = localStorage.getItem(storageKey);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (error) {
        localStorage.removeItem(storageKey);
      }
    }

    return { customerName: "", target: "", note: "", items: [] };
  });

  const filteredItems = useMemo(() => (
    items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const haystack = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      const matchesSearch = haystack.includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    })
  ), [activeCategory, items, search]);

  const availableCount = items.filter((item) => item.available).length;
  const featuredCount = items.filter((item) => item.featured).length;
  const averagePrice = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length)
    : 0;
  const totalSelectedItems = orderDraft.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = orderDraft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(orderDraft));
  }, [orderDraft, storageKey]);

  const toggleAvailability = (id) => {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, available: !item.available } : item
    )));
  };

  const toggleFeatured = (id) => {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, featured: !item.featured } : item
    )));
  };

  const updateLineQuantity = (id, nextValue) => {
    setLineQuantities((current) => ({
      ...current,
      [id]: Math.max(1, nextValue),
    }));
  };

  const addToOrder = (item) => {
    if (!item.available) {
      return;
    }

    const quantity = Math.max(1, lineQuantities[item.id] ?? 1);
    setOrderDraft((current) => {
      const existing = current.items.find((entry) => entry.id === item.id);
      if (existing) {
        return {
          ...current,
          items: current.items.map((entry) => (
            entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry
          )),
        };
      }

      return {
        ...current,
        items: [...current.items, { id: item.id, name: item.name, price: item.price, quantity }],
      };
    });
  };

  const changeDraftQuantity = (id, delta) => {
    setOrderDraft((current) => ({
      ...current,
      items: current.items.map((item) => (
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )),
    }));
  };

  const removeFromDraft = (id) => {
    setOrderDraft((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  };

  const clearDraft = () => {
    setOrderDraft({ customerName: "", target: "", note: "", items: [] });
  };

  const placeOrder = () => {
    if (!orderDraft.items.length) {
      return;
    }

    const nextOrderId = `${variant.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const chefByVariant = {
      cafe: "Cafe Chef 1",
      restaurant: "Restaurant Chef 1",
      bar: "Bar Chef 1",
    };
    const queuedOrder = {
      id: nextOrderId,
      table: orderDraft.target || "-",
      customer: orderDraft.customerName.trim() || "Walk-in",
      items: orderDraft.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
      chef: chefByVariant[variant] ?? "Kitchen Team",
      waiter: adminName,
      status: "New Order",
      area: variant,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      note: orderDraft.note.trim() || "-",
      total: orderTotal,
    };
    const savedOrders = localStorage.getItem(ORDER_QUEUE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify([queuedOrder, ...parsedOrders]));
    setLastSubmitted({
      orderId: nextOrderId,
      itemCount: totalSelectedItems,
      total: orderTotal,
      target: orderDraft.target || "-",
    });
    setOrderDraft({ customerName: "", target: "", note: "", items: [] });
  };

  return (
    <div className="ad_page">
      <h2 className="ad_h2">{title ?? config.title}</h2>
      <p className="ad_p">{sub ?? config.sub}</p>

      <div className="ad_cards_grid" style={{ marginTop: 16 }}>
        <article className="ad_card">
          <div className="ad_card__label">Total items</div>
          <div className="ad_card__value">{items.length}</div>
          <div className="ad_card__meta">Live menu catalog</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Available now</div>
          <div className="ad_card__value">{availableCount}</div>
          <div className="ad_card__meta">Visible to staff</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Featured picks</div>
          <div className="ad_card__value">{featuredCount}</div>
          <div className="ad_card__meta">Priority recommendations</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Average price</div>
          <div className="ad_card__value">₹{averagePrice}</div>
          <div className="ad_card__meta">Current menu average</div>
        </article>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Browse Categories</h3>
        <p className="ad_p" style={{ marginBottom: 0 }}>
          {
            isOrderingRole
              ? "Waiter flow: Set the quantity, click 'Add to Order', and the selected dishes will appear in the 'Current Waiter Order' on the right side."
              : "Admin flow: Browse the menu using categories or filters and manage items."
          }
        </p>
        <div className="ad_form_grid" style={{ marginTop: 12 }}>
          <input
            className="ad_input"
            placeholder="Search dish, drink or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="ad_scroll_cat" style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {config.categories.map((category) => (
            <button
              key={category}
              className={`ad_btn${activeCategory === category ? " ad_btn--primary" : ""}`}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: 16,
          }}
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="ad_card"
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="ad_gallery_img"
                style={{ height: 180, marginBottom: 0, borderRadius: 0 }}
              />
              <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div>
                    <div className="ad_card__label">{item.category}</div>
                    <h3 className="ad_card__title" style={{ marginBottom: 4 }}>{item.name}</h3>
                  </div>
                  <span className="ad_chip">₹{item.price}</span>
                </div>

                <p className="ad_p" style={{ marginBottom: 0, fontSize: 14 }}>{item.description}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="ad_chip">{item.available ? "Available" : "Hidden"}</span>
                  <span className="ad_chip">{item.prepTime}</span>
                  {item.featured && <span className="ad_chip">Featured</span>}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <button className="ad_btn" type="button" onClick={() => updateLineQuantity(item.id, (lineQuantities[item.id] ?? 1) - 1)}>
                    -
                  </button>
                  <span className="ad_chip">Qty {lineQuantities[item.id] ?? 1}</span>
                  <button className="ad_btn" type="button" onClick={() => updateLineQuantity(item.id, (lineQuantities[item.id] ?? 1) + 1)}>
                    +
                  </button>
                </div>

                <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {!isOrderingRole && (
                    <button className="ad_btn ad_btn--primary" type="button" onClick={() => toggleFeatured(item.id)}>
                      {item.featured ? "Remove Featured" : "Make Featured"}
                    </button>
                  )}
                  {!isOrderingRole && (
                    <button className="ad_btn" type="button" onClick={() => toggleAvailability(item.id)}>
                      {item.available ? "Hide Item" : "Show Item"}
                    </button>
                  )}
                  <button className="ad_btn" type="button" onClick={() => addToOrder(item)} disabled={!item.available}>
                    Add to Order
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="ad_two_col" style={{ marginTop: 16, alignItems: "start" }}>
        <section className="ad_card">
          <h3 className="ad_card__title">Current Waiter Order</h3>
          <div className="ad_p" style={{ marginBottom: 0 }}>
            When you press "Add to Order", the selected item will be added to this section. Then you can enter the customer name, {targetLabel.toLowerCase()}, and notes, and send it directly to the queue.
          </div>
          <div className="ad_form_grid" style={{ marginTop: 12 }}>
            <input
              className="ad_input"
              placeholder="Customer name"
              value={orderDraft.customerName}
              onChange={(event) => setOrderDraft((current) => ({ ...current, customerName: event.target.value }))}
            />
            <input
              className="ad_input"
              placeholder={targetLabel}
              value={orderDraft.target}
              onChange={(event) => setOrderDraft((current) => ({ ...current, target: event.target.value }))}
            />
          </div>
          <div className="rooms__form_row" style={{ marginTop: 12 }}>
            <textarea
              className="ad_input"
              placeholder="Special instructions"
              value={orderDraft.note}
              onChange={(event) => setOrderDraft((current) => ({ ...current, note: event.target.value }))}
              style={{ minHeight: 96, resize: "vertical" }}
            />
          </div>

          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="ad_chip">{totalSelectedItems} items selected</span>
            <span className="ad_chip">₹{orderTotal.toLocaleString("en-IN")} total</span>
          </div>

          {lastSubmitted && (
            <div className="ad_p" style={{ marginTop: 12, marginBottom: 0 }}>
              {lastSubmitted.orderId} queued for {lastSubmitted.target} with {lastSubmitted.itemCount} items totaling ₹{lastSubmitted.total.toLocaleString("en-IN")}.
            </div>
          )}

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button className="ad_btn ad_btn--primary" type="button" onClick={placeOrder} disabled={!orderDraft.items.length}>
              {submitLabel}
            </button>
            <button className="ad_btn" type="button" onClick={clearDraft} disabled={!orderDraft.items.length && !orderDraft.customerName && !orderDraft.target && !orderDraft.note}>
              Clear Draft
            </button>
          </div>
        </section>

        <section className="ad_card">
          <h3 className="ad_card__title">Selected Dishes</h3>
          <div className="ad_p" style={{ marginBottom: 12 }}>
            This list is your live basket. You can increase/decrease quantity using +/− and also remove items.
          </div>
          {orderDraft.items.length ? (
            <ul className="ad_list ad_custom-scroll" style={{ maxHeight: "220px", overflowY: "auto" }}>
              {orderDraft.items.map((item) => (
                <li key={item.id} className="ad_list__item" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--ad-text-1)" }}>{item.name}</div>
                    <div className="ad_card__meta">₹{item.price.toLocaleString("en-IN")} each</div>
                    <div className="ad_card__meta">Line total ₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button className="ad_btn" type="button" onClick={() => changeDraftQuantity(item.id, -1)}>-</button>
                    <span className="ad_chip">Qty {item.quantity}</span>
                    <button className="ad_btn" type="button" onClick={() => changeDraftQuantity(item.id, 1)}>+</button>
                    <button className="ad_btn ad_btn--danger" type="button" onClick={() => removeFromDraft(item.id)}><MdOutlineClose />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ad_p" style={{ marginBottom: 0, textAlign: "center" }}>

              <svg
                width="120"
                height="120"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: "10px", opacity: 0.7 }}
              >
                {/* Plate */}
                <circle cx="32" cy="32" r="20" stroke="#999" strokeWidth="2" />
                <circle cx="32" cy="32" r="12" stroke="#ccc" strokeWidth="2" />

                {/* Fork */}
                <path
                  d="M18 10V26M15 10V18M21 10V18"
                  stroke="#888"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Spoon */}
                <path
                  d="M46 10C44 10 42 12 42 14C42 16 44 18 46 18C48 18 50 16 50 14C50 12 48 10 46 10Z"
                  stroke="#888"
                  strokeWidth="2"
                />
                <line
                  x1="46" y1="18" x2="46" y2="28"
                  stroke="#888"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <p style={{ margin: 0 }}>
                No dishes selected. Please select your dish from the menu and click <b>"Add to Order"</b>.
              </p>

            </div>
          )}
        </section>
      </div>
    </div>
  );
}
