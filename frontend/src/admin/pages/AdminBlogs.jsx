import { useState } from "react";

const INITIAL_BLOGS = [
  { id: 1, title: "Summer Dining Trends", author: "Admin", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", status: "published" },
  { id: 2, title: "Top 5 Signature Dishes", author: "Chef Team", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", status: "draft" },
];

const EMPTY_FORM = { title: "", author: "", image: "", status: "draft" };
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

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (blog) => { setForm(blog); setModal({ mode: "edit", blog }); };
  const openDelete = (blog) => setModal({ mode: "delete", blog });
  const close = () => setModal(null);

  const save = () => {
    if (!form.title.trim() || !form.author.trim() || !form.image.trim()) return;
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
          <thead><tr><th>Cover</th><th>Title</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td><img src={blog.image} alt={blog.title} className="ad_gallery_img" style={{ width: 90, height: 52, marginBottom: 0 }} /></td><td>{blog.title}</td><td>{blog.author}</td><td><span className="ad_chip">{blog.status}</span></td>
                <td className="rooms__actions_cell"><button className="rooms__icon_btn" title="Edit blog" onClick={() => openEdit(blog)}><IcEdit /></button><button className="rooms__icon_btn rooms__icon_btn--danger" title="Delete blog" onClick={() => openDelete(blog)}><IcTrash /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add Blog" : "Edit Blog"} onClose={close}>
          <div className="rooms__form_row"><label className="rooms__form_label">Title</label><input required className="rooms__form_input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Author</label><input required className="rooms__form_input" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Cover Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Published</option></select></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
        </Modal>
      )}
      {modal?.mode === "delete" && <Modal title="Delete Blog" onClose={close}><p className="rooms__delete_msg">Delete "{modal.blog.title}"?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}
