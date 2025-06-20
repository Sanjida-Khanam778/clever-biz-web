import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCheckmark, IconClose, IconHold } from "./icons";
import { ButtonStatus, StatusSpan } from "./input";
import { TooltipTop } from "./utilities";
import { BiCopy, BiMailSend } from "react-icons/bi";
import { useState } from "react";

/* Reservation Table Data ===========================================================>>>>> */

interface TableReservationListProps {
  data: ReservationItem[];
}
export const TableReservationList: React.FC<TableReservationListProps> = ({
  data,
}) => {
  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th className="p-4 rounded-l-md">Reservation ID</th>
          <th className="p-4">Customer Name</th>
          <th className="p-4">Table No.</th>
          <th className="p-4">Guest No.</th>
          <th className="p-4">Cell number</th>
          <th className="p-4">Email</th>
          <th className="p-4">Reservation time</th>
          <th className="p-4 rounded-r-md">Custom Request</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.reservationId}</td>
            <td className="p-4 text-primary-text">{item.customerName}</td>
            <td className="p-4 text-primary-text">{item.tableNo}</td>
            <td className="p-4 text-primary-text">{item.guestNo}</td>
            <td className="p-4 text-primary-text">{item.cellNumber}</td>
            <td className="p-4 text-primary-text/60">{item.email}</td>
            <td className="p-4 text-primary-text">{item.reservationTime}</td>
            <td className="p-4 text-primary-text">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {item.customRequest === "accepted" ? (
                    <IconCheckmark className="h-7 w-7 text-green-500 cursor-pointer" />
                  ) : item.customRequest === "hold" ? (
                    <IconHold className="h-6 w-6 text-yellow-500 cursor-pointer" />
                  ) : (
                    <span className="min-h-8 inline-flex items-center justify-center px-2 py-1 border rounded cursor-pointer">
                      {item.customRequest}
                    </span>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className=" text-primary-text border-none">
                  <DropdownMenuItem
                    onClick={() => {}}
                    className="flex focus:outline-none"
                  >
                    <IconCheckmark className="mr-2 h-5 w-5 text-green-500" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <IconHold className="mr-2 h-5 w-5 text-yellow-500" />
                    Hold
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <IconClose className="mr-2 h-5 w-5 text-yellow-500" />{" "}
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Reservation Table Data */

/* Team management table ===========================================================>>>>> */
type ButtonStatusProps = {
  status: string;
  availableStatuses: string[];
  properties: {
    [key: string]: {
      bg: string;
      text: string;
    };
  };
  onChange?: (newStatus: string) => void; // <-- add this
};

export const ButtonStatus: React.FC<ButtonStatusProps> = ({
  status,
  availableStatuses,
  properties,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(status);

  const handleSelect = (newStatus: string) => {
    setSelected(newStatus);
    setOpen(false);
    onChange?.(newStatus); // call parent function
  };

  return (
    <div className="relative">
      <button
        className={`px-3 py-1 text-sm rounded ${properties[selected].bg} ${properties[selected].text}`}
        onClick={() => setOpen(!open)}
      >
        {selected}
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-sidebar text-white mt-1 rounded shadow-lg z-10">
          {availableStatuses.map((s) => (
            <div
              key={s}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${properties[s].text}`}
              onClick={() => handleSelect(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TableTeamManagementProps {
  data: Member[];
}
export const TableTeamManagement: React.FC<TableTeamManagementProps> = ({
  data,
}) => {
  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th className="p-4 rounded-l-md">ID</th>
          <th className="p-4">Name</th>
          <th className="p-4">Role</th>
          <th className="p-4">Email</th>
          <th className="p-4 rounded-r-md">Action</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.id}</td>
            <td className="p-4 text-primary-text">{item.username}</td>
            <td className="p-4 text-primary-text">{item.role}</td>
            <td className="p-4 text-primary-text/60 flex items-center gap-x-1">
              {item.email}
              {item.email ? (
                <TooltipTop tip="Send password via mail">
                  <button className="bg-transparent">
                    <BiMailSend className="w-6 h-6" />
                  </button>
                </TooltipTop>
              ) : (
                "N/A"
              )}
            </td>
            <td className="p-4 text-primary-text">
              {
                <ButtonStatus
                  status="Active"
                  availableStatuses={["Active", "Hold"]}
                  properties={{
                    Active: {
                      bg: "bg-green-800",
                      text: "text-green-300",
                    },
                    Hold: {
                      bg: "bg-yellow-800",
                      text: "text-yellow-300",
                    },
                  }}
                />
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Team management table */

/* Device List table ===========================================================>>>>> */
interface TableDeviceListProps {
  data: DeviceItem[];
}
export const TableDeviceList: React.FC<TableDeviceListProps> = ({ data }) => {
  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th>Username</th>
          <th>Table No.</th>
          <th>Password</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.userName}</td>
            <td className="p-4 text-primary-text">{item.tableNo}</td>
            <td className="p-4 text-primary-text/60 flex items-center gap-x-1">
              {item.password}
              {item.password ? (
                <TooltipTop tip="Copy Password">
                  <button className="bg-transparent">
                    <BiCopy className="w-4 h-4" />
                  </button>
                </TooltipTop>
              ) : (
                "N/A"
              )}
            </td>
            <td className="p-4 text-primary-text">
              {!item.password ? (
                <StatusSpan
                  status="Generate Access"
                  properties={{
                    "Generate Access": {
                      bg: "bg-gray-800",
                      text: "text-gray-300",
                    },
                  }}
                  onClick={() => {
                    console.log("Generate access token");
                  }}
                />
              ) : (
                <ButtonStatus
                  status={item.status}
                  availableStatuses={["Active", "Hold"]}
                  properties={{
                    Active: {
                      bg: "bg-green-800",
                      text: "text-green-300",
                    },
                    Hold: {
                      bg: "bg-yellow-800",
                      text: "text-yellow-300",
                    },
                  }}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Device List table */

/* Review List table ===========================================================>>>>> */
interface TableReviewListProps {
  data: ReviewItem[];
}
export const TableReviewList: React.FC<TableReviewListProps> = ({ data }) => {
  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th>Customer Name</th>
          <th>Date</th>
          <th>Time of Order</th>
          <th>Guest No.</th>
          <th>Table No.</th>
          <th>Order ID</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.customerName}</td>
            <td className="p-4 text-primary-text">{item.date}</td>
            <td className="p-4 text-primary-text">{item.timeOfOrder}</td>
            <td className="p-4 text-primary-text">{item.guestNo}</td>
            <td className="p-4 text-primary-text">{item.tableNo}</td>
            <td className="p-4 text-primary-text">{item.orderId}</td>
            <td className="p-4 text-primary-text">{item.review}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Review List table */

/* Food Order List ===========================================================>>>>> */
interface TableFoodOrderListProps {
  data: OrderItem[];
}
export const TableFoodOrderList: React.FC<TableFoodOrderListProps> = ({
  data,
}) => {
  const statuses = ["Processing", "Delivered", "Canceled", "Pending"];

  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th>User Name</th>
          <th>Guest No.</th>
          <th>Table No.</th>
          <th>Ordered Items</th>
          <th>Timer of order</th>
          <th>Order Id</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.userName}</td>
            <td className="p-4 text-primary-text">{item.guestNo}</td>
            <td className="p-4 text-primary-text">{item.tableNo}</td>
            <td className="p-4 text-primary-text">{item.orderedItems}</td>
            <td className="p-4 text-primary-text">{item.timeOfOrder}</td>
            <td className="p-4 text-primary-text">{item.orderId}</td>
            <td className="p-4 text-primary-text">
              {item.status.toLocaleLowerCase() === "processing" ? (
                <ButtonStatus
                  status="Processing"
                  properties={{
                    Processing: {
                      bg: "bg-blue-800",
                      text: "text-blue-300",
                    },
                  }}
                  availableStatuses={statuses}
                />
              ) : item.status.toLocaleLowerCase() === "delivered" ? (
                <ButtonStatus
                  status="Delivered"
                  properties={{
                    Delivered: {
                      bg: "bg-green-800",
                      text: "text-green-300",
                    },
                  }}
                  availableStatuses={statuses}
                />
              ) : item.status.toLocaleLowerCase() === "canceled" ? (
                <ButtonStatus
                  status="Canceled"
                  properties={{
                    Canceled: {
                      bg: "bg-red-800",
                      text: "text-red-300",
                    },
                  }}
                  availableStatuses={statuses}
                />
              ) : (
                <ButtonStatus
                  status="Pending"
                  properties={{
                    Pending: {
                      bg: "bg-yellow-800",
                      text: "text-yellow-300",
                    },
                  }}
                  availableStatuses={statuses}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Food Order List */
