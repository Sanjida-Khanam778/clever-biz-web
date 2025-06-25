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

// Define device item type
interface DeviceItem {
  id: number;
  table_name: string;
  restaurant: number;
  action: string;
  restaurant_name: string;
  username: string;
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

// Define reservation item type
interface ReservationItem {
  id: number;
  reservationId: string;
  customerName: string;
  tableNo: string;
  guestNo: number;
  cellNumber: string;
  email: string;
  reservationTime: string;
  customRequest: string;
}

// Define reservation status report type
interface ReservationStatusReport {
  total_active_accepted_reservations: number;
  last_month_reservations: number;
  running_month_reservations: number;
}

// Define status summary type
interface StatusSummary {
  available_items_count: number;
  processing_orders_count: number;
  pending_orders_count: number;
}

// Define the context type
interface StaffContextType {
  categories: Category[];
  foodItems: FoodItem[];
  foodItemsCount: number;
  currentPage: number;
  searchQuery: string;
  orders: OrderItem[];
  ordersCount: number;
  ordersCurrentPage: number;
  ordersSearchQuery: string;
  reservations: ReservationItem[];
  reservationsCount: number;
  reservationsCurrentPage: number;
  reservationsSearchQuery: string;
  reservationStatusReport: ReservationStatusReport | null;
  allDevices: DeviceItem[];
  devicesSearchQuery: string;
  devicesCurrentPage: number;
  devicesCount: number;
  statusSummary: StatusSummary | null;
  fetchStatusSummary: () => Promise<void>;
  fetchFoodItems: (page?: number, search?: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setOrdersCurrentPage: (page: number) => void;
  setOrdersSearchQuery: (query: string) => void;
  setReservationsCurrentPage: (page: number) => void;
  setReservationsSearchQuery: (query: string) => void;
  setAllDevices: (devices: DeviceItem[]) => void;
  setDevicesSearchQuery: (query: string) => void;
  setDevicesCurrentPage: (page: number) => void;
}

// Create the context
export const StaffContext = createContext<StaffContextType | undefined>(
  undefined
);

// Create the provider
export const StaffProvider: React.FC<{ children: ReactNode }> = ({
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
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [reservationsCurrentPage, setReservationsCurrentPage] = useState(1);
  const [reservationsSearchQuery, setReservationsSearchQuery] = useState("");
  const [reservationStatusReport, setReservationStatusReport] =
    useState<ReservationStatusReport | null>(null);
  const [allDevices, setAllDevices] = useState<DeviceItem[]>([]);
  const [devicesSearchQuery, setDevicesSearchQuery] = useState("");
  const [devicesCurrentPage, setDevicesCurrentPage] = useState(1);
  const [devicesCount, setDevicesCount] = useState(0);
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(
    null
  );

  const fetchStatusSummary = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/staff/items/status-summary/");
      setStatusSummary(response.data);
      console.log(response.data,"summary")
    } catch (error: any) {
      console.error("Failed to load status summary", error);
      // Only show toast for non-auth errors since interceptor handles auth
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load status summary.");
      }
    }
  }, []);

  const fetchFoodItems = useCallback(
    async (page: number = currentPage, search?: string) => {
      try {
        const response = await axiosInstance.get(
          `/staff/items/?page=${page}&search=${search || ""}`
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
      } catch (error: any) {
        console.error("Failed to load food items", error);
        // Only show toast for non-auth errors since interceptor handles auth
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          toast.error("Failed to load food items.");
        }
      }
    },
    [currentPage]
  );

  const value: StaffContextType = {
    categories,
    foodItems,
    foodItemsCount,
    currentPage,
    searchQuery,
    orders,
    ordersCount,
    ordersCurrentPage,
    ordersSearchQuery,
    reservations,
    reservationsCount,
    reservationsCurrentPage,
    reservationsSearchQuery,
    reservationStatusReport,
    allDevices,
    devicesSearchQuery,
    devicesCurrentPage,
    devicesCount,
    statusSummary,
    fetchStatusSummary,
    fetchFoodItems,
    setCurrentPage,
    setSearchQuery,
    setOrdersCurrentPage,
    setOrdersSearchQuery,
    setReservationsCurrentPage,
    setReservationsSearchQuery,
    setAllDevices,
    setDevicesSearchQuery,
    setDevicesCurrentPage,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};

// Custom hook to consume the context
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};
