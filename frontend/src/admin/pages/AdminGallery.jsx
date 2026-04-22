import { useState, useRef } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useGallery } from "../../contexts/GalleryContext";
import { toast } from "react-toastify";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
const IcEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IcEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 1l22 22" />
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.24 4.5" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
  </svg>
);

const CATEGORIES = ["Ambiance", "Dishes", "Bar", "Events", "Restaurant"];

export default function AdminGallery() {
  const { images, loading, addImage, updateImage, deleteImage, toggleVisibility } = useGallery();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Ambiance", img: null, visibility: "Visible" });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm(f => ({ ...f, img: e.target.files[0] }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("visibility", form.visibility);
    
    if (form.img instanceof File) {
      formData.append("img", form.img);
    } else if (modal.mode === "add") {
      return toast.error("Image is required");
    }

    let res;
    if (modal.mode === "add") {
      res = await addImage(formData);
    } else {
      res = await updateImage(modal.image._id, formData);
    }

    if (res.success) {
      toast.success(modal.mode === "add" ? "Image added" : "Image updated");
      setModal(null);
      setForm({ title: "", category: "Ambiance", img: null, visibility: "Visible" });
    } else {
      toast.error(res.error || "Failed to save image");
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteImage(id);
    if (res.success) {
      toast.success("Image deleted");
      setModal(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleToggle = async (id) => {
    const res = await toggleVisibility(id);
    if (!res.success) toast.error(res.error || "Failed to toggle visibility");
  };

  const visibleCount = images.filter((image) => image.visibility === "Visible").length;
  const hiddenCount = images.length - visibleCount;

  if (loading) return <div className="ad_page"><div className="ad_h2">Loading Gallery...</div></div>;

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Gallery</h2>
          <p className="ad_p">Upload images, control visibility, and keep your media library updated.</p>
        </div>
        <div>
          <button className="rooms__add_btn" onClick={() => {
            setForm({ title: "", category: "Ambiance", img: null, visibility: "Visible" });
            setModal({ mode: "add" });
          }}>Add Image</button>
        </div>
      </div>

      <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">Total media</div>
          <div className="ad_card__value">{images.length}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Visible</div>
          <div className="ad_card__value">{visibleCount}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Hidden</div>
          <div className="ad_card__value">{hiddenCount}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Suggested format</div>
          <div className="ad_card__value">16:9</div>
        </article>
      </div>


      <div className="ad_table_wrap" style={{ marginTop: 16 }}>
        <table className="ad_table">
          <thead><tr><th>Preview</th><th>Title</th><th>Category</th><th>Visibility</th><th>Actions</th></tr></thead>
          <tbody>
            {images.map((image) => (
              <tr key={image._id}>
                <td><img src={image.img} alt={image.title} className="ad_gallery_img" style={{ width: 120, height: 72, marginBottom: 0, objectFit: 'cover' }} /></td>
                <td>{image.title}</td>
                <td>{image.category}</td>
                <td><span className="ad_chip">{image.visibility}</span></td>
                <td>
                  <div className="d-flex" style={{gap:"6px"}}>
                    <button className="rooms__icon_btn" title="Edit image" onClick={() => {
                      setForm({ title: image.title, category: image.category, visibility: image.visibility, img: image.img });
                      setModal({ mode: "edit", image });
                    }}><IcEdit /></button>
                    <button
                      className="rooms__icon_btn"
                      title={image.visibility === "Visible" ? "Hide" : "Show"}
                      onClick={() => handleToggle(image._id)}
                    >
                      {image.visibility === "Visible" ? <IcEye /> : <IcEyeOff />}
                    </button>
                    <DeleteIconButton title="Delete image" onClick={() => setModal({ mode: "delete", image })} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {modal?.mode === "add" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Add Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            
            <div className="rooms__form_row">
              <label className="rooms__form_label">Category</label>
              <select className="rooms__form_select" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <div className="d-flex align-items-center gap-2">
                <button className="rooms__add_btn" style={{ padding: '5px 15px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>
                  {form.img ? "Change Image" : "Upload Image"}
                </button>
                {form.img && <span style={{ fontSize: '12px' }}>{form.img instanceof File ? form.img.name : "Selected"}</span>}
              </div>
            </div>

            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={handleSave}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "edit" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Edit Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            
            <div className="rooms__form_row">
              <label className="rooms__form_label">Category</label>
              <select className="rooms__form_select" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <div className="d-flex align-items-center gap-2">
                <button className="rooms__add_btn" style={{ padding: '5px 15px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>
                  Change Image
                </button>
                {form.img && <span style={{ fontSize: '12px' }}>{form.img instanceof File ? form.img.name : "Current Image"}</span>}
              </div>
            </div>

            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={handleSave}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={() => setModal(null)} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Delete Image</span><button className="rooms__modal_close" onClick={() => setModal(null)}>x</button></div>
            <p className="rooms__delete_msg">Delete {modal.image.title} image?</p>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={() => setModal(null)}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={() => handleDelete(modal.image._id)}>Delete</button></div>
          </div>
        </>
      )}
    </div>
  );
}