import axiosInstance from "@/lib/axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
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
  searchQuery: string;
  fetchCategories: () => Promise<void>;
  fetchFoodItems: (page?: number, search?: string) => Promise<void>;
  updateFoodItem: (id: number, formData: FormData) => Promise<void>;
  createFoodItem: (formData: FormData) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
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
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        "http://192.168.10.150:8000/owners/categories/"
      );
      setCategories(res.data.results);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories.");
    }
  }, []);

  const fetchFoodItems = useCallback(
    async (page: number = currentPage, search?: string) => {
      try {
        const response = await axiosInstance.get(
          `/owners/items/?page=${page}&search=${search || ""}`
        );
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
    },
    []
  );

  const updateFoodItem = useCallback(
    async (id: number, formData: FormData) => {
      try {
        await axiosInstance.patch(`/owners/items/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Food item updated successfully!");
        // Refresh the current page to show updated data
        await fetchFoodItems(currentPage, searchQuery);
      } catch (err) {
        console.error("Failed to update food item", err);
        toast.error("Failed to update food item.");
        throw err;
      }
    },
    [fetchFoodItems, currentPage, searchQuery]
  );

  const createFoodItem = useCallback(
    async (formData: FormData) => {
      try {
        await axiosInstance.post("/owners/items/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Food item created successfully!");
        // Refresh the current page to show new data
        await fetchFoodItems(currentPage, searchQuery);
      } catch (err) {
        console.error("Failed to create food item", err);
        toast.error("Failed to create food item.");
        throw err;
      }
    },
    [fetchFoodItems, currentPage, searchQuery]
  );

  const deleteFoodItem = useCallback(
    async (id: number) => {
      try {
        await axiosInstance.delete(`/owners/items/${id}/`);
        toast.success("Food item deleted successfully!");
        // Refresh the current page to show updated data
        await fetchFoodItems(currentPage, searchQuery);
      } catch (err) {
        console.error("Failed to delete food item", err);
        toast.error("Failed to delete food item.");
        throw err;
      }
    },
    [fetchFoodItems, currentPage, searchQuery]
  );

  const value: OwnerContextType = {
    categories,
    foodItems,
    foodItemsCount,
    currentPage,
    searchQuery,
    fetchCategories,
    fetchFoodItems,
    updateFoodItem,
    createFoodItem,
    deleteFoodItem,
    setCurrentPage,
    setSearchQuery,
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
