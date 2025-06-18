import { TableFoodOrderList } from "@/components/tables";
import { DashboardDropDown, TextSearchBox } from "../../components/input";
import { OrderlistCard, Pagination } from "../../components/utilities";

const ScreenStaffOrderList = () => {
  const orderTableData: OrderItem[] = [
    {
      userName: "ISSE -144",
      guestNo: 4,
      tableNo: "2B",
      orderedItems: 4,
      timeOfOrder: "9.30AM",
      orderId: "1122a456",
      status: "Processing",
    },
    {
      userName: "Bakso",
      guestNo: 5,
      tableNo: "3C",
      orderedItems: 5,
      timeOfOrder: "9.30AM",
      orderId: "1122a456",
      status: "Processing",
    },
    {
      userName: "Satay",
      guestNo: 3,
      tableNo: "5B",
      orderedItems: 3,
      timeOfOrder: "9.30PM",
      orderId: "1122a456",
      status: "Delivered",
    },
    {
      userName: "Pepes",
      guestNo: 4,
      tableNo: "4A",
      orderedItems: 4,
      timeOfOrder: "9.30AM",
      orderId: "1122a456",
      status: "Processing",
    },
    {
      userName: "Sate Padang",
      guestNo: 4,
      tableNo: "2A",
      orderedItems: 4,
      timeOfOrder: "9.30AM",
      orderId: "1122a456",
      status: "Cancelled",
    },
    {
      userName: "Babi Pangang",
      guestNo: 2,
      tableNo: "3B",
      orderedItems: 2,
      timeOfOrder: "12.30AM",
      orderId: "1122a456",
      status: "Pending",
    },
    {
      userName: "Soto",
      guestNo: 1,
      tableNo: "2A",
      orderedItems: 1,
      timeOfOrder: "9.30AM",
      orderId: "1122a456",
      status: "Pending",
    },
  ];
  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <OrderlistCard
            label="Ongoing Order"
            data={"100"}
            accentColor="#6B8CED"
            gradientStart="#6189FF"
            gradientEnd="#161F42"
          />
          {/* Card 2 */}
          <OrderlistCard
            label="Completed order"
            data={"20"}
            accentColor="#48E03A"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
          />
        </div>
        {/* Dashboard Content */}
        {/* Header and dropdown */}
        <div className="flex flex-row justify-between items-center gap-y-4 md:gap-y-0 my-3">
          <h2 className="flex-1 text-2xl text-primary-text">List of items</h2>

          <div className="flex-1 flex gap-x-4 flex-row-reverse md:flex-row justify-end">
            {/* Search box by id */}
            <TextSearchBox placeholder="Search by Reservation ID" />
            {/* Food filter dropdown */}
            <DashboardDropDown
              options={[
                "All",
                "Fruits",
                "Vegetables",
                "Dairy",
                "Meat",
                "Snacks",
              ]}
            />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg">
          <TableFoodOrderList data={orderTableData} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenStaffOrderList;
