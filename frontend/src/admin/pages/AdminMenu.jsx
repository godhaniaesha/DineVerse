import { useState } from "react";

const DEFAULT_CUISINES = ["Italian", "Chinese", "Indian", "French", "Modern" ];
const INITIAL_ITEMS = [
  { id: 1, name: "Truffle Pasta", cuisine: "Italian", category: "Main Course", price: 680, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", available: true },
  { id: 2, name: "Mushroom Soup", cuisine: "French", category: "Starter", price: 320, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80", available: true },
  { id: 3, name: "Chocolate Dome", cuisine: "French", category: "Dessert", price: 290, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80", available: false },
  { id: 4, name: "Citrus Cooler", cuisine: "Indian", category: "Beverage", price: 220, image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80", available: true },
];

const EMPTY_FORM = { name: "", cuisine: "Italian", category: "Starter", price: "", image: "" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;
function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head"><span className="rooms__modal_title">{title}</span><button className="rooms__modal_close" onClick={onClose}>x</button></div>
        {children}
      </div>
    </>
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [modal, setModal] = useState(null);
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveItem = () => {
    if (!form.name.trim() || !form.price || !form.image.trim()) return;
    const next = {
      id: modal?.item?.id ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      available: true,
    };
    if (modal?.mode === "edit") setItems((current) => current.map((item) => (item.id === modal.item.id ? { ...next, available: item.available } : item)));
    else setItems((current) => [next, ...current]);
    setForm(EMPTY_FORM);
    setModal(null);
  };
  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ ...item, price: String(item.price) }); setModal({ mode: "edit", item }); };
  const close = () => setModal(null);

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const toggleAvailability = (id) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const availableCount = items.filter((item) => item.available).length;
  const hiddenCount = items.length - availableCount;
  const avgPrice = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length)
    : 0;

  const filteredItems = items.filter((item) => {
    const byCuisine = filterCuisine === "All" || item.cuisine === filterCuisine;
    const byCategory = filterCategory === "All" || item.category === filterCategory;
    return byCuisine && byCategory;
  });

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Menu Items</h2>
      <p className="ad_p">Create, update availability, and remove dishes from the catalog.</p>

      <div className="ad_row_actions" style={{ margin: "10px 0" }}>
        <select value={filterCuisine} onChange={(e) => setFilterCuisine(e.target.value)} className="ad_select" style={{ marginRight: 8 }}>
          <option value="All">All Cuisines</option>
          {DEFAULT_CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="ad_select">
          <option value="All">All Categories</option>
          {Array.from(new Set(items.map((item) => item.category))).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">Total items</div>
          <div className="ad_card__value">{items.length}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Available now</div>
          <div className="ad_card__value">{availableCount}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Hidden items</div>
          <div className="ad_card__value">{hiddenCount}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Average price</div>
          <div className="ad_card__value">₹{avgPrice}</div>
        </article>
      </div>

      <div className="rooms__header">
        <div />
        <button className="rooms__add_btn" onClick={openAdd}>Add Item</button>
      </div>

      <section className="ad_card">
        <h3 className="ad_card__title">Add New Item</h3>
        <div className="ad_form_grid">
          <input
            className="ad_input"
            placeholder="Dish name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
          />
          <select
            className="ad_select"
            value={form.category}
            onChange={(event) => setField("category", event.target.value)}
          >
            <option value="Starter">Starter</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
          <input
            className="ad_input"
            type="number"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={(event) => setField("price", event.target.value)}
          />
          <button className="ad_btn ad_btn--primary" onClick={openAdd}>
            Add Item
          </button>
        </div>
      </section>

      <div className="ad_table_wrap" style={{ marginTop: 16 }}>
        <table className="ad_table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Cuisine</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.cuisine}</td>
                <td>{item.category}</td>
                <td><img src={item.image} alt={item.name} className="ad_gallery_img" style={{ width: 70, height: 44, marginBottom: 0 }} /></td>
                <td>₹{item.price.toLocaleString("en-IN")}</td>
                <td>
                  <button className="ad_btn ad_btn--ghost" onClick={() => toggleAvailability(item.id)}>
                    {item.available ? "Available" : "Hidden"}
                  </button>
                </td>
                <td>
                  <button className="rooms__icon_btn" title="Edit item" onClick={() => openEdit(item)}><IcEdit /></button>
                  <button className="rooms__icon_btn rooms__icon_btn--danger" title="Delete item" onClick={() => removeItem(item.id)}><IcTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Pricing Notes</h3>
        <ul className="ad_list">
          <li className="ad_list__item ad_list__item--between">
            <span>Recommended premium range</span>
            <span className="ad_chip">₹550 - ₹900</span>
          </li>
          <li className="ad_list__item ad_list__item--between">
            <span>Recommended starter range</span>
            <span className="ad_chip">₹220 - ₹420</span>
          </li>
        </ul>
      </section>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add Menu Item" : "Edit Menu Item"} onClose={close}>
          <div className="rooms__form_row"><label className="rooms__form_label">Dish Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setField("name", e.target.value)} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Cuisine</label><select className="rooms__form_select" value={form.cuisine} onChange={(e) => setField("cuisine", e.target.value)}>{DEFAULT_CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Category</label><select className="rooms__form_select" value={form.category} onChange={(e) => setField("category", e.target.value)}><option value="Starter">Starter</option><option value="Main Course">Main Course</option><option value="Dessert">Dessert</option><option value="Beverage">Beverage</option></select></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Price</label><input required type="number" className="rooms__form_input" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://..." /></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={saveItem}>Save Item</button></div>
        </Modal>
      )}
    </div>
  );
}