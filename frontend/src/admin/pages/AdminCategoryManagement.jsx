import { useMemo, useState, useRef, useEffect } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useMenu } from "../../contexts/MenuContext";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import FoodLoadingAnimation from "../components/FoodLoadingAnimation";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const AREAS = ["Restaurant", "Cafe", "Bar"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const EMPTY = {
  // cuisineId: "",
  name: "",
  img: null,
  area: ["Restaurant"],
  status: "Active"
};
const CHEF_ROLES = new Set(["Cafe Chef", "Restaurant Chef", "Bar Chef"]);
const MANAGER_ROLES = new Set(["Super Admin", "Manager"]);

const canEdit = (adminRole) => MANAGER_ROLES.has(adminRole);

export default function AdminCategoryManagement() {
  const { categories: rows, loading, addCategory, updateCategory, deleteCategory } = useMenu();
  const adminRole = localStorage.getItem("adminRole") || "Super Admin";
  const isChefRole = CHEF_ROLES.has(adminRole);
  const canEditItems = canEdit(adminRole);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const areaDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const close = () => {
    setModal(null);
    setForm(EMPTY);
    setIsAreaDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setIsAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG and WEBP images are allowed"
      );

      return;
    }

    // 2MB max
    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 2MB"
      );

      return;
    }

    setForm((f) => ({
      ...f,
      img: file,
    }));
  };

  const save = async () => {
    const { name, area, status, img } = form;

    // =========================
    // NAME VALIDATION
    // =========================

    if (!name || !name.trim()) {
      return toast.error("Please enter category name");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return toast.error(
        "Category name must be at least 2 characters"
      );
    }

    if (trimmedName.length > 50) {
      return toast.error(
        "Category name cannot exceed 50 characters"
      );
    }

    if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      return toast.error(
        "Category name must contain only letters and spaces"
      );
    }

    // =========================
    // AREA VALIDATION
    // =========================

    if (!area || area.length === 0) {
      return toast.error(
        "Please select at least one area"
      );
    }

    const invalidAreas = area.filter(
      (a) => !AREAS.includes(a)
    );

    if (invalidAreas.length > 0) {
      return toast.error("Invalid area selected");
    }

    // =========================
    // STATUS VALIDATION
    // =========================

    const validStatuses = ["Active", "Inactive"];

    if (!validStatuses.includes(status)) {
      return toast.error("Invalid status selected");
    }

    // =========================
    // IMAGE VALIDATION
    // =========================

    if (modal?.mode === "add" && !img) {
      return toast.error(
        "Please upload category image"
      );
    }

    if (img instanceof File) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(img.type)) {
        return toast.error(
          "Only JPG, PNG and WEBP images are allowed"
        );
      }

      // 2MB limit
      if (img.size > 2 * 1024 * 1024) {
        return toast.error(
          "Image size must be less than 2MB"
        );
      }
    }

    // =========================
    // FORM DATA
    // =========================

    const formData = new FormData();

    formData.append("name", trimmedName);
    formData.append("status", status);
    formData.append("area", JSON.stringify(area));

    if (img instanceof File) {
      formData.append("img", img);
    }

    // =========================
    // API CALL
    // =========================

    let result;

    if (modal?.mode === "add") {
      result = await addCategory(formData);
    }

    if (modal?.mode === "edit" && modal.row) {
      result = await updateCategory(
        modal.row._id,
        formData
      );
    }

    // =========================
    // RESPONSE
    // =========================

    if (result?.success) {
      toast.success(
        modal?.mode === "add"
          ? "Category added successfully!"
          : "Category updated successfully!"
      );

      close();
    } else {
      toast.error(
        result?.error || "Something went wrong"
      );
    }
  };
  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => {
      const matchArea = areaFilter === "All" || r.area.includes(areaFilter);
      const cuisineName = r.cuisineId?.name || "";
      const text = `${r.name} ${r.area.join(" ")} ${cuisineName}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [rows, areaFilter, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "Area") return list.sort((a, b) => (a.area[0] || "").localeCompare(b.area[0] || ""));
    return list;
  }, [filtered, sortBy]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, areaFilter, sortBy]);

  if (loading) return (
    <div className="ad_page">
      <FoodLoadingAnimation
        type="ingredients"
        size="large"
        text="Loading categories..."
        fullScreen={false}
      />
    </div>
  );

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Category Management</h2><p className="ad_p">Manage categories in the system by cuisine and area.</p></div>
        {canEditItems && <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Category</button>}
      </div>

      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search name/area/cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260, marginRight: 8 }}
        />
        <select className="rooms__select" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} style={{ marginRight: 8 }}>
          <option>All</option>
          {AREAS.map((area) => <option key={area}>{area}</option>)}
        </select>
        <select className="rooms__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category Name</th>
              {/* <th>Cuisine</th> */}
              <th>Area</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((r) => (
              <tr key={r._id}>
                <td>
                  {r.img ? (
                    <img src={r.img} alt={r.name} className="ad_gallery_img" style={{ width: 60, height: 40, marginBottom: 0, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 60, height: 40, background: '#333', color: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                  )}
                </td>
                <td>{r.name}</td>
                {/* <td>{r.cuisineId?.name || "-"}</td> */}

                <td>{r.area.join(", ")}</td>
                <td><span className="ad_chip">{r.status}</span></td>
                <td>
                  <div className="d-flex" style={{ gap: "6px" }}>
                    {canEditItems ? (
                      <>
                        <button className="rooms__icon_btn" onClick={() => {
                          setForm({
                            ...r,
                            cuisineId: r.cuisineId?._id || r.cuisineId,
                            img: r.img
                          });
                          setModal({ mode: "edit", row: r });
                        }}><IcEdit /></button>
                        <DeleteIconButton onClick={() => setModal({ mode: "delete", row: r })} />
                      </>
                    ) : (
                      <span className="ad_chip">View only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && <tr><td colSpan={6} className="rooms__empty">No categories match filters</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sorted.length}
      />

      {canEditItems && (modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">{modal.mode === "add" ? "Add Category" : "Edit Category"}</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>

            <div className="rooms__form_row"><label className="rooms__form_label">Name</label>
              <input
                className="rooms__form_input"
                value={form.name}
                maxLength={50}
                onChange={(e) => {
                  const value = e.target.value;

                  // only letters + spaces
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    setForm((f) => ({
                      ...f,
                      name: value,
                    }));
                  }
                }}
              /></div>


            <div className="rooms__form_row">
              <label className="rooms__form_label">Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <div className="d-flex align-items-center gap-2">
                <button className="rooms__add_btn" style={{ padding: '5px 15px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>
                  {form.img ? "Change Image" : "Upload Image"}
                </button>
                {form.img && <span style={{ fontSize: '12px' }}>{form.img instanceof File ? form.img.name : "Current Image"}</span>}
              </div>
            </div>

            <div className="rooms__form_row"><label className="rooms__form_label">Area</label><select className="rooms__form_select" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>

            <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>

            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
          </div>
        </>
      )}
      {canEditItems && modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Delete Category</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>
            <p className="rooms__delete_message">Delete {modal.row.name}?</p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button className="rooms__btn rooms__btn--danger" onClick={async () => {
                const res = await deleteCategory(modal.row._id);
                if (res.success) {
                  toast.success("Category deleted");
                  close();
                } else {
                  toast.error(res.error || "Delete failed");
                }
              }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
