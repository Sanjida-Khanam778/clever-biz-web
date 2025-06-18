import { IconGrowth, IconSales, IconTeam } from "@/components/icons";
import { DashboardCard } from "../../components/utilities";
import { subscribers, TableSubscriberList } from "./screen_admin_management";
import { MonthlyChart, YearlyChart } from "@/components/charts";

const ScreenAdminDashboard = () => {
  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <DashboardCard
            icon={<IconSales />}
            label="Total Sells today"
            data={"$100k"}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
            tail="(45)"
          />
          {/* Card 2 */}
          <DashboardCard
            icon={<IconGrowth />}
            label="Weekly growth"
            data={"$1230"}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
            tail="19.91%"
          />
          {/* Card 3 */}
          <DashboardCard
            icon={<IconTeam />}
            label="Total Subscriber"
            data={"12"}
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
            tail="User"
          />
        </div>
        {/* Dashboard Content */}
        <div className="grid grid-cols-3 mt-4 z-10 gap-x-4">
          <div className="col-span-2 bg-sidebar rounded-xl p-4">
            <YearlyChart
              title="Sales Report"
              firstData={[30, 50, 60, 20, 40, 60, 70, 20, 50, 4, 12, 200]}
              secondData={[56, 12, 89, 27, 33, 84, 3, 4, 55, 34, 34, 10]}
            />
          </div>
          <div className="col-span-1 bg-sidebar rounded-xl p-4 flex justify-center items-center">
            <MonthlyChart
              title="Subscriber Flow"
              firstData={[15, 30, 45, 60]}
              secondData={[152, 303, 451, 603]}
            />
          </div>
          <div className="col-span-1"></div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg mt-4">
          <TableSubscriberList subscribers={subscribers} />
        </div>
      </div>
    </>
  );
};

export default ScreenAdminDashboard;
