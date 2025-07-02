import { MonthlyChart, YearlyChart } from "@/components/charts";
import { ButtonAdd, TextSearchBox } from "../../components/input";
import {
  DashboardCard,
  DashboardMostSellingItems,
  Pagination,
  TableFoodList,
} from "../../components/utilities";
import { useEffect, useState, useCallback } from "react";
import { EditCategoryModal, EditFoodItemModal } from "@/components/modals";
import { IconGrowth, IconSales, IconTeam } from "@/components/icons";
import { useOwner } from "@/context/ownerContext";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const ScreenRestaurantDashboard = () => {
  const {
    foodItems,
    foodItemsCount,
    currentPage,
    searchQuery,
    fetchFoodItems,
    setCurrentPage,
    setSearchQuery,
  } = useOwner();

  const [categoryModal, setShowCategoryModal] = useState(false);
  const [foodItemModal, setShowFoodItemModal] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sellingItemData, setSellingItemData] = useState([]);

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const showFoodItemAddModal = () => setShowFoodItemModal(true);
  const showCategoryAddModal = () => setShowCategoryModal(true);
  const closeFoodItemModal = () => setShowFoodItemModal(false);
  const closeCaegoryModal = () => setShowCategoryModal(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load food items on component mount and when page or debounced search changes
  useEffect(() => {
    fetchFoodItems(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, fetchFoodItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Fetch most selling items
  const fetchMostSellingItems = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/owners/most-selling-items/");
      setSellingItemData(response.data);
    } catch (error) {
      console.error("Failed to fetch most selling items:", error);
      toast.error("Failed to load most selling items.");
    }
  }, []);

  // Load most selling items on component mount
  useEffect(() => {
    fetchMostSellingItems();
  }, [fetchMostSellingItems]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const response = await axiosInstance.get("/owners/orders/analytics/");
      setAnalytics(response.data);
    } catch (error) {
      setAnalyticsError("Failed to load analytics data.");
      toast.error("Failed to load analytics data.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          <DashboardCard
            icon={<IconSales />}
            label="Total Sells today"
            data={
              analyticsLoading
                ? "..."
                : analytics?.status?.today_total_completed_order_price
                ? `$${analytics.status.today_total_completed_order_price}`
                : "$0"
            }
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
            tail={analyticsLoading ? "" : analytics?.status ? "" : "(0)"}
          />
          <DashboardCard
            icon={<IconGrowth />}
            label="Weekly growth"
            data={
              analyticsLoading
                ? "..."
                : analytics?.status?.weekly_growth !== undefined
                ? `$${analytics.status.weekly_growth}`
                : "$0"
            }
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
            tail={
              analyticsLoading
                ? ""
                : analytics?.status?.weekly_growth !== undefined
                ? `${analytics.status.weekly_growth}%`
                : "0%"
            }
          />
          <DashboardCard
            icon={<IconTeam />}
            label="Total member"
            data={
              analyticsLoading
                ? "..."
                : analytics?.status?.total_member !== undefined
                ? `${analytics.status.total_member}`
                : "0"
            }
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
            tail="Team"
          />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-3 mt-4 z-10 gap-x-4">
          <div className="col-span-3 bg-sidebar rounded-xl p-4 w-full h-[600px] ">
            <YearlyChart
              title="Sales Report"
              firstData={
                analyticsLoading
                  ? Array(12).fill(0)
                  : analytics?.current_year
                  ? Object.values(analytics.current_year)
                  : Array(12).fill(0)
              }
              secondData={
                analyticsLoading
                  ? Array(12).fill(0)
                  : analytics?.last_year
                  ? Object.values(analytics.last_year)
                  : Array(12).fill(0)
              }
            />
          </div>
        </div>
        {/* Search + Add Buttons */}
        <div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-4 items-start mt-4">
          <div className="col-span-2 flex items-center justify-end mb-4 gap-x-4">
            <TextSearchBox
              placeholder="Search by Name"
              className="flex-1 max-w-none"
              value={searchQuery}
              onChange={handleSearch}
            />
            <ButtonAdd label="Add Items" onClick={showFoodItemAddModal} />
            <ButtonAdd label="Add Category" onClick={showCategoryAddModal} />
          </div>

          {/* Table */}
          <div className="col-span-2 bg-sidebar p-4 rounded-lg">
            <TableFoodList data={foodItems} />
            <div className="mt-4 flex justify-center">
              <Pagination
                page={currentPage}
                total={foodItemsCount}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

          {/* Most Selling Items */}
          <div className="h-full col-span-1 row-span-2 col-start-3 col-end-4 row-start-1 row-end-3 bg-sidebar rounded-xl p-4 flex flex-col">
            <h6 className="text-xl text-primary-text">Most Selling Items</h6>
            <DashboardMostSellingItems
              containerProps={{
                className: "mt-8 gap-y-4",
              }}
              data={sellingItemData}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditFoodItemModal isOpen={foodItemModal} close={closeFoodItemModal} />
      <EditCategoryModal
        isOpen={categoryModal}
        close={closeCaegoryModal}
        onSuccess={fetchFoodItems}
      />
    </>
  );
};

export default ScreenRestaurantDashboard;
