import { TableFoodOrderList } from "@/components/tables";
import { DashboardDropDown, TextSearchBox } from "../../components/input";
import { OrderlistCard, Pagination } from "../../components/utilities";
import { useEffect, useState } from "react";
import { useOwner } from "@/context/ownerContext";
import StripeConnectModal from "../model/StripeConnectModal";

const ScreenRestaurantOrderList = () => {
  const {
    orders = [],
    ordersStats,
    ordersCount,
    ordersCurrentPage,
    ordersSearchQuery,
    fetchOrders,
    setOrdersCurrentPage,
    setOrdersSearchQuery,
  } = useOwner();
  
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [openStripe, setOpenStripe] = useState(false);
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(ordersSearchQuery);
    }, 500);

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
            label="Completed Order Today"
            data={ordersStats?.today_completed_order_count.toString()}
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
            {/* Add Stripe button */}
            <button
              type="button"
              onClick={() => setOpenStripe(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:shadow-xl hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M19.5 7.2c0-3.6-3-5.2-6.4-5.2-2.2 0-4.4.6-6 1.6a.6.6 0 0 0-.3.53v2.26c0 .48.53.78.94.54 1.54-.9 3.36-1.45 5.16-1.45 1.7 0 2.7.64 2.7 1.69 0 2.58-8.2 1.06-8.2 6.22 0 3.05 2.63 4.86 6.24 4.86 2.1 0 4.1-.5 5.6-1.37.2-.11.33-.33.33-.57V13c0-.5-.53-.8-.95-.55-1.38.78-3.1 1.26-4.8 1.26-1.8 0-2.9-.63-2.9-1.65 0-2.8 8.2-1.14 8.2-6.86Z" />
              </svg>
              Add Stripe account
            </button>

            {/* Your search box */}
            <TextSearchBox
              placeholder="Search by Order ID"
              value={ordersSearchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Modal */}
        <StripeConnectModal
          open={openStripe}
          onClose={() => setOpenStripe(false)}
        />
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
