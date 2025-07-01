import { TableFoodOrderList } from "@/components/tables";
import { DashboardDropDown, TextSearchBox } from "../../components/input";
import { OrderlistCard, Pagination } from "../../components/utilities";
import { useEffect, useState } from "react";
import { useOwner } from "@/context/ownerContext";

const ScreenRestaurantOrderList = () => {
  const {
    orders,
    ordersStats,
    ordersCount,
    ordersCurrentPage,
    ordersSearchQuery,
    fetchOrders,
    setOrdersCurrentPage,
    setOrdersSearchQuery,
  } = useOwner();

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  console.log(ordersStats, "orders stats");
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(ordersSearchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [ordersSearchQuery]);

  // Load orders on component mount and when page or debounced search changes
  useEffect(() => {
    fetchOrders(ordersCurrentPage, debouncedSearchQuery);
  }, [ordersCurrentPage, debouncedSearchQuery, fetchOrders]); 

  const handlePageChange = (page: number) => {
    setOrdersCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setOrdersSearchQuery(query);
    setOrdersCurrentPage(1); // Reset to first page when searching
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <OrderlistCard
            label="Ongoing Order"
            data={ordersStats?.ongoing_orders.toString()}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
          />
          {/* Card 2 */}
          <OrderlistCard
            label="Total Orders Today"
            data={ordersStats?.today_completed_order_price.toString()}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
          />
          {/* Card 3 */}
          <OrderlistCard
            label="Completed order"
            data={ordersStats?.total_completed_orders.toString()}
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
          />
        </div>
        {/* Dashboard Content */}
        {/* Header and dropdown */}
        <div className="flex flex-row justify-between items-center gap-y-4 md:gap-y-0 my-3">
          <h2 className="flex-1 text-2xl text-primary-text">List of items</h2>

          <div className="flex-1 flex gap-x-4 flex-row-reverse md:flex-row justify-end">
            {/* Search box by id */}
            <TextSearchBox
              placeholder="Search by Order ID"
              value={ordersSearchQuery}
              onChange={handleSearch}
            />
         
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg">
          <TableFoodOrderList data={orders} />
          <div className="mt-4 flex justify-center">
            <Pagination
              page={ordersCurrentPage}
              total={ordersCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenRestaurantOrderList;
