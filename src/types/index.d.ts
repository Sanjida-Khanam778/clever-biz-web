type FoodItem = {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};
type ReservationItem = {
  id: number;
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

type Member = {
  id: number;
  email: string;
  username: string;
  role: string;
  action: string;
  generate: string;
  created_at: string;
  updated_time: string;
  restaurant: string;
  image: string | null;
};

type DeviceItem = {
  id: number;
  table_name: string;
  restaurant: number;
  action: string;
  restaurant_name: string;
  username: string;
};

type ReviewItem = {
  name: string;
  created_time: string;
  guest_no: string | number;
  device_table: string;
  order_id: number;
  rating: number;
};

type ChatRoomItem = {
  id: string;
  table_name: string;
  time: string;
  user_id: number;
};

type OrderItem = {
  id: number;
  userName: string;
  guestNo: number;
  tableNo: string;
  orderedItems: number;
  timeOfOrder: string;
  orderId: string;
  status:
    | "Pending"
    | "Completed"
    | "Served"
    | "Cancelled"
    | "Preparing";
};
