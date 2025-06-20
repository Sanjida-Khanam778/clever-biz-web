type FoodItem = {
  image: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};
type ReservationItem = {
  reservationId: string;
  customerName: string;
  tableNo: string;
  guestNo: number;
  cellNumber: string;
  email: string;
  reservationTime: string;
  customRequest: string;
};
type StaffItem = {
  staffId: number;
  name: string;
  role: string;
  email: string | null;
  password: string | null;
  action: "Active" | "Hold";
};

type DeviceItem = {
  userName: string;
  tableNo: string;
  password: string | null;
  status: "Active" | "Hold";
};

type ReviewItem = {
  customerName: string;
  date: string;
  timeOfOrder: string;
  guestNo: string | number;
  tableNo: string;
  orderId: number;
  review: number;
};

type ChatRoomItem = {
  id: string;
  name: string;
  time: string;
};
type OrderItem = {
  userName: string;
  guestNo: number;
  tableNo: string;
  orderedItems: number;
  timeOfOrder: string;
  orderId: string;
  status:
    | "Pending"
    | "Completed"
    | "Delivered"
    | "Cancelled"
    | "In Progress"
    | "Processing";
};
