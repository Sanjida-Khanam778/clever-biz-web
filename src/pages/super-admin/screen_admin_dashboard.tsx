import { IconGrowth, IconSales, IconTeam } from "@/components/icons";
import { DashboardCard } from "../../components/utilities";
import { subscribers, TableSubscriberList } from "./screen_admin_management";
import { MonthlyChart, YearlyChart } from "@/components/charts";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { ClockFading } from "lucide-react";

const ScreenAdminDashboard = () => {
  type DashboardStats = {
    last_week_all_order_growth: number;
    last_week_all_order_price: number;
    total_active_restaurant: number;
    total_all_restaurant_order_sells: number;
    total_all_restaurant_order_sells_price: number;
  };
  type MonthlySale = {
    month: string;
    total_orders: number;
    total_sales: number;
  };

  type SalesData = {
    year: number;
    monthly_sales: MonthlySale[];
  };

  const [restaurantData, setRestaurantData] = useState([]);
  const [state, setState] = useState<DashboardStats>({
    last_week_all_order_growth: 0,
    last_week_all_order_price: 0,
    total_active_restaurant: 0,
    total_all_restaurant_order_sells: 0,
    total_all_restaurant_order_sells_price: 0,
  });
  const [salesData, setSalesData] = useState<SalesData>({
    year: 2025,
    monthly_sales: [
      { month: "", total_orders: 0, total_sales: 0 },
      { month: "", total_orders: 0, total_sales: 0 },
    ],
  });
  const [lastSalesData, setLastSalesData] = useState<SalesData>({
    year: 2025,
    monthly_sales: [
      { month: "", total_orders: 0, total_sales: 0 },
      { month: "", total_orders: 0, total_sales: 0 },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("adminapi/restaurants/");
      const data = await res.data.results;
      setRestaurantData(data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        "/adminapi/restaurants/more_summary/"
      );
      const data = await res.data;
      setState(data);
      // console.log(res.data, "res.data");
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        "/adminapi/restaurants/yearly_sells_report/"
      );
      const data = await res.data;

      setSalesData(data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        "/adminapi/restaurants/last_yearly_sells_report/"
      );
      const data = await res.data;
      setLastSalesData(data);
      console.log(lastSalesData, "lastSalesData");
    };
    fetchData();
  }, []);
  // console.log(state);
  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <DashboardCard
            icon={<IconSales />}
            label="Total Sells today"
            data={`${state.total_all_restaurant_order_sells_price.toString()}$`}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
            tail={state.total_all_restaurant_order_sells.toString()}
          />
          {/* Card 2 */}
          <DashboardCard
            icon={<IconGrowth />}
            label="Weekly growth"
            data={`${state.last_week_all_order_price.toString()}$`}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
            tail={`${state.last_week_all_order_growth.toString()}%`}
          />
          {/* Card 3 */}
          <DashboardCard
            icon={<IconTeam />}
            label="Total Subscriber"
            data={`${state.total_active_restaurant.toString()}`}
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
            tail="User"
          />
        </div>
        {/* Dashboard Content */}
        <div className="w-full  mt-4 z-10 gap-x-4">
          <div className="col-span-2 bg-sidebar rounded-xl p-4">
            <YearlyChart
              title="Sales Report"
              firstData={salesData.monthly_sales.map(
                (item) => item.total_orders
              )} // 👈 orders
              secondData={lastSalesData.monthly_sales.map(
                (item) => item.total_orders
              )} // 👈 orders
              // secondData={[56, 12, 89, 27, 33, 84, 3, 4, 55, 34, 34, 10]}
            />
          </div>
          {/* <div className="col-span-1 bg-sidebar rounded-xl p-4 flex justify-center items-center">
            <MonthlyChart
              title="Subscriber Flow"
              firstData={[15, 30, 45, 60]}
              secondData={[152, 303, 451, 603]}
            />
          </div> */}
          <div className="col-span-1"></div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg mt-4">
          <TableSubscriberList subscribers={restaurantData} />
        </div>
      </div>
    </>
  );
};

export default ScreenAdminDashboard;
