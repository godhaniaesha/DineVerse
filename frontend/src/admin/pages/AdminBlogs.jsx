// src/admin/pages/AdminBlogs.jsx
import { useState, useEffect } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import blogService from "../../services/blogService";

const EMPTY_FORM = {
  title: "",
  short_des: "",
  des: "",
  // coverImg = { file: File|null, preview: string (url) }
  coverImg: { file: null, preview: "" },
  area: "Restaurant",
  status: "draft",
};

const IcEdit = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IcView = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head">
          <span className="rooms__modal_title">{title}</span>
          <button className="rooms__modal_close" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // blogs per page

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogsAdmin();
      console.log(data, "data");
      const list = Array.isArray(data.data) ? data.data : data;
      setBlogs(list);
      setCurrentPage(1); // reset to first page when reloading
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (blog) => {
    // convert API blog to form shape
    setForm({
      title: blog.title || "",
      short_des: blog.short_des || "",
      des: blog.des || "",
      coverImg: {
        file: null,
        preview: blog.coverImg || "",
      },
      area: blog.area || "Restaurant",
      status: blog.status || "draft",
      _id: blog._id,
    });
    setModal({ mode: "edit", blog });
  };

  const openView = (blog) => setModal({ mode: "view", blog });
  const openDelete = (blog) => setModal({ mode: "delete", blog });
  const close = () => setModal(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setForm((f) => ({
      ...f,
      coverImg: { file, preview },
    }));
  };

  const save = async () => {
    // basic validations
    if (!form.title.trim() || !form.short_des.trim() || !form.des.trim()) {
      alert(
        "Please fill all required fields (title, short description, description)."
      );
      return;
    }

    // For add: image must be selected
    if (modal.mode === "add" && !form.coverImg.file) {
      alert("Please select a cover image.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to perform this action");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("short_des", form.short_des);
      formData.append("des", form.des);
      formData.append("area", form.area);
      formData.append("status", form.status);

      // Only append image if new file selected
      if (form.coverImg.file) {
        formData.append("coverImg", form.coverImg.file);
      }

      if (modal.mode === "add") {
        const newBlogRes = await blogService.createBlog(formData, authToken);
        const newBlog = newBlogRes.data || newBlogRes;
        setBlogs((prev) => [...prev, newBlog]);
      }

      if (modal.mode === "edit") {
        const updatedBlogRes = await blogService.updateBlog(
          modal.blog._id,
          formData,
          authToken
        );
        const updated = updatedBlogRes.data || updatedBlogRes;
        setBlogs((prev) =>
          prev.map((b) => (b._id === modal.blog._id ? updated : b))
        );
      }

      close();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(
        "Error saving blog: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const remove = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to perform this action");
        return;
      }

      await blogService.deleteBlog(modal.blog._id, authToken);
      setBlogs((prev) => prev.filter((b) => b._id !== modal.blog._id));
      close();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(
        "Error deleting blog: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // pagination derived values
  const totalItems = blogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Blogs</h2>
          <p className="ad_p">Create, edit and publish blog content.</p>
        </div>
        <button
          className="rooms__add_btn"
          onClick={openAdd}
          disabled={loading}
        >
          Add Blog
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading blogs...
        </div>
      ) : (
        <>
          <div className="ad_table_wrap">
            <table className="ad_table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Area</th>
                  <th>Likes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(paginatedBlogs) && paginatedBlogs.length > 0 ? (
                  paginatedBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        {blog.coverImg && (
                          <img
                            src={blog.coverImg}
                            alt={blog.title}
                            className="ad_gallery_img"
                            style={{
                              width: 90,
                              height: 52,
                              marginBottom: 0,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </td>
                      <td>{blog.title}</td>
                      <td>{blog.area}</td>
                      <td>{blog.likes?.length || 0}</td>
                      <td>
                        <span className="ad_chip">{blog.status}</span>
                      </td>
                      <td>
                        <div className="d-flex" style={{ gap: "6px" }}>
                          <button
                            className="rooms__icon_btn"
                            title="Edit blog"
                            onClick={() => openEdit(blog)}
                          >
                            <IcEdit />
                          </button>
                          <button
                            className="rooms__icon_btn"
                            title="View blog"
                            onClick={() => openView(blog)}
                          >
                            <IcView />
                          </button>
                          <DeleteIconButton
                            title="Delete blog"
                            onClick={() => openDelete(blog)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No blogs found. Click "Add Blog" to create your first
                      blog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalItems > pageSize && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#b5b5b5" }}>
                Showing {startIndex + 1}–
                {Math.min(endIndex, totalItems)} of {totalItems}
              </span>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  className="rooms__btn rooms__btn--ghost"
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={
                        page === currentPage
                          ? "rooms__btn rooms__btn--primary"
                          : "rooms__btn rooms__btn--ghost"
                      }
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        minWidth: "32px",
                      }}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="rooms__btn rooms__btn--ghost"
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal
          title={modal.mode === "add" ? "Add Blog" : "Edit Blog"}
          onClose={close}
        >
          <div className="rooms__form_row">
            <label className="rooms__form_label">Title</label>
            <input
              required
              className="rooms__form_input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div className="rooms__form_row">
            <label className="rooms__form_label">Short Description</label>
            <input
              className="rooms__form_input"
              value={form.short_des}
              onChange={(e) =>
                setForm((f) => ({ ...f, short_des: e.target.value }))
              }
              placeholder="Brief summary..."
            />
          </div>

          <div className="rooms__form_row">
            <label className="rooms__form_label">Full Description</label>
            <textarea
              className="rooms__form_input"
              value={form.des}
              onChange={(e) =>
                setForm((f) => ({ ...f, des: e.target.value }))
              }
              placeholder="Detailed content..."
              rows="3"
            />
          </div>

          {/* Image upload */}
          <div className="rooms__form_row">
            <label className="rooms__form_label">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              className="rooms__form_input"
              onChange={handleImageChange}
            />
            {form.coverImg.preview && (
              <div style={{ marginTop: "8px" }}>
                <span className="rooms__form_label" style={{ fontSize: 12 }}>
                  Preview:
                </span>
                <img
                  src={form.coverImg.preview}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}
          </div>

          <div className="rooms__form_grid2">
            <div>
              <label className="rooms__form_label">Area</label>
              <select
                className="rooms__form_select"
                value={form.area}
                onChange={(e) =>
                  setForm((f) => ({ ...f, area: e.target.value }))
                }
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
              </select>
            </div>
            <div>
              <label className="rooms__form_label">Status</label>
              <select
                className="rooms__form_select"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>
              Cancel
            </button>
            <button className="rooms__btn rooms__btn--primary" onClick={save}>
              Save
            </button>
          </div>
        </Modal>
      )}

      {modal?.mode === "view" && (
        <Modal title="View Blog" onClose={close}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {modal.blog.coverImg && (
              <img
                src={modal.blog.coverImg}
                alt={modal.blog.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <div>
              <h3
                className="ad_h2"
                style={{ fontSize: "20px", marginBottom: "4px" }}
              >
                {modal.blog.title}
              </h3>
              <p className="ad_p" style={{ fontSize: "12px" }}>
                {modal.blog.area} | {modal.blog.status} |{" "}
                {modal.blog.likes?.length || 0} likes
              </p>
            </div>
            <div>
              <h4 className="ad_card__label">Short Description</h4>
              <p className="ad_p">{modal.blog.short_des}</p>
            </div>
            <div>
              <h4 className="ad_card__label">Full Description</h4>
              <p className="ad_p">{modal.blog.des}</p>
            </div>
          </div>
          <div className="rooms__form_actions" style={{ marginTop: "20px" }}>
            <button className="rooms__btn rooms__btn--primary" onClick={close}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {modal?.mode === "delete" && (
        <Modal title="Delete Blog" onClose={close}>
          <p className="rooms__delete_msg">Delete "{modal.blog.title}"?</p>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>
              Cancel
            </button>
            <button className="rooms__btn rooms__btn--danger" onClick={remove}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}