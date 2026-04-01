import { useState } from "react";

const INITIAL_IMAGES = [
  { id: 1, title: "Sunset Patio", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80", visible: true },
  { id: 2, title: "Chef Special Plating", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80", visible: true },
  { id: 3, title: "Private Dining Room", url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80", visible: false },
];
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;

export default function AdminGallery() {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [modal, setModal] = useState(null);

  const addImage = () => {
    if (!title.trim() || !url.trim()) return;
    setImages((current) => [
      { id: Date.now(), title: title.trim(), url: url.trim(), visible: true },
      ...current,
    ]);
    setTitle("");
    setUrl("");
  };

  const toggleImage = (id) => {
    setImages((current) =>
      current.map((image) => (image.id === id ? { ...image, visible: !image.visible } : image))
    );
  };

  const removeImage = (id) => setImages((current) => current.filter((image) => image.id !== id));

  const visible = images.filter((image) => image.visible).length;
  const hidden = images.length - visible;

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Gallery</h2>
      <p className="ad_p">Upload images, control visibility, and keep your media library updated.</p>

      <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">Total media</div>
          <div className="ad_card__value">{images.length}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Visible</div>
          <div className="ad_card__value">{visible}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Hidden</div>
          <div className="ad_card__value">{hidden}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Suggested format</div>
          <div className="ad_card__value">16:9</div>
        </article>
      </div>

      <div className="rooms__header"><div /><button className="rooms__add_btn" onClick={() => setModal({ mode: "add" })}>Add Image</button></div>

      <div className="ad_table_wrap" style={{ marginTop: 16 }}>
        <table className="ad_table">
          <thead><tr><th>Title</th><th>Preview</th><th>Visibility</th><th>Actions</th></tr></thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}>
                <td>{image.title}</td>
                <td><img src={image.url} alt={image.title} className="ad_gallery_img" style={{ width: 120, height: 72, marginBottom: 0 }} /></td>
                <td><span className="ad_chip">{image.visible ? "Visible" : "Hidden"}</span></td>
                <td className="rooms__actions_cell">
                  <button className="rooms__icon_btn" title="Edit image" onClick={() => setModal({ mode: "edit", image })}><IcEdit /></button>
                  <button className="rooms__icon_btn" onClick={() => toggleImage(image.id)}>{image.visible ? "Hide" : "Show"}</button>
                  <button className="rooms__icon_btn rooms__icon_btn--danger" title="Delete image" onClick={() => setModal({ mode: "delete", image })}><IcTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ad_gallery_grid" style={{ marginTop: 16 }}>
        {images.map((image) => (
          <article key={image.id} className="ad_card">
            <img src={image.url} alt={image.title} className="ad_gallery_img" />
            <h4 className="ad_card__title">{image.title}</h4>
            <div className="ad_row_actions">
              <button className="ad_btn ad_btn--ghost" onClick={() => toggleImage(image.id)}>
                {image.visible ? "Visible" : "Hidden"}
              </button>
              <button className="ad_btn ad_btn--danger" onClick={() => removeImage(image.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Gallery Guidelines</h3>
        <ul className="ad_list">
          <li className="ad_list__item">Use landscape images for hero sections.</li>
          <li className="ad_list__item">Prefer bright and warm ambiance photos.</li>
          <li className="ad_list__item">Keep dish close-ups high resolution and clean plated.</li>
        </ul>
      </section>
      {modal?.mode === "add" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Add Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">URL</label><input required className="rooms__form_input" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={() => { if (!title.trim() || !url.trim()) return; addImage(); setModal(null); }}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "edit" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Edit Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={modal.image.title} onChange={(e) => setModal((m) => ({ ...m, image: { ...m.image, title: e.target.value } }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">URL</label><input required className="rooms__form_input" value={modal.image.url} onChange={(e) => setModal((m) => ({ ...m, image: { ...m.image, url: e.target.value } }))} /></div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={() => { if (!modal.image.title.trim() || !modal.image.url.trim()) return; setImages((prev) => prev.map((img) => (img.id === modal.image.id ? modal.image : img))); setModal(null); }}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Delete Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <p className="rooms__delete_msg">Delete {modal.image.title} image?</p>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={() => { removeImage(modal.image.id); setModal(null); }}>Delete</button></div>
          </div>
        </>
      )}
    </div>
  );
}