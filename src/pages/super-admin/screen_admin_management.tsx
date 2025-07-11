import { IconCustomerInfo } from "../../components/icons";
import { ButtonStatus, TextSearchBox } from "../../components/input";
import { ModalAddSubscriber } from "../../components/modals";
import { StatCardAsteric, Pagination } from "../../components/utilities";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  hideSubscriberDetail,
  showSubscriberDetail,
} from "./redux-slices/slice_admin_management";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";

interface Subscriber {
  name: string;
  customerId: string;
  cellNumber: string;
  startingDate: string;
  package: string;
  status: "Active" | "Hold" | "Pending";
}
export const subscribers: Subscriber[] = [
  {
    name: "Kicker Nicil",
    customerId: "55-1234",
    cellNumber: "(555) 555-1234",
    startingDate: "12 July 2024",
    package: "Half yearly",
    status: "Active",
  },
  {
    name: "Kicker Nicil",
    customerId: "55-1234",
    cellNumber: "(555) 555-1234",
    startingDate: "12 July 2024",
    package: "Yearly",
    status: "Active",
  },
  {
    name: "Kicker Nicil",
    customerId: "55-1234",
    cellNumber: "(555) 555-1234",
    startingDate: "12 July 2024",
    package: "Monthly",
    status: "Hold",
  },
  {
    name: "Kicker Nicil",
    customerId: "55-1234",
    cellNumber: "(555) 555-1234",
    startingDate: "12 July 2024",
    package: "Monthly",
    status: "Active",
  },
];
const ScreenAdminManagement = () => {
  const dispatch = useAppDispatch();

  const showAddSubscriberModal = () => {
    dispatch(showSubscriberDetail(undefined));
  };
  return (
    <>
      <div className="flex flex-col">
        {/* Dashboard Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          {/* Card 1 */}
          <StatCardAsteric
            label="Total Restaurant"
            data={"100"}
            accentColor="#FFB056"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
          />
          {/* Card 2 */}
          <StatCardAsteric
            label="Total On Hold"
            data={"20"}
            accentColor="#FF6561"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
          />
          {/* Card 3 */}
          <StatCardAsteric
            accentColor="#31BB24"
            label="Active Today"
            data={"12"}
            gradientStart="#EB342E"
            gradientEnd="#161F42"
          />
        </div>
        {/* Dashboard Content */}
        {/* Header and dropdown */}
        <div className="flex flex-row justify-between items-center my-3">
          <h2 className="text-2xl text-primary-text">Subscriber management</h2>
          <div className="flex flex-row justify-end items-center gap-x-4">
            <button
              onClick={() => showAddSubscriberModal()}
              className="button-primary bg-sidebar text-nowrap flex flex-row justify-center items-center h-14 gap-x-2"
            >
              <IoMdAdd />
              <span>Add Subscriber</span>
            </button>
            <TextSearchBox placeholder="Search subscriber" />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg">
          <TableSubscriberList subscribers={subscribers} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
    </>
  );
};
interface TableSubscriberListProps {
  subscribers: Subscriber[];
}
export const TableSubscriberList: React.FC<TableSubscriberListProps> = ({
  subscribers,
}) => {
  const dispatch = useAppDispatch();
  const openShowDetailModal = useAppSelector(
    (state) => state.adminManagement.modals.showDetail
  );
  const openAddSubscriberModal = useAppSelector(
    (state) => state.adminManagement.modals.addSubscriber
  );

  const showAddSubscriberModal = () => {
    dispatch(showSubscriberDetail(undefined));
  };

  const hideAddSubscriberModal = () => {
    dispatch(hideSubscriberDetail());
  };

  return (
    <>
      <table className="w-full table-auto text-left clever-table">
        <thead className="table-header rounded-lg overflow-hidden text-primary-text text-sm font-normal">
          <tr>
            <th>Subscriber Name</th>
            <th>Customer ID</th>
            <th>Cell No.</th>
            <th>Starting Date</th>
            <th>Package</th>
            <th>Customer Info</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="bg-sidebar text-sm">
          {subscribers.map((item, index) => (
            <tr key={index} className="border-b border-[#1C1E3C]">
              <td className="p-4 text-primary-text">{item.name}</td>
              <td className="p-4 text-primary-text">{item.customerId}</td>
              <td className="p-4 text-primary-text">{item.cellNumber}</td>
              <td className="p-4 text-primary-text">{item.startingDate}</td>
              <td className="p-4 text-primary-text">{item.package}</td>
              <td className="h-20 p-4 flex gap-x-4 items-center">
                <button
                  onClick={() => showAddSubscriberModal()}
                  className="text-blue-100 bg-table-header flex flex-row items-center gap-x-2 p-3"
                >
                  <IconCustomerInfo />
                  <span>View</span>
                </button>
              </td>
              <td className="p-4">
                <ButtonStatus
                  availableStatuses={[
                    "Active",
                    "Hold",
                    "Pending",
                    "Delete Request",
                  ]}
                  status={item.status}
                  properties={{
                    Active: {
                      bg: "bg-green-800",
                      text: "text-green-300",
                    },
                    Hold: {
                      bg: "bg-red-800",
                      text: "text-red-300",
                    },
                    Pending: {
                      bg: "bg-yellow-800",
                      text: "text-yellow-300",
                    },
                    "Delete Request": {
                      bg: "bg-red-900",
                      text: "text-red-300",
                    },
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAddSubscriber
        isOpen={openShowDetailModal}
        close={hideAddSubscriberModal}
      />
    </>
  );
};

export default ScreenAdminManagement;
