import axiosInstance from "@/lib/axios";
import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

// Define the type of each category (adjust fields based on actual API)
interface Category {
  id: number;
  Category_name: string;
}

// Define food item type
interface FoodItem {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

// Define the context type
interface OwnerContextType {
  categories: Category[];
  foodItems: FoodItem[];
  foodItemsCount: number;
  currentPage: number;
  fetchCategories: () => Promise<void>;
  fetchFoodItems: (page?: number) => Promise<void>;
  updateFoodItem: (id: number, formData: FormData) => Promise<void>;
  createFoodItem: (formData: FormData) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

// Create the context
export const OwnerContext = createContext<OwnerContextType | undefined>(
  undefined
);

// Create the provider
export const OwnerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodItemsCount, setFoodItemsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        "http://192.168.10.150:8000/owners/categories/"
      );
      setCategories(res.data.results);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories.");
    }
  };

  const fetchFoodItems = async (page: number = currentPage) => {
    try {
      const response = await axiosInstance.get(`/owners/items/?page=${page}`);
      const { results, count } = response.data;
      console.log("Fetched food items:", response.data);
      const formattedItems = results.map((item: any) => ({
        id: item.id,
        image: item.image1 ?? "https://source.unsplash.com/80x80/?food",
        name: item.item_name,
        price: parseFloat(item.price),
        category: item.category_name,
        available: item.availability,
      }));

      setFoodItems(formattedItems);
      setFoodItemsCount(count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load food items", error);
      toast.error("Failed to load food items.");
    }
  };

  const updateFoodItem = async (id: number, formData: FormData) => {
    try {
      await axiosInstance.patch(`/owners/items/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Food item updated successfully!");
      // Refresh the current page to show updated data
      await fetchFoodItems(currentPage);
    } catch (err) {
      console.error("Failed to update food item", err);
      toast.error("Failed to update food item.");
      throw err;
    }
  };

  const createFoodItem = async (formData: FormData) => {
    try {
      await axiosInstance.post("/owners/items/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Food item created successfully!");
      // Refresh the current page to show new data
      await fetchFoodItems(currentPage);
    } catch (err) {
      console.error("Failed to create food item", err);
      toast.error("Failed to create food item.");
      throw err;
    }
  };

  const deleteFoodItem = async (id: number) => {
    try {
      await axiosInstance.delete(`/owners/items/${id}/`);
      toast.success("Food item deleted successfully!");
      // Refresh the current page to show updated data
      await fetchFoodItems(currentPage);
    } catch (err) {
      console.error("Failed to delete food item", err);
      toast.error("Failed to delete food item.");
      throw err;
    }
  };

  const value: OwnerContextType = {
    categories,
    foodItems,
    foodItemsCount,
    currentPage,
    fetchCategories,
    fetchFoodItems,
    updateFoodItem,
    createFoodItem,
    deleteFoodItem,
    setCurrentPage,
  };

  return (
    <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>
  );
};

// Custom hook to consume the context
export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};
