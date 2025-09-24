import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCheckmark, IconClose, IconHold } from "./icons";
import { TooltipTop } from "./utilities";
import { BiMailSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useOwner } from "@/context/ownerContext";
import { formatDateTime, formatDate, formatTime } from "@/lib/utils";
import { useStaff } from "@/context/staffContext";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { Member, ReservationItem, DeviceItem, ReviewItem } from "@/types";
import { Pointer, Trash, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ImSpinner6 } from "react-icons/im";

/* Reservation Table Data ===========================================================>>>>> */

interface TableReservationListProps {
  data: ReservationItem[];
}
export const TableReservationList: React.FC<TableReservationListProps> = ({
  data,
}) => {
  const { updateReservationStatus } = useOwner();

  const handleStatusChange = async (
    reservationId: number,
    newStatus: string
  ) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "accept":
        return {
          icon: (
            <IconCheckmark className="h-7 w-7 text-green-500 cursor-pointer" />
          ),
          label: "Accept",
        };
      case "hold":
        return {
          icon: <IconHold className="h-6 w-6 text-yellow-500 cursor-pointer" />,
          label: "Hold",
        };
      case "cancel":
        return {
          icon: <IconClose className="h-6 w-6 text-red-500 cursor-pointer" />,
          label: "Cancel",
        };
      default:
        return {
          icon: (
            <span className="min-h-8 inline-flex items-center justify-center px-2 py-1 border rounded cursor-pointer">
              {status}
            </span>
          ),
          label: status,
        };
    }
  };

  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th className="p-4 rounded-l-md">Reservation ID</th>
          <th className="p-4">Customer Name</th>
          <th className="p-4">Table Name</th>
          <th className="p-4">Guest No.</th>
          <th className="p-4">Cell number</th>
          <th className="p-4">Email</th>
          <th className="p-4">Reservation time</th>
          <th className="p-4 rounded-r-md">Custom Request</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data?.map((item, index) => {
          const statusDisplay = getStatusDisplay(item.customRequest);
          return (
            <tr key={index} className="border-b border-[#1C1E3C]">
              <td className="p-4 text-primary-text">{item.id}</td>
              <td className="p-4 text-primary-text">{item.customerName}</td>
              <td className="p-4 text-primary-text">{item.tableNo}</td>
              <td className="p-4 text-primary-text">{item.guestNo}</td>
              <td className="p-4 text-primary-text">{item.cellNumber}</td>
              <td className="p-4 text-primary-text/60">
                {item.email ? item.email : "N/A"}
              </td>
              <td className="p-4 text-primary-text">
                <span className="font-medium">
                  {formatDateTime(item.reservationTime)}
                </span>
              </td>
              <td className="p-4 text-primary-text">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {statusDisplay.icon}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className=" text-primary-text border-none">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "accept")}
                      className="flex focus:outline-none"
                    >
                      <IconCheckmark className="mr-2 h-5 w-5 text-green-500" />
                      Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "hold")}
                    >
                      <IconHold className="mr-2 h-5 w-5 text-yellow-500" />
                      Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(item.id, "cancel")}
                    >
                      <IconClose className="mr-2 h-5 w-5 text-red-500" />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected state when status prop changes
  useEffect(() => {
    setSelected(status);
  }, [status]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (newStatus: string) => {
    setSelected(newStatus);
    setOpen(false);
    onChange?.(newStatus); // call parent function
  };

  // Get the current properties with fallback
  const currentProperties = properties[selected] || {
    bg: "bg-gray-800",
    text: "text-gray-300",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`px-3 py-1 text-sm rounded ${currentProperties.bg} ${currentProperties.text}`}
        onClick={() => setOpen(!open)}
      >
        {selected}
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-sidebar text-white mt-1 rounded shadow-lg z-10">
          {availableStatuses.map((s) => {
            const statusProperties = properties[s] || {
              bg: "bg-gray-800",
              text: "text-gray-300",
            };
            return (
              <div
                key={s}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${statusProperties.text}`}
                onClick={() => handleSelect(s)}
              >
                {s}
              </div>
            );
          })}
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
  const { updateMemberStatus } = useOwner();
  const [localMemberStatus, setLocalMemberStatus] = useState<
    Record<number, string>
  >({});

  // const { response } = useContext(WebSocketContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Selected category to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const openModal = (category) => {
    setCategoryToDelete(category); // Set the selected category
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCategoryToDelete(null); // Clear the selected category
  };
  useEffect(() => {
    const initialStatus: Record<number, string> = {};
    data?.forEach((item) => {
      initialStatus[item.id] = item.action;
    });
    setLocalMemberStatus(initialStatus);
  }, [data]);

  const handleStatusChange = async (memberId: number, newStatus: string) => {
    const previousStatus =
      localMemberStatus[memberId] ||
      data.find((item) => item.id === memberId)?.action ||
      "active";

    // Immediately update local state for instant UI feedback
    setLocalMemberStatus((prev) => ({
      ...prev,
      [memberId]: newStatus.toLowerCase(),
    }));

    try {
      await updateMemberStatus(memberId, newStatus);
    } catch (error) {
      console.error("Failed to update member status:", error);
      // Revert local state if API call fails
      setLocalMemberStatus((prev) => ({
        ...prev,
        [memberId]: previousStatus,
      }));
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/owners/chef-staff/${id}}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
              <div className="flex items-center gap-4:">
                <ButtonStatus
                  status={
                    localMemberStatus[item.id] !== undefined
                      ? localMemberStatus[item.id] === "active"
                        ? "Active"
                        : "Hold"
                      : item.action === "active"
                      ? "Active"
                      : "Hold"
                  }
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
                  onChange={(newStatus) =>
                    handleStatusChange(item.id, newStatus)
                  }
                />
                <button
                  // Open modal with the selected item or trigger delete
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-4"
                  onClick={() => openModal(item)} // Define this function to handle delete logic
                >
                  <Trash size={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isModalOpen && (
        <DeleteFoodItemModal
          isOpen={isModalOpen} // Open the modal
          close={closeModal} // Function to close the modal
          id={categoryToDelete?.id}
          // setCategories={setCategories} // Pass the category ID to the modal
        />
      )}
    </table>
  );
};
/* <<<<<<<<===================================================== Team management table */

const DeleteFoodItemModal = ({ isOpen, close, id }) => {
  const parseUser = JSON.parse(localStorage.getItem("userInfo"));
  const role = parseUser?.role;
  console.log(role);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) {
      toast.error("No item selected for deletion.");
      return;
    }

    setLoading(true);

    // Log the constructed URL to ensure it's correct
    const url = `/owners/chef-staff/${id}/`;
    console.log("Delete URL:", url);

    try {
      const response = await axiosInstance.delete(url);
      toast.success("Item deleted successfully!");
      // setCategories((prevCategories) =>
      //   prevCategories.filter((category) => category.id !== id)
      // );
      close();
    } catch (err) {
      console.error(
        "Failed to delete item",
        err.response ? err.response.data : err
      );
      toast.error("An error occurred while deleting the item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/20" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-sidebar/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              Delete Member
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/50">
              Are you sure you want to delete this food member? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onClick={close}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="button-primary inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/5 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700 bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ImSpinner6 className="animate-spin w-4 h-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* Device List table ===========================================================>>>>> */
interface TableDeviceListProps {
  data: DeviceItem[];
}
export const TableDeviceList: React.FC<TableDeviceListProps> = ({ data }) => {
  const { updateDeviceStatus } = useOwner();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Selected category to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const openModal = (category) => {
    setCategoryToDelete(category); // Set the selected category
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCategoryToDelete(null); // Clear the selected category
  };
  // Local state to track device status changes immediately
  const [localDeviceStatus, setLocalDeviceStatus] = useState<
    Record<number, string>
  >({});

  // Initialize local device status state when data changes
  useEffect(() => {
    const initialStatus: Record<number, string> = {};
    data?.forEach((item) => {
      initialStatus[item.id] = item.action;
    });
    setLocalDeviceStatus(initialStatus);
  }, [data]);

  const handleStatusChange = async (deviceId: number, newStatus: string) => {
    const previousStatus =
      localDeviceStatus[deviceId] ||
      data.find((item) => item.id === deviceId)?.action ||
      "active";

    // Immediately update local state for instant UI feedback
    setLocalDeviceStatus((prev) => ({
      ...prev,
      [deviceId]: newStatus.toLowerCase(),
    }));

    try {
      await updateDeviceStatus(deviceId, newStatus.toLowerCase());
    } catch (error) {
      console.error("Failed to update device status:", error);
      // Revert local state if API call fails
      setLocalDeviceStatus((prev) => ({
        ...prev,
        [deviceId]: previousStatus,
      }));
    }
  };

  return (
    <table className="w-full table-auto text-left clever-table">
      <thead className="table-header">
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Table Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.id}</td>
            <td className="p-4 text-primary-text">{item.username}</td>
            <td className="p-4 text-primary-text">{item.table_name}</td>
            <td className="p-4 text-primary-text">
              <div className="flex items-center gap-3">
                <ButtonStatus
                  status={
                    localDeviceStatus[item.id] !== undefined
                      ? localDeviceStatus[item.id] === "active"
                        ? "Active"
                        : "Hold"
                      : item.action === "active"
                      ? "Active"
                      : "Hold"
                  }
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
                  onChange={(newStatus) =>
                    handleStatusChange(item.id, newStatus)
                  }
                />
                <div onClick={() => openModal(item)}>
                  <Trash2 color="red" cursor={"pointer"} />
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isModalOpen && (
        <DeleteDevice
          isOpen={isModalOpen} // Open the modal
          close={closeModal} // Function to close the modal
          id={categoryToDelete?.id}
          // setCategories={setCategories} // Pass the category ID to the modal
        />
      )}
    </table>
  );
};
/* <<<<<<<<===================================================== Device List table */
const DeleteDevice = ({ isOpen, close, id }) => {
  const parseUser = JSON.parse(localStorage.getItem("userInfo"));
  const role = parseUser?.role;
  console.log(role);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log(id);
    if (!id) {
      toast.error("No item selected for deletion.");
      return;
    }

    setLoading(true);

    // Log the constructed URL to ensure it's correct
    const url = `/owners/devices/${id}/`;
    console.log("Delete URL:", url);

    try {
      const response = await axiosInstance.delete(url);
      toast.success("Device deleted successfully!");
      console.log(response)
      // setCategories((prevCategories) =>
      //   prevCategories.filter((category) => category.id !== id)
      // );
      close();
    } catch (err) {
      console.error(
        "Failed to delete item",
        err.response ? err.response.data : err
      );
      toast.error("An error occurred while deleting the item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/20" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-sidebar/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              Delete Device
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/50">
              Are you sure you want to delete this food Device? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onClick={close}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="button-primary inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/5 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700 bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ImSpinner6 className="animate-spin w-4 h-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
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
          <th>Table Name</th>
          <th>Order ID</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody className="bg-sidebar text-sm">
        {data.map((item, index) => (
          <tr key={index} className="border-b border-[#1C1E3C]">
            <td className="p-4 text-primary-text">{item.name}</td>
            <td className="p-4 text-primary-text">
              {" "}
              {formatDate(item.created_time)}
            </td>
            <td className="p-4 text-primary-text">
              {formatTime(item.created_time)}
            </td>
            <td className="p-4 text-primary-text">{item.guest_no}</td>
            <td className="p-4 text-primary-text">{item.device_table}</td>
            <td className="p-4 text-primary-text">{item.order_id}</td>
            <td className="p-4 text-primary-text">{item.rating}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* <<<<<<<<===================================================== Review List table */

/* Food Order List ===========================================================>>>>> */
interface TableFoodOrderListProps {
  data: any[] | { orders: any[] };
  updateOrderStatus?: (id: number, status: string) => Promise<void>;
}
export const TableFoodOrderList: React.FC<TableFoodOrderListProps> = ({
  data,
  updateOrderStatus: propUpdateOrderStatus,
}) => {
  const { fetchOrders } = useStaff();
  const { fetchOrders: fetchOwnerOrders } = useOwner();
  const statuses = ["Pending", "Preparing", "Served", "Completed", "Cancelled"];
  const { updateOrderStatus: contextUpdateOrderStatus } = useOwner();

  // Use prop if provided (for staff), otherwise use context (for owner)
  const updateOrderStatus = propUpdateOrderStatus || contextUpdateOrderStatus;

  // Handle different data structures
  const ordersData = Array.isArray(data) ? data : data?.orders || [];
  console.log(ordersData, "orders data");
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
      fetchOwnerOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left clever-table">
        <thead className="table-header">
          <tr>
            <th className="p-2 sm:p-4">Table Name</th>
            <th className="p-2 sm:p-4">Ordered Items</th>
            <th className="p-2 sm:p-4">Quantity</th>
            <th className="p-2 sm:p-4">Price</th>
            <th className="p-2 sm:p-4">Timer of Order</th>
            <th className="p-2 sm:p-4">Order Id</th>
            <th className="p-2 sm:p-4">Status</th>
          </tr>
        </thead>
        <tbody className="bg-sidebar text-sm">
          {ordersData?.map((item, index) => (
            <tr key={index} className="border-b border-[#1C1E3C]">
              <td className="p-2 sm:p-4 text-primary-text">{item.device_name}</td>
              <td className="p-2 sm:p-4 text-primary-text">
                {item.order_items?.[0]?.item_name || "N/A"}
              </td>
              <td className="p-2 sm:p-4 text-primary-text">
                {item.order_items.length || "N/A"}
              </td>
              <td className="p-2 sm:p-4 text-primary-text">
                {item.total_price || "N/A"}
              </td>
              <td className="p-2 sm:p-4 text-primary-text">
                <span className="font-medium">
                  {formatDateTime(item.created_time)}
                </span>
              </td>
              <td className="p-2 sm:p-4 text-primary-text">{item.id}</td>
              <td className="p-2 sm:p-4 text-primary-text">
                <ButtonStatus
                  status={item.status}
                  properties={{
                    Preparing: {
                      bg: "bg-blue-800",
                      text: "text-blue-300",
                    },
                    Completed: {
                      bg: "bg-green-800",
                      text: "text-green-300",
                    },
                    Cancelled: {
                      bg: "bg-red-800",
                      text: "text-red-300",
                    },
                    Pending: {
                      bg: "bg-yellow-800",
                      text: "text-yellow-300",
                    },
                    Served: {
                      bg: "bg-orange-200",
                      text: "text-orange-500",
                    },
                  }}
                  availableStatuses={statuses}
                  onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
