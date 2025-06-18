import { ButtonStatus, DashboardDropDown } from "../../components/input";
import {
  DashboardCard,
  Pagination,
  TableFoodList,
} from "../../components/utilities";
import { IconDelete, IconEdit } from "../../components/icons";
import { useState } from "react";
import {
  DeleteFoodItemModal,
  EditFoodItemModal,
} from "../../components/modals";
import { TableFoodOrderList } from "@/components/tables";
import { foodItems } from "@/data";

const ScreenChefDashboard = () => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  function openDelete() {
    setDeleteDialogOpen(true);
  }

  function closeDelete() {
    setDeleteDialogOpen(false);
  }
  function openEdit() {
    setEditDialogOpen(true);
  }

  function closeEdit() {
    setEditDialogOpen(false);
  }
  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <DashboardCard
            label="Available items"
            data={"100"}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
          />
          {/* Card 2 */}
          <DashboardCard
            label="Processing order"
            data={"20"}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
          />
          {/* Card 3 */}
          <DashboardCard
            label="Pending order"
            data={"12"}
            accentColor="#FF6561"
            gradientStart="#EB342E"
            gradientEnd="#161F42"
          />
        </div>
        {/* Dashboard Content */}
        {/* Header and dropdown */}
        <div className="flex flex-row justify-between items-center my-3">
          <h2 className="text-2xl text-primary-text">List of items</h2>
          <DashboardDropDown
            options={["All", "Fruits", "Vegetables", "Dairy", "Meat", "Snacks"]}
          />
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg">
          <TableFoodList data={foodItems} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
      <EditFoodItemModal isOpen={isEditDialogOpen} close={closeEdit} />
      <DeleteFoodItemModal isOpen={isDeleteDialogOpen} close={closeDelete} />
    </>
  );
};

export default ScreenChefDashboard;
