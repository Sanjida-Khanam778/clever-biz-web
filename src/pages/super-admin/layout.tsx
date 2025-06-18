import { Outlet } from "react-router";
import { AdminSidebar } from "../../components/sidebar";
import { Header } from "../../components/utilities";
import useLocalStorage from "../../hooks/useLocalStorage";

const AdminLayout = () => {
  const [sidebarOpen, setDrawerOpen] = useLocalStorage("staff_sidebar", false);

  const toggleSidebar = () => {
    setDrawerOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        home="/admin"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="bg-dashboard flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
