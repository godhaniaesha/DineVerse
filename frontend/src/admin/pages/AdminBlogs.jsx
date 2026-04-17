import { useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const INITIAL_BLOGS = [
  { id: 1, title: "Summer Dining Trends", short_des: "Explore latest dining trends", des: "Detailed description...", author: "Admin", author_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnW0NUpcrZcGZeUJ4e50ZLU8ugS9GPPoqww&shttps://images.unsplash.com/photo-1564564321837-a57b7a5e50d7?w=400&q=80", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", like: 125, area: "Restaurant", status: "published" },
  { id: 2, title: "Top 5 Signature Dishes", short_des: "Must-try dishes", des: "Detailed description...", author: "Chef Team", author_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnW0NUpcrZcGZeUJ4e50ZLU8ugS9GPPoqww&s", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", like: 89, area: "Cafe", status: "draft" },
];

const EMPTY_FORM = { title: "", short_des: "", des: "", author: "", author_img: "", image: "", like: 0, area: "Restaurant", status: "draft" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
const IcView = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;

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

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (blog) => { setForm(blog); setModal({ mode: "edit", blog }); };
  const openView = (blog) => setModal({ mode: "view", blog });
  const openDelete = (blog) => setModal({ mode: "delete", blog });
  const close = () => setModal(null);

  const save = () => {
    if (!form.title.trim() || !form.author.trim() || !form.image.trim() || !form.short_des.trim() || !form.des.trim() || !form.author_img.trim()) return;
    if (modal.mode === "add") setBlogs((prev) => [...prev, { id: Date.now(), ...form }]);
    if (modal.mode === "edit") setBlogs((prev) => prev.map((b) => (b.id === modal.blog.id ? { ...b, ...form } : b)));
    close();
  };
  const remove = () => { setBlogs((prev) => prev.filter((b) => b.id !== modal.blog.id)); close(); };

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Blogs</h2><p className="ad_p">Create, edit and publish blog content.</p></div>
        <button className="rooms__add_btn" onClick={openAdd}>Add Blog</button>
      </div>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Cover</th><th>Title</th><th>Author</th><th>Area</th><th>Likes</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td><img src={blog.image} alt={blog.title} className="ad_gallery_img" style={{ width: 90, height: 52, marginBottom: 0 }} /></td><td>{blog.title}</td><td>{blog.author}</td><td>{blog.area}</td><td>{blog.like}</td><td><span className="ad_chip">{blog.status}</span></td>
                <td><div className="d-flex" style={{ gap: "6px" }}>
                  <button className="rooms__icon_btn" title="Edit blog" onClick={() => openEdit(blog)}><IcEdit /></button>
                  <button className="rooms__icon_btn" title="View blog" onClick={() => openView(blog)}><IcView /></button>
                  <DeleteIconButton title="Delete blog" onClick={() => openDelete(blog)} />
                </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add Blog" : "Edit Blog"} onClose={close}>
          <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Short Description</label><input className="rooms__form_input" value={form.short_des} onChange={(e) => setForm((f) => ({ ...f, short_des: e.target.value }))} placeholder="Brief summary..." /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Full Description</label><textarea className="rooms__form_input" value={form.des} onChange={(e) => setForm((f) => ({ ...f, des: e.target.value }))} placeholder="Detailed content..." rows="3" /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Author</label><input required className="rooms__form_input" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Author Image URL</label><input className="rooms__form_input" value={form.author_img} onChange={(e) => setForm((f) => ({ ...f, author_img: e.target.value }))} placeholder="https://..." /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Cover Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
          <div className="rooms__form_grid2">
            <div><label className="rooms__form_label">Likes</label><input type="number" className="rooms__form_input" value={form.like} onChange={(e) => setForm((f) => ({ ...f, like: Number(e.target.value) }))} /></div>
            <div><label className="rooms__form_label">Area</label><select className="rooms__form_select" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}><option value="Restaurant">Restaurant</option><option value="Cafe">Cafe</option><option value="Bar">Bar</option></select></div>
          </div>
          <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Published</option></select></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
        </Modal>
      )}
      {modal?.mode === "view" && (
        <Modal title="View Blog" onClose={close}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src={modal.blog.image} alt={modal.blog.title} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
            <div>
              <h3 className="ad_h2" style={{ fontSize: "20px", marginBottom: "4px" }}>{modal.blog.title}</h3>
              <p className="ad_p" style={{ fontSize: "12px" }}>By {modal.blog.author} | {modal.blog.area} | {modal.blog.status}</p>
            </div>
            <div>
              <h4 className="ad_card__label">Short Description</h4>
              <p className="ad_p">{modal.blog.short_des}</p>
            </div>
            <div>
              <h4 className="ad_card__label">Full Description</h4>
              <p className="ad_p">{modal.blog.des}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src={modal.blog.author_img} alt={modal.blog.author} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
              <span className="ad_p" style={{ fontSize: "13px" }}>{modal.blog.author}</span>
            </div>
          </div>
          <div className="rooms__form_actions" style={{ marginTop: "20px" }}>
            <button className="rooms__btn rooms__btn--primary" onClick={close}>Close</button>
          </div>
        </Modal>
      )}
      {modal?.mode === "delete" && <Modal title="Delete Blog" onClose={close}><p className="rooms__delete_msg">Delete "{modal.blog.title}"?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}
