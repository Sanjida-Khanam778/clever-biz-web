import { ButtonAdd, DateSearchBox, TextSearchBox } from "@/components/input";
import { TableReviewList } from "@/components/tables";
import { Pagination, StatCardAsteric } from "@/components/utilities";

const ScreenRestaurantReviews = () => {
  const data: ReviewItem[] = [
    {
      customerName: "Nasi udduk",
      date: "16/08/2013",
      timeOfOrder: "90.30AM",
      guestNo: 4,
      tableNo: "2B",
      orderId: 34034474,
      review: 4,
    },
    {
      customerName: "N/A",
      date: "07/05/2016",
      timeOfOrder: "90.30AM",
      guestNo: "N/A",
      tableNo: "3C",
      orderId: 37890606,
      review: 5,
    },
    {
      customerName: "Satay",
      date: "18/09/2016",
      timeOfOrder: "90.30PM",
      guestNo: 3,
      tableNo: "5B",
      orderId: 66277431,
      review: 3,
    },
    {
      customerName: "Pepes",
      date: "16/08/2013",
      timeOfOrder: "90.30AM",
      guestNo: 4,
      tableNo: "4A",
      orderId: 76031847,
      review: 5,
    },
    {
      customerName: "N/A",
      date: "18/09/2016",
      timeOfOrder: "90.30AM",
      guestNo: "N/A",
      tableNo: "2A",
      orderId: 43397744,
      review: 4,
    },
    {
      customerName: "Babi Pangang",
      date: "18/09/2016",
      timeOfOrder: "12.30PM",
      guestNo: 2,
      tableNo: "3B",
      orderId: 38766940,
      review: 3,
    },
    {
      customerName: "Soto",
      date: "07/05/2016",
      timeOfOrder: "90.30AM",
      guestNo: 1,
      tableNo: "2A",
      orderId: 66538135,
      review: 5,
    },
    {
      customerName: "Gado-gado",
      date: "12/06/2020",
      timeOfOrder: "8.30AM",
      guestNo: 1,
      tableNo: "1B",
      orderId: 21789057,
      review: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Dashboard Cards */}
      <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
        {/* Card 1 */}
        <StatCardAsteric
          label="Overall Rating"
          data={"4.6"}
          accentColor="#FFB056"
          gradientStart="#48E03A"
          gradientEnd="#161F42"
        />
        {/* Card 2 */}
        <StatCardAsteric
          label="Reviews Today"
          data={"50"}
          accentColor="#FF6561"
          gradientStart="#FFB056"
          gradientEnd="#161F42"
        />
        {/* Card 3 */}
        <StatCardAsteric
          accentColor="#31BB24"
          label="Total Reviews"
          data={"1000"}
          gradientStart="#EB342E"
          gradientEnd="#161F42"
        />
      </div>
      {/* Label */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-y-2 md:gap-y-0 my-4">
        <h2 className="flex-1 text-2xl text-primary-text">
          Registered Device List
        </h2>
        <div className="flex-1 flex gap-x-4 justify-end">
          <DateSearchBox />
          <TextSearchBox placeholder="Search" />
        </div>
      </div>
      {/* List of content */}
      <div className="bg-sidebar p-4 rounded-lg overflow-x-auto">
        <TableReviewList data={data} />
        <div className="mt-4 flex justify-center">
          <Pagination page={1} />
        </div>
      </div>
    </div>
  );
};

export default ScreenRestaurantReviews;
