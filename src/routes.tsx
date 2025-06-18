import { Route, Routes } from "react-router";
import Layout from "./pages/authentication/layout";
import ScreenPrivacy from "./pages/authentication/screen_privacy";
import ScreenTermsCondition from "./pages/authentication/screen_terms";
import ScreenEmailVerification from "./pages/authentication/screen_email_verification";
import ScreenOtpVerification from "./pages/authentication/screen_otp_verification";
import ScreenLanding from "./pages/authentication/screen_landing";
import ScreenLogin from "./pages/authentication/screen_login";
import StaffLayout from "./pages/staff/layout";
import ScreenStaffDashboard from "./pages/staff/screen_staff_dashboard";
import ScreenStaffReservations from "./pages/staff/screen_staff_reservations";
import ScreenStaffOrderList from "./pages/staff/screen_staff_order_list";
import ScreenStaffChat from "./pages/staff/screen_staff_chat";
import ScreenRegister from "./pages/authentication/screen_register";
import ScreenPassword from "./pages/authentication/screen_password";
import ScreenChefDashboard from "./pages/chef/screen_chef_dashboard";
import ScreenChefOrderList from "./pages/chef/screen_chef_order_list";
import ScreenChefChat from "./pages/chef/screen_chef_chat";
import ChefLayout from "./pages/chef/layout";
import AdminLayout from "./pages/super-admin/layout";
import ScreenAdminDashboard from "./pages/super-admin/screen_admin_dashboard";
import ScreenAdminManagement from "./pages/super-admin/screen_admin_management";
import ScreenAdminFaq from "./pages/super-admin/screen_admin_faq";
import ScreenAdminTermsAndCondition from "./pages/super-admin/screen_admin_terms";
import ScreenAdminPrivacy from "./pages/super-admin/screen_admin_privacy";
import RestaurantLayout from "./pages/restaurant/layout";
import ScreenRestaurantOrderList from "./pages/restaurant/screen_restaurant_order_list";
import ScreenRestaurantReservations from "./pages/restaurant/screen_restaurant_reservations";
import ScreenRestaurantDashboard from "./pages/restaurant/screen_restaurant_dashboard";
import { ScreenRestaurantManagement } from "./pages/restaurant/screen_restaurant_management";
import { ScreenRestaurantDevices } from "./pages/restaurant/screen_restaurant_devices";
import ScreenRestaurantReviews from "./pages/restaurant/screen_restaurant_reviews";
import ScreenRestaurantChat from "./pages/restaurant/screen_restaurant_chat";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);
function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreenLanding />} />
      {/* Entry screens */}
      <Route element={<Layout />}>
        <Route path="login" element={<ScreenLogin />} />
        <Route path="register" element={<ScreenRegister />} />
        <Route path="verify-email" element={<ScreenEmailVerification />} />
        <Route path="create-password" element={<ScreenPassword />} />
        <Route path="verify-otp" element={<ScreenOtpVerification />} />
        <Route path="privacy-policy" element={<ScreenPrivacy />} />
        <Route path="terms-condition" element={<ScreenTermsCondition />} />
      </Route>
      {/* Staff screens */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index={true} element={<ScreenStaffDashboard />} />
        <Route path="reservations" element={<ScreenStaffReservations />} />
        <Route path="orders" element={<ScreenStaffOrderList />} />
        <Route path="messages" element={<ScreenStaffChat />} />
      </Route>
      {/* Chef screens */}
      <Route path="/chef" element={<ChefLayout />}>
        <Route index={true} element={<ScreenChefDashboard />} />
        <Route path="orders" element={<ScreenChefOrderList />} />
        <Route path="messages" element={<ScreenChefChat />} />
      </Route>
      {/* Restaurant screens */}
      <Route path="/restaurant" element={<RestaurantLayout />}>
        <Route index={true} element={<ScreenRestaurantDashboard />} />
        <Route path="orders" element={<ScreenRestaurantOrderList />} />
        <Route path="reservations" element={<ScreenRestaurantReservations />} />
        <Route path="management" element={<ScreenRestaurantManagement />} />
        <Route path="devices" element={<ScreenRestaurantDevices />} />
        <Route path="reviews" element={<ScreenRestaurantReviews />} />
        <Route path="messages" element={<ScreenRestaurantChat />} />
      </Route>
      {/* Admin screens */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index={true} element={<ScreenAdminDashboard />} />
        <Route path="management" element={<ScreenAdminManagement />} />
        <Route
          path="terms-condition"
          element={<ScreenAdminTermsAndCondition />}
        />
        <Route path="privacy-policy" element={<ScreenAdminPrivacy />} />
        <Route path="faq" element={<ScreenAdminFaq />} />
      </Route>
    </Routes>
  );
}

export default App;
