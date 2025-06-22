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

// Define order item type
interface OrderItem {
  id: number;
  userName: string;
  guestNo: number;
  tableNo: string;
  orderedItems: number;
  timeOfOrder: string;
  orderId: string;
  status:
    | "Pending"
    | "Completed"
    | "Delivered"
    | "Cancelled"
    | "In Progress"
    | "Processing";
}

// Define the context type
interface OwnerContextType {
  categories: Category[];
  foodItems: FoodItem[];
  foodItemsCount: number;
  currentPage: number;
  searchQuery: string;
  orders: OrderItem[];
  ordersCount: number;
  ordersCurrentPage: number;
  ordersSearchQuery: string;
  fetchCategories: () => Promise<void>;
  fetchFoodItems: (page?: number, search?: string) => Promise<void>;
  fetchOrders: (page?: number, search?: string) => Promise<void>;
  updateFoodItem: (id: number, formData: FormData) => Promise<void>;
  createFoodItem: (formData: FormData) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  updateAvailability: (id: number, available: boolean) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setOrdersCurrentPage: (page: number) => void;
  setOrdersSearchQuery: (query: string) => void;
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
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ordersSearchQuery, setOrdersSearchQuery] = useState("");

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

  const fetchOrders = useCallback(
    async (page: number = ordersCurrentPage, search?: string) => {
      try {
        const response = await axiosInstance.get(
          `/owners/orders/?page=${page}&search=${search || ""}`
        );
        const { results, count } = response.data;
        console.log("Fetched orders:", response.data);
        const formattedOrders = results.orders?.map((item: any) => ({
          id: item.id,
          userName: item.userName,
          guestNo: item.guestNo,
          tableNo: item.tableNo,
          orderedItems: item.orderedItems,
          timeOfOrder: item.timeOfOrder,
          orderId: item.orderId,
          status: item.status,
        }));

        setOrders(formattedOrders);
        setOrdersCount(count || 0);
        setOrdersCurrentPage(page);
      } catch (error) {
        console.error("Failed to load orders", error);
        toast.error("Failed to load orders.");
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

  const updateAvailability = useCallback(
    async (id: number, available: boolean) => {
      try {
        await axiosInstance.patch(`/owners/items/${id}/`, {
          availability: available.toString(),
        });
        toast.success("Food item availability updated successfully!");
        // Refresh the current page to show updated data
        await fetchFoodItems(currentPage, searchQuery);
      } catch (err) {
        console.error("Failed to update food item availability", err);
        toast.error("Failed to update food item availability.");
        throw err;
      }
    },
    [fetchFoodItems, currentPage, searchQuery]
  );

  const updateOrderStatus = useCallback(
    async (id: number, status: string) => {
      try {
        await axiosInstance.patch(`/owners/orders/${id}/`, {
          status: status,
        });
        toast.success("Order status updated successfully!");
        // Refresh the current page to show updated data
        await fetchOrders(ordersCurrentPage, ordersSearchQuery);
      } catch (err) {
        console.error("Failed to update order status", err);
        toast.error("Failed to update order status.");
        throw err;
      }
    },
    [fetchOrders, ordersCurrentPage, ordersSearchQuery]
  );

  const value: OwnerContextType = {
    categories,
    foodItems,
    foodItemsCount,
    currentPage,
    searchQuery,
    orders,
    ordersCount,
    ordersCurrentPage,
    ordersSearchQuery,
    fetchCategories,
    fetchFoodItems,
    fetchOrders,
    updateFoodItem,
    createFoodItem,
    deleteFoodItem,
    updateAvailability,
    updateOrderStatus,
    setCurrentPage,
    setSearchQuery,
    setOrdersCurrentPage,
    setOrdersSearchQuery,
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
