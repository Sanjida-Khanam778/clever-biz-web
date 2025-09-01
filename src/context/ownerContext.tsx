import axiosInstance from "@/lib/axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useRole } from "@/hooks/useRole";
import { Member } from "@/types";

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
  status: "Pending" | "Completed" | "Served" | "Cancelled" | "Preparing";
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

// Define device stats type
interface DeviceStats {
  total_devices: number;
  active_devices: number;
  hold_devices: number;
  restaurant: string;
}

interface OrdersStats {
  total_ongoing_orders: number;
  ongoing_orders: number;
  today_completed_order_count: number;
  total_completed_orders: number;
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
  reservations: ReservationItem[];
  reservationsCount: number;
  reservationsCurrentPage: number;
  reservationsSearchQuery: string;
  reservationStatusReport: ReservationStatusReport | null;
  allDevices: DeviceItem[];
  devicesSearchQuery: string;
  devicesCurrentPage: number;
  devicesCount: number;
  ordersStats: OrdersStats | null;
  deviceStats: DeviceStats | null;
  members: Member[];
  membersSearchQuery: string;
  fetchCategories: () => Promise<void>;
  fetchFoodItems: (page?: number, search?: string) => Promise<void>;
  fetchOrders: (page?: number, search?: string) => Promise<void>;
  fetchReservations: (
    page?: number,
    search?: string,
    date?: string
  ) => Promise<void>;
  fetchReservationStatusReport: () => Promise<void>;
  fetchAllDevices: (page?: number, search?: string) => Promise<void>;
  fetchDeviceStats: () => Promise<void>;
  fetchMembers: (search?: string) => Promise<void>;
  createMember: (formData: FormData) => Promise<void>;
  updateMemberStatus: (id: number, action: string) => Promise<void>;
  updateFoodItem: (id: number, formData: FormData) => Promise<void>;
  createFoodItem: (formData: FormData) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  updateAvailability: (id: number, available: boolean) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  updateReservationStatus: (id: number, status: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setOrdersCurrentPage: (page: number) => void;
  setOrdersSearchQuery: (query: string) => void;
  setReservationsCurrentPage: (page: number) => void;
  setReservationsSearchQuery: (query: string) => void;
  setAllDevices: (devices: DeviceItem[]) => void;
  setDevicesSearchQuery: (query: string) => void;
  setDevicesCurrentPage: (page: number) => void;
  setMembersSearchQuery: (query: string) => void;
  updateDeviceStatus: (id: number, action: string) => Promise<void>;
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setReservations: React.Dispatch<React.SetStateAction<ReservationItem[]>>;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

// Create the context
export const OwnerContext = createContext<OwnerContextType | undefined>(
  undefined
);

// Create the provider
export const OwnerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userRole, isLoading } = useRole();

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
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [ordersStats, setOrdersStats] = useState<OrdersStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersSearchQuery, setMembersSearchQuery] = useState("");

  // Auto-fetch categories when userRole becomes available
  useEffect(() => {
    if (!isLoading && userRole) {
      // Fetch categories directly here to avoid dependency issues
      const fetchCategoriesDirectly = async () => {
        try {
          let endpoint;
          if (userRole === "owner") {
            endpoint = "/owners/categories/";
          } else if (userRole === "staff") {
            endpoint = "/staff/categories/";
          } else if (userRole === "chef") {
            endpoint = "/chef/categories/";
          } else {
            throw new Error("Invalid user role");
          }

          const res = await axiosInstance.get(endpoint);
          setCategories(res.data);
        } catch (err) {
          console.error("Failed to load categories.");
        }
      };
      fetchCategoriesDirectly();
    }
  }, [userRole, isLoading]);

  const fetchCategories = useCallback(async () => {
    // Don't fetch if still loading or if userRole is null
    if (isLoading || !userRole) {
      return;
    }

    try {
      let endpoint;
      if (userRole === "owner") {
        endpoint = "/owners/categories/";
      } else if (userRole === "staff") {
        endpoint = "/staff/categories/";
      } else if (userRole === "chef") {
        endpoint = "/chef/categories/";
      } else {
        throw new Error("Invalid user role");
      }

      const res = await axiosInstance.get(endpoint);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories.");
    }
  }, [userRole, isLoading]);

  const fetchFoodItems = useCallback(
    async (page: number = currentPage, search?: string) => {
      // Don't fetch if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        let endpoint;
        if (userRole === "owner") {
          endpoint = `/owners/items/?page=${page}&search=${search || ""}`;
        } else if (userRole === "staff") {
          endpoint = `/staff/items/?page=${page}&search=${search || ""}`;
        } else if (userRole === "chef") {
          endpoint = `/chef/items/?page=${page}&search=${search || ""}`;
        } else {
          throw new Error("Invalid user role");
        }

        const response = await axiosInstance.get(endpoint);
        const { results, count } = response.data;
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
        // toast.error("Failed to load food items.");
      }
    },
    [currentPage, userRole, isLoading]
  );

  const fetchOrders = useCallback(async (page?: number, search?: string) => {
    try {
      // const params: Record<string, any> = {
      //   page, // ?page=1,2,3...
      //   page_size: PAGE_SIZE, // ?page_size=5
      // };
      // if (search.trim()) params.restaurant_name = search.trim();
      const endpoint = `/owners/orders/`;
      const response = await axiosInstance.get(endpoint, {
        params: { page: page, search: search },
      });
      const { results, count } = response.data;
      console.log("Fetched orders:", { page, search });
      setOrdersStats(results.stats);

      // Handle both array and object with orders property
      const ordersData = Array.isArray(results)
        ? results
        : results?.orders || [];

      setOrders(ordersData);
      setOrdersCount(count || 0);
      setOrdersCurrentPage(page || 1);
    } catch (error: any) {
      console.error("Failed to load orders", error);
      // Only show toast for non-auth errors since interceptor handles auth
    }
  }, []);
  // const fetchOrders = useCallback(async (page?: number, search?: string) => {
  //   try {
  //     const endpoint = `/owners/orders/`;

  //     const response = await axiosInstance.get(endpoint, {
  //       params: {
  //         page: page || 1,
  //         ...(search?.trim() ? { restaurant_name: search.trim() } : {}), // ✅ only include if not empty
  //       },
  //     });

  //     console.log("Fetching orders with:", { page, search });
  //     console.log("API response:", response.data);

  //     const { results, count } = response.data;

  //     if (!Array.isArray(results) && results?.stats) {
  //       setOrdersStats(results.stats);
  //     }

  //     const ordersData = Array.isArray(results)
  //       ? results
  //       : results?.orders || [];

  //     setOrders(ordersData);
  //     setOrdersCount(count || 0);
  //     setOrdersCurrentPage(page || 1);
  //   } catch (error: any) {
  //     console.error("Failed to load orders", error);
  //   }
  // }, []);

  const fetchReservations = useCallback(
    async (
      page: number = reservationsCurrentPage,
      search?: string,
      date?: string
    ) => {
      // Don't fetch if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        let endpoint =
          userRole === "owner"
            ? `/owners/reservations/?page=${page}&search=${search || ""}`
            : `/staff/reservations/?page=${page}&search=${search || ""}`;

        // Add date parameter if provided
        if (date) {
          endpoint += `&date=${date}`;
        }

        const response = await axiosInstance.get(endpoint);
        console.log(response, "response from fetch reservations");
        const { results, count } = response.data;
        const formattedReservations = results?.map((item: any) => ({
          id: item.id,
          customerName: item.customer_name,
          tableNo: item.device,
          guestNo: item.guest_no,
          cellNumber: item.cell_number,
          email: item.email,
          reservationTime: item.reservation_time,
          customRequest: item.status,
        }));

        setReservations(formattedReservations);
        setReservationsCount(count || 0);
        setReservationsCurrentPage(page);
      } catch (error) {
        console.error("Failed to load reservations", error);
        toast.error("Failed to load reservations.");
      }
    },
    [reservationsCurrentPage, userRole, isLoading]
  );

  const fetchReservationStatusReport = useCallback(async () => {
    // Don't fetch if still loading or if userRole is null

    if (isLoading || !userRole) {
      return;
    }

    try {
      const endpoint =
        userRole === "owner"
          ? "/owners/reservations/report-reservation-status/"
          : "/staff/reservations/report-reservation-status/";

      const response = await axiosInstance.get(endpoint);
      setReservationStatusReport(response.data);
    } catch (error) {
      console.error("Failed to load reservation status report", error);
      toast.error("Failed to load reservation status report.");
    }
  }, [userRole, isLoading]);
  const fetchOrdersStats = useCallback(async () => {
    // Don't fetch if still loading or if userRole is null

    if (isLoading || !userRole) {
      return;
    }

    try {
      const endpoint =
        userRole === "owner" ? "/owners/orders/" : "/staff/orders/";

      const response = await axiosInstance.get(endpoint);
      setReservationStatusReport(response.data);
    } catch (error) {
      console.error("Failed to load reservation status report", error);
      toast.error("Failed to load reservation status report.");
    }
  }, [userRole, isLoading]);

  const fetchAllDevices = useCallback(
    async (page: number = devicesCurrentPage, search?: string) => {
      // Don't fetch if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        const searchParam = search || devicesSearchQuery;
        const endpoint =
          userRole === "owner"
            ? `/owners/devices/?page=${page}&search=${searchParam}`
            : `/staff/devices/?page=${page}&search=${searchParam}`;

        const response = await axiosInstance.get(endpoint);
        console.log(response, "response");
        const devices = Array.isArray(response.data?.results)
          ? response.data?.results
          : [];
        setAllDevices(devices);
        setDevicesCount(response.data?.count || 0);
        setDevicesCurrentPage(page);
      } catch (error) {
        console.error("Failed to load devices", error);
        toast.error("Failed to load devices.");
      }
    },
    [devicesCurrentPage, devicesSearchQuery, userRole, isLoading]
  );

  const fetchDeviceStats = useCallback(async () => {
    // Don't fetch if still loading or if userRole is null
    if (isLoading || !userRole) {
      return;
    }

    try {
      const endpoint =
        userRole === "owner"
          ? "/owners/devices/stats/"
          : "/staff/devices/stats/";

      const response = await axiosInstance.get(endpoint);
      setDeviceStats(response.data);
    } catch (error) {
      console.error("Failed to load device stats", error);
      toast.error("Failed to load device stats.");
    }
  }, [userRole, isLoading]);

  const fetchMembers = useCallback(
    async (search?: string) => {
      if (isLoading || !userRole) {
        return;
      }

      try {
        const searchParam = search || membersSearchQuery;
        const endpoint = `/owners/chef-staff/?search=${searchParam}`;
        const response = await axiosInstance.get(endpoint);
        setMembers(response.data.results || []);
      } catch (error) {
        console.error("Failed to load members", error);
        toast.error("Failed to load members.");
      }
    },
    [userRole, isLoading, membersSearchQuery]
  );

  const createMember = useCallback(
    async (formData: FormData) => {
      if (isLoading || !userRole) {
        return;
      }

      try {
        await axiosInstance.post("/owners/chef-staff/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Member created successfully!");
        // Refresh the members list
        await fetchMembers();
      } catch (error: any) {
        console.error("Failed to create member", error);
        toast.error(error.response?.data?.email || "Failed to create member.");
        throw error;
      }
    },
    [userRole, isLoading, fetchMembers]
  );

  const updateMemberStatus = useCallback(
    async (id: number, action: string) => {
      if (isLoading || !userRole) {
        return;
      }

      try {
        await axiosInstance.patch(`/owners/chef-staff/${id}/`, {
          action: action.toLowerCase(),
        });
        toast.success("Member status updated successfully!");
        // Update local state immediately for instant feedback
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === id
              ? { ...member, action: action.toLowerCase() }
              : member
          )
        );
      } catch (error) {
        console.error("Failed to update member status", error);
        toast.error("Failed to update member status.");
        throw error;
      }
    },
    [userRole, isLoading]
  );

  const updateFoodItem = useCallback(
    async (id: number, formData: FormData) => {
      // Don't update if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }
      console.log(userRole, "user role in update food item");
      try {
        let endpoint;
        if (userRole === "owner") {
          endpoint = `/owners/items/${id}/`;
        } else if (userRole === "staff") {
          endpoint = `/staff/items/${id}/`;
        } else if (userRole === "chef") {
          endpoint = `/chef/items/${id}/`;
        } else {
          throw new Error("Invalid user role");
        }

        await axiosInstance.patch(endpoint, formData, {
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
    [fetchFoodItems, currentPage, searchQuery, userRole, isLoading]
  );

  const createFoodItem = useCallback(
    async (formData: FormData) => {
      // Don't create if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        const endpoint =
          userRole === "owner" ? "/owners/items/" : "/staff/items/";

        await axiosInstance.post(endpoint, formData, {
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
    [fetchFoodItems, currentPage, searchQuery, userRole, isLoading]
  );

  const deleteFoodItem = useCallback(
    async (id: number) => {
      // Don't delete if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        // Use role-based API endpoint
        let endpoint;
        if (userRole === "owner") {
          endpoint = `/owners/items/${id}/`;
        } else if (userRole === "staff") {
          endpoint = `/staff/items/${id}/`;
        } else if (userRole === "chef") {
          endpoint = `/chef/items/${id}/`;
        } else {
          throw new Error("Invalid user role");
        }

        await axiosInstance.delete(endpoint);
        toast.success("Food item deleted successfully!");
        // Refresh the current page to show updated data
        await fetchFoodItems(currentPage, searchQuery);
      } catch (err) {
        console.error("Failed to delete food item", err);
        toast.error("Failed to delete food item.");
        throw err;
      }
    },
    [fetchFoodItems, currentPage, searchQuery, userRole, isLoading]
  );

  const updateAvailability = useCallback(
    async (id: number, available: boolean) => {
      // Don't update if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        let endpoint;
        if (userRole === "owner") {
          endpoint = `/owners/items/${id}/`;
        } else if (userRole === "staff") {
          endpoint = `/staff/items/${id}/`;
        } else if (userRole === "chef") {
          endpoint = `/chef/items/${id}/`;
        } else {
          throw new Error("Invalid user role");
        }

        await axiosInstance.patch(endpoint, {
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
    [fetchFoodItems, currentPage, searchQuery, userRole, isLoading]
  );

  const updateOrderStatus = useCallback(
    async (id: number, status: string) => {
      // Don't update if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        let endpoint;
        if (userRole === "owner") {
          endpoint = `/owners/orders/status/${id}/`;
        } else if (userRole === "staff") {
          endpoint = `/staff/orders/status/${id}/`;
        } else if (userRole === "chef") {
          endpoint = `/chef/orders/status/${id}/`;
        } else {
          throw new Error("Invalid user role");
        }

        const response = await axiosInstance.patch(endpoint, {
          status: status.toLowerCase(),
        });

        toast.success("Order status updated successfully!");

        // Update local orders state immediately for instant feedback
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: status as any } : order
          )
        );

        // Optionally refresh the orders list
        // await fetchOrders(ordersCurrentPage, ordersSearchQuery);
      } catch (err) {
        console.error("Failed to update order status", err);
        toast.error("Failed to update order status.");
        throw err;
      }
    },
    [userRole, isLoading, setOrders]
  );

  const updateReservationStatus = useCallback(
    async (id: number, status: string) => {
      // Don't update if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        const endpoint =
          userRole === "owner"
            ? `/owners/reservations/${id}/`
            : `/staff/reservations/${id}/`;

        const response = await axiosInstance.patch(endpoint, {
          status: status.toLowerCase(),
        });

        toast.success("Reservation status updated successfully!");

        // Update local reservations state immediately for instant feedback
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id
              ? { ...reservation, customRequest: status as any }
              : reservation
          )
        );

        // Optionally refresh the reservations list
        // await fetchReservations(reservationsCurrentPage, reservationsSearchQuery);
      } catch (err) {
        console.error("Failed to update reservation status", err);
        toast.error("Failed to update reservation status.");
        throw err;
      }
    },
    [userRole, isLoading, setReservations]
  );

  const updateDeviceStatus = useCallback(
    async (id: number, action: string) => {
      // Don't update if still loading or if userRole is null
      if (isLoading || !userRole) {
        return;
      }

      try {
        const endpoint =
          userRole === "owner"
            ? `/owners/devices/${id}/`
            : `/staff/devices/${id}/`;

        await axiosInstance.patch(endpoint, { action });
        toast.success("Device status updated successfully!");
        // Refresh both device list and stats
        await Promise.all([
          fetchAllDevices(devicesCurrentPage, devicesSearchQuery),
          fetchDeviceStats(),
        ]);
      } catch (err) {
        console.error("Failed to update device status", err);
        toast.error("Failed to update device status.");
        throw err;
      }
    },
    [
      fetchAllDevices,
      fetchDeviceStats,
      devicesCurrentPage,
      devicesSearchQuery,
      userRole,
      isLoading,
    ]
  );

  const value: OwnerContextType = {
    categories,
    foodItems,
    foodItemsCount,
    currentPage,
    searchQuery,
    orders,
    ordersStats,
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
    deviceStats,
    members,
    membersSearchQuery,
    fetchCategories,
    fetchFoodItems,
    fetchOrders,
    fetchReservations,
    fetchReservationStatusReport,
    fetchAllDevices,
    fetchDeviceStats,
    fetchMembers,
    createMember,
    updateMemberStatus,
    updateFoodItem,
    createFoodItem,
    deleteFoodItem,
    updateAvailability,
    updateOrderStatus,
    updateReservationStatus,
    setCurrentPage,
    setSearchQuery,
    setOrdersCurrentPage,
    setOrdersSearchQuery,
    setReservationsCurrentPage,
    setReservationsSearchQuery,
    setAllDevices,
    setDevicesSearchQuery,
    setDevicesCurrentPage,
    setMembersSearchQuery,
    updateDeviceStatus,
    setOrders,
    setReservations,
    setMembers,
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

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  // Example: 26 Jun 2025, 11:03 AM
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
