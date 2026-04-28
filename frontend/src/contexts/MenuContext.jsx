import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const { token } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapBackendDishToFrontend = (item) => ({
    id: item._id,
    categoryId: item.cat_id?._id || item.cat_id,
    categoryName: item.cat_id?.name || "N/A",
    category: (item.area && item.area[0] ? item.area[0].toLowerCase() : "restaurant"),
    cuisineId: item.cuisineId?._id || item.cuisineId,
    cuisineName: item.cuisineId?.name || "N/A",
    cuisine: (item.cuisineId && item.cuisineId.name ? item.cuisineId.name.toLowerCase() : ""),
    tag: item.mealType || (item.cat_id && item.cat_id.name) || "Special",
    featured: item.badges?.includes("signature") || item.badges?.includes("bestseller"),
    name: item.name,
    price: item.price,
    displayPrice: `₹${item.price?.toLocaleString()}`,
    desc: item.short_des || item.des,
    short_des: item.short_des,
    des: item.des,
    badges: item.badges || [],
    time: item.prepTime || "20 min",
    prepTime: item.prepTime || "20 min",
    cal: item.intensity || "Medium",
    intensity: item.intensity || "Medium",
    img: item.img || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    mealType: item.mealType,
    course: item.course,
    area: item.area || [],
    chef: item.chef || [],
    status: item.status || "available",
    note: item.note || "",
    ingredients: item.ingredients || []
  });

  const [mappedDishes, setMappedDishes] = useState([]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/food/getDishes`);
      const data = await response.json();
      
      if (data.success) {
        setDishes(data.data);
        setMappedDishes(data.data.map(mapBackendDishToFrontend));
        setError(null);
      } else {
        setError(data.message || "Failed to fetch dishes");
      }
    } catch (err) {
      console.error("Fetch dishes error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/getCategories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchCuisines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/getCuisines`);
      const data = await response.json();
      if (data.success) {
        setCuisines(data.data);
      }
    } catch (err) {
      console.error("Fetch cuisines error:", err);
    }
  };

  const fetchChefs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getStaff`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const chefsList = data.data.filter(s => s.role === "Chef");
        setChefs(chefsList);
      }
    } catch (err) {
      console.error("Fetch chefs error:", err);
    }
  };

  // Dish CRUD
  const addDish = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/addDish`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchDishes();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateDish = async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/updateDish/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchDishes();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteDish = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/deleteDish/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchDishes();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Category CRUD
  const addCategory = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/addCategory`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/updateCategory/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/deleteCategory/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Cuisine CRUD
  const addCuisine = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/addCuisine`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchCuisines();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCuisine = async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/updateCuisine/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchCuisines();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCuisine = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/deleteCuisine/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchCuisines();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDishes();
    fetchCategories();
    fetchCuisines();
  }, []);

  useEffect(() => {
    if (token) {
      fetchChefs();
    }
  }, [token]);

  return (
    <MenuContext.Provider
      value={{
        dishes,
        mappedDishes,
        categories,
        cuisines,
        chefs,
        loading,
        error,
        fetchDishes,
        fetchCategories,
        fetchCuisines,
        fetchChefs,
        addDish,
        updateDish,
        deleteDish,
        addCategory,
         updateCategory,
         deleteCategory,
         addCuisine,
         updateCuisine,
         deleteCuisine,
         refreshDishes: fetchDishes,
       }}
    >
      {children}
    </MenuContext.Provider>
  );
};
