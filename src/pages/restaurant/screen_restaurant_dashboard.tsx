import { MonthlyChart, YearlyChart } from "@/components/charts";
import { ButtonAdd, TextSearchBox } from "../../components/input";
import {
  DashboardCard,
  DashboardMostSellingItems,
  Pagination,
  TableFoodList,
} from "../../components/utilities";
import { useEffect, useState } from "react";
import { EditCategoryModal, EditFoodItemModal } from "@/components/modals";
import { IconGrowth, IconSales, IconTeam } from "@/components/icons";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const ScreenRestaurantDashboard = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [categoryModal, setShowCategoryModal] = useState(false);
  const [foodItemModal, setShowFoodItemModal] = useState(false);

  const showFoodItemAddModal = () => setShowFoodItemModal(true);
  const showCategoryAddModal = () => setShowCategoryModal(true);
  const closeFoodItemModal = () => setShowFoodItemModal(false);
  const closeCaegoryModal = () => setShowCategoryModal(false);

  const fetchFoodItems = async () => {
    try {
      const response = await axiosInstance.get(`/owners/items/?page=${page}`);
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
      setCount(count || 0);
    } catch (error) {
      console.error("Failed to load food items", error);
      toast.error("Failed to load food items.");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [page]);

  const sellingItemData = [
    /* same as before */
  ];

  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          <DashboardCard
            icon={<IconSales />}
            label="Total Sells today"
            data={"$100k"}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
            tail="(45)"
          />
          <DashboardCard
            icon={<IconGrowth />}
            label="Weekly growth"
            data={"$11,375"}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
            tail="19.91%"
          />
          <DashboardCard
            icon={<IconTeam />}
            label="Total member"
            data={"12"}
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
            tail="Team"
          />
        </div>

        {/* Charts */}
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
              title="Customer Flow"
              firstData={[15, 30, 45, 60]}
              secondData={[152, 303, 451, 603]}
            />
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Search + Add Buttons */}
        <div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-4 items-start mt-4">
          <div className="col-span-2 flex items-center justify-end mb-4 gap-x-4">
            <TextSearchBox
              placeholder="Search by Name"
              className="flex-1 max-w-none"
            />
            <ButtonAdd label="Add Items" onClick={showFoodItemAddModal} />
            <ButtonAdd label="Add Category" onClick={showCategoryAddModal} />
          </div>

          {/* Table */}
          <div className="col-span-2 bg-sidebar p-4 rounded-lg">
            <TableFoodList data={foodItems} />
            <div className="mt-4 flex justify-center">
              <Pagination
                page={page}
                total={count}
                onPageChange={(p) => setPage(p)}
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
      <EditFoodItemModal
        isOpen={foodItemModal}
        close={closeFoodItemModal}
        onSuccess={fetchFoodItems}
      />
      <EditCategoryModal
        isOpen={categoryModal}
        close={closeCaegoryModal}
        onSuccess={fetchFoodItems}
      />
    </>
  );
};

export default ScreenRestaurantDashboard;
