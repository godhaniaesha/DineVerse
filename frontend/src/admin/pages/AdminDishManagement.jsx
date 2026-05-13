import { useEffect, useMemo, useState, useRef } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useMenu } from "../../contexts/MenuContext";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import FoodLoadingAnimation from "../components/FoodLoadingAnimation";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const AREAS = ["Restaurant", "Cafe", "Bar"];
// const COURSES = ["Soup", "Appetizer", "Palate Cleanser", "Main Course", "Dessert"];
const MEALS = ["Veg", "Non-Veg"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area", "Cuisine"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const EMPTY = {
    cat_id: "",
    name: "",
    img: null,
    short_des: "",
    des: "",
    cuisineId: "",
    mealType: "Veg",
    price: "",
    prepTime: "",
    ingredients: "",
    note: "",
    chef: [],
    area: ["Restaurant"],
    status: "available",
};

const CHEF_ROLES = new Set(["Cafe Chef", "Restaurant Chef", "Bar Chef"]);
const MANAGER_ROLES = new Set(["Super Admin", "Manager"]);

const canEdit = (adminRole) => MANAGER_ROLES.has(adminRole);

export default function AdminDishManagement() {
    const { mappedDishes: rows, categories, cuisines, chefs, loading, addDish, updateDish, deleteDish } = useMenu();
    console.log("cuisines", cuisines)

    const adminRole = localStorage.getItem("adminRole") || "Super Admin";
    const adminName = localStorage.getItem("adminName") || "";
    const isChefRole = CHEF_ROLES.has(adminRole);
    const canEditItems = canEdit(adminRole);

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("All");
    const [sortBy, setSortBy] = useState("None");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isChefDropdownOpen, setIsChefDropdownOpen] = useState(false);
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const chefDropdownRef = useRef(null);
    const areaDropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    const close = () => {
        setModal(null);
        setIsChefDropdownOpen(false);
        setIsAreaDropdownOpen(false);
        setForm(EMPTY);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chefDropdownRef.current && !chefDropdownRef.current.contains(event.target)) {
                setIsChefDropdownOpen(false);
            }
            if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
                setIsAreaDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setForm(f => ({ ...f, img: e.target.files[0] }));
        }
    };

    const save = async () => {
        const {
            name,
            price,
            cat_id,
            area,
            short_des,
            des,
            cuisineId,
            mealType,
            prepTime,
            ingredients,
            note,
            status,
            chef,
            img
        } = form;

        // =========================
        // NAME VALIDATION
        // =========================
        if (!name || !name.trim()) {
            return toast.error("Dish name is required");
        }

        if (name.trim().length < 2) {
            return toast.error("Dish name must be at least 2 characters");
        }

        if (name.trim().length > 100) {
            return toast.error("Dish name cannot exceed 100 characters");
        }

        // =========================
        // IMAGE VALIDATION
        // =========================
        if (modal?.mode === "add" && !img) {
            return toast.error("Dish image is required");
        }

        if (img instanceof File) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(img.type)) {
                return toast.error("Only JPG, PNG and WEBP images are allowed");
            }

            if (img.size > 2 * 1024 * 1024) {
                return toast.error("Image size must be less than 2MB");
            }
        }

        // =========================
        // SHORT DESCRIPTION
        // =========================
        if (!short_des || !short_des.trim()) {
            return toast.error("Short description is required");
        }

        if (short_des.trim().length < 5) {
            return toast.error("Short description must be at least 5 characters");
        }

        if (short_des.trim().length > 150) {
            return toast.error("Short description cannot exceed 150 characters");
        }

        // =========================
        // DESCRIPTION
        // =========================
        if (!des || !des.trim()) {
            return toast.error("Description is required");
        }

        if (des.trim().length < 10) {
            return toast.error("Description must be at least 10 characters");
        }

        // =========================
        // CATEGORY
        // =========================
        if (!cat_id) {
            return toast.error("Please select category");
        }

        // =========================
        // CUISINE
        // =========================
        if (!cuisineId) {
            return toast.error("Please select cuisine");
        }

        // =========================
        // MEAL TYPE
        // =========================
        if (!mealType) {
            return toast.error("Please select meal type");
        }

        // =========================
        // PRICE
        // =========================
        if (!price || price.toString().trim() === "") {
            return toast.error("Price is required");
        }

        if (isNaN(price)) {
            return toast.error("Price must be a valid number");
        }

        if (Number(price) <= 0) {
            return toast.error("Price must be greater than 0");
        }

        if (Number(price) > 100000) {
            return toast.error("Price is too high");
        }

        // =========================
        // PREP TIME
        // =========================
        if (!prepTime || !prepTime.trim()) {
            return toast.error("Preparation time is required");
        }

        if (prepTime.trim().length > 50) {
            return toast.error("Preparation time is too long");
        }

        // =========================
        // INGREDIENTS
        // =========================
        if (!ingredients || !ingredients.trim()) {
            return toast.error("Ingredients are required");
        }

        const ingredientList = ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);

        if (ingredientList.length === 0) {
            return toast.error("Please enter valid ingredients");
        }

        // =========================
        // NOTE
        // =========================
        if (note && note.length > 300) {
            return toast.error("Note cannot exceed 300 characters");
        }

        // =========================
        // CHEF VALIDATION
        // =========================
        if (!chef || chef.length === 0) {
            return toast.error("Please assign at least one chef");
        }

        // =========================
        // AREA VALIDATION
        // =========================
        if (!area || area.length === 0) {
            return toast.error("Please select at least one area");
        }

        // =========================
        // STATUS VALIDATION
        // =========================
        if (!status) {
            return toast.error("Please select status");
        }

        // =========================
        // FORM DATA
        // =========================
        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("cat_id", cat_id);
        formData.append("short_des", short_des.trim());
        formData.append("des", des.trim());
        formData.append("cuisineId", cuisineId);
        formData.append("mealType", mealType);
        formData.append("price", price);
        formData.append("prepTime", prepTime.trim());
        formData.append("ingredients", ingredients.trim());
        formData.append("note", note.trim());
        formData.append("status", status);
        formData.append("area", JSON.stringify(area));
        formData.append("chef", JSON.stringify(chef));

        if (img instanceof File) {
            formData.append("img", img);
        }

        let result;

        if (modal?.mode === "add") {
            result = await addDish(formData);
        } else if (modal?.mode === "edit" && modal.row) {
            result = await updateDish(modal.row.id, formData);
        }

        if (result?.success) {
            toast.success(
                modal?.mode === "add"
                    ? "Dish added successfully"
                    : "Dish updated successfully"
            );
            close();
        } else {
            toast.error(result?.error || "Something went wrong");
        }
    };

    const filtered = useMemo(() => {
        if (!rows) return [];
        return rows.filter((r) => {
            const matchArea = areaFilter === "All" || r.area.includes(areaFilter);
            const text = `${r.name} ${r.short_des} ${r.des} ${r.course} ${r.mealType} ${r.area.join(" ")}`.toLowerCase();
            return matchArea && (!search || text.includes(search.toLowerCase()));
        });
    }, [rows, areaFilter, search]);

    const sorted = useMemo(() => {
        const list = [...filtered];
        if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
        if (sortBy === "Area") return list.sort((a, b) => (a.area[0] || "").localeCompare(b.area[0] || ""));
        if (sortBy === "Cuisine") return list.sort((a, b) => (a.cuisineName || "").localeCompare(b.cuisineName || ""));
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
                text="Loading dishes..."
                fullScreen={false}
            />
        </div>
    );

    return (
        <div className="ad_page">
            <div className="rooms__header">
                <div>
                    <h2 className="ad_h2">Dish Management</h2>
                    <p className="ad_p">Manage dishes with full course, meal, ingredient and area controls.</p>
                </div>
                {canEditItems && (
                    <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>
                        Add Dish
                    </button>
                )}
            </div>

            <div className="rooms__filters" style={{ marginBottom: 12 }}>
                <input
                    className="rooms__search"
                    placeholder="Search dish by name/description/area..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 280, marginRight: 8 }}
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
                            <th>Name</th>
                            <th>Category</th>
                            <th>Cuisine</th>
                            <th>Meal</th>
                            <th>Price</th>
                            <th>Area</th>
                            <th>Chefs</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((r) => (
                            console.log("r", r),
                            <tr key={r.id}>
                                <td>
                                    {r.img ? (
                                        <img src={r.img} alt={r.name} className="ad_gallery_img" style={{ width: 60, height: 40, marginBottom: 0, objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: 60, height: 40, background: '#333', color: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                                    )}
                                </td>
                                {/* <td><img src={r.img} alt={r.name} style={{ width: 60, height: 40, objectFit: "cover", b}}  /></td> */}
                                <td>{r.name}</td>
                                <td>{r.categoryName}</td>
                                <td>{r.cuisineName}</td>
                                <td>{r.mealType}</td>
                                <td>{r.displayPrice}</td>
                                <td>{r.area.join(", ")}</td>
                                <td>{r.chef && r.chef.length ? r.chef.map(c => c.full_name).join(", ") : "-"}</td>
                                <td><span className="ad_chip">{r.status}</span></td>
                                <td>
                                    <div className="d-flex" style={{ gap: "6px" }}>
                                        {canEditItems ? (
                                            <>
                                                <button className="rooms__icon_btn" onClick={() => {
                                                    setForm({
                                                        ...r,
                                                        cat_id: r.categoryId,
                                                        ingredients: r.ingredients.join(", "),
                                                        chef: r.chef.map(c => c._id || c)
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
                        {paginatedData.length === 0 && <tr><td colSpan={9} className="rooms__empty">No dishes found</td></tr>}
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
                            <span className="rooms__modal_title">{modal.mode === "add" ? "Add Dish" : "Edit Dish"}</span>
                            <button className="rooms__modal_close" onClick={close}>x</button>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>

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

                        <div className="rooms__form_row"><label className="rooms__form_label">Short Description</label><input className="rooms__form_input" value={form.short_des} onChange={(e) => setForm((f) => ({ ...f, short_des: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.des} onChange={(e) => setForm((f) => ({ ...f, des: e.target.value }))} /></div>

                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Category</label>
                            <select
                                className="rooms__form_select"
                                value={form.cat_id}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, cat_id: e.target.value }))
                                }
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Cuisine</label>
                            <select
                                className="rooms__form_select"
                                value={form.cuisineId}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, cuisineId: e.target.value }))
                                }
                            >
                                <option value="">Select Cuisine</option>
                                {cuisines.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Meal</label><select className="rooms__form_select" value={form.mealType} onChange={(e) => setForm((f) => ({ ...f, mealType: e.target.value }))}>{MEALS.map((m) => <option key={m}>{m}</option>)}</select></div>

                        <div className="rooms__form_grid2">
                            <div><label className="rooms__form_label">Price</label><input type="number" className="rooms__form_input" value={form.price} maxLength={4} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
                            <div><label className="rooms__form_label">Prep time</label><input className="rooms__form_input" value={form.prepTime} onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value }))} /></div>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Ingredients (comma-separated)</label><input className="rooms__form_input" value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Note</label><input className="rooms__form_input" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></div>

                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Assign Chefs</label>
                            <div className="rooms__multi_select_wrapper" ref={chefDropdownRef}>
                                <div
                                    className="rooms__multi_select_trigger"
                                    onClick={() => setIsChefDropdownOpen(!isChefDropdownOpen)}
                                >
                                    {form.chef.length > 0 ? (
                                        form.chef.map((chefId) => {
                                            const chefObj = chefs.find(c => c._id === chefId);
                                            return (
                                                <span key={chefId} className="rooms__multi_select_tag">
                                                    {chefObj?.full_name || chefId}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="rooms__multi_select_placeholder">Select Chefs</span>
                                    )}
                                </div>
                                {isChefDropdownOpen && (
                                    <div className="rooms__multi_select_dropdown">
                                        {chefs.map((chef) => {
                                            const isSelected = form.chef.includes(chef._id);
                                            return (
                                                <div
                                                    key={chef._id}
                                                    className={`rooms__multi_select_item ${isSelected ? "selected" : ""}`}
                                                    onClick={() => {
                                                        const next = isSelected
                                                            ? form.chef.filter((id) => id !== chef._id)
                                                            : [...form.chef, chef._id];
                                                        setForm((f) => ({ ...f, chef: next }));
                                                    }}
                                                >
                                                    <div className="rooms__multi_select_checkbox"></div>
                                                    <span className="rooms__multi_select_item_label">{chef.full_name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Area</label><select className="rooms__form_select" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="available">Available</option><option value="out of stock">Out of Stock</option></select></div>

                        <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
                    </div>
                </>
            )}
            {canEditItems && modal?.mode === "delete" && (
                <>
                    <div className="rooms__modal_overlay" onClick={close} />
                    <div className="rooms__modal_box">
                        <div className="rooms__modal_head">
                            <span className="rooms__modal_title">Delete Dish</span>
                            <button className="rooms__modal_close" onClick={close}>x</button>
                        </div>
                        <p className="rooms__delete_message">Delete {modal.row.name}?</p>
                        <div className="rooms__form_actions">
                            <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
                            <button className="rooms__btn rooms__btn--danger" onClick={async () => {
                                const res = await deleteDish(modal.row.id);
                                if (res.success) {
                                    toast.success("Dish deleted");
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

