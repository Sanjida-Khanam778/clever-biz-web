import { MonthlyChart, YearlyChart } from "@/components/charts";
import { ButtonAdd, TextSearchBox } from "../../components/input";
import {
  DashboardCard,
  DashboardMostSellingItems,
  Pagination,
  TableFoodList,
} from "../../components/utilities";
import { useState } from "react";
import { EditCategoryModal, EditFoodItemModal } from "@/components/modals";
import { IconGrowth, IconSales, IconTeam } from "@/components/icons";

const ScreenRestaurantDashboard = () => {
  const foodItems: FoodItem[] = [
    {
      image: "https://source.unsplash.com/80x80/?pizza",
      name: "Pepperoni Pizza",
      price: 100,
      category: "Fast Food",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?steak",
      name: "Grilled Steak",
      price: 180,
      category: "Fast Food",
      available: false,
    },
    {
      image: "https://source.unsplash.com/80x80/?salad",
      name: "Caesar Salad",
      price: 70,
      category: "Vegetables",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?burger",
      name: "Cheese Burger",
      price: 90,
      category: "Fast Food",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?sushi",
      name: "Salmon Sushi",
      price: 120,
      category: "Chinese Food",
      available: false,
    },
    {
      image: "https://source.unsplash.com/80x80/?taco",
      name: "Mexican Tacos",
      price: 85,
      category: "Fast Food",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?pasta",
      name: "Creamy Pasta",
      price: 95,
      category: "Fast Food",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?noodles",
      name: "Spicy Noodles",
      price: 80,
      category: "Fast Food",
      available: false,
    },
    {
      image: "https://source.unsplash.com/80x80/?sandwich",
      name: "Club Sandwich",
      price: 75,
      category: "Fast Food",
      available: true,
    },
    {
      image: "https://source.unsplash.com/80x80/?fries",
      name: "Loaded Fries",
      price: 60,
      category: "Fast Food",
      available: true,
    },
  ];

  const sellingItemData = [
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 400,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 600,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 100,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 300,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Large size Pizza with chesse",
      itemSell: 500,
      totalSell: 1000,
    },
    {
      label: "Small size vanilla ice cream",
      itemSell: 500,
      totalSell: 1000,
    },
  ];

  const [categoryModal, setShowCategoryModal] = useState(false);
  const [foodItemModal, setShowFoodItemModal] = useState(false);

  const showFoodItemAddModal = () => {
    setShowFoodItemModal(true);
  };
  const showCategoryAddModal = () => {
    setShowCategoryModal(true);
  };

  const closeFoodItemModal = () => {
    setShowFoodItemModal(false);
  };

  const closeCaegoryModal = () => {
    setShowCategoryModal(false);
  };

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
            data={"$11,375"}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
            tail="19.91%"
          />
          {/* Card 3 */}
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
              title="Customer Flow"
              firstData={[15, 30, 45, 60]}
              secondData={[152, 303, 451, 603]}
            />
          </div>
          <div className="col-span-1"></div>
        </div>
        {/* Add Buttons */}

        {/* List of content */}
        <div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-4 items-start mt-4">
          <div className="col-span-2 flex items-center justify-end mb-4 gap-x-4">
            <TextSearchBox
              placeholder="Search by Name"
              className="flex-1 max-w-none"
            />
            <ButtonAdd
              label="Add Items"
              onClick={() => showFoodItemAddModal()}
            />
            <ButtonAdd
              label="Add Category"
              onClick={() => showCategoryAddModal()}
            />
          </div>
          <div className="col-span-2 bg-sidebar p-4 rounded-lg">
            <TableFoodList data={foodItems} />
            <div className="mt-4 flex justify-center">
              <Pagination page={1} />
            </div>
          </div>
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
      <EditFoodItemModal isOpen={foodItemModal} close={closeFoodItemModal} />
      <EditCategoryModal isOpen={categoryModal} close={closeCaegoryModal} />
    </>
  );
};

export default ScreenRestaurantDashboard;
