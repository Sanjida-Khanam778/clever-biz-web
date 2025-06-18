import { ChefSidebar } from "../../components/sidebar";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Header } from "../../components/utilities";
import { Outlet } from "react-router";

const ChefLayout = () => {
  const [sidebarOpen, setDrawerOpen] = useLocalStorage("chef_sidebar", false);

  const toggleSidebar = () => {
    setDrawerOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChefSidebar
        isOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        home="/chef"
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

export default ChefLayout;
