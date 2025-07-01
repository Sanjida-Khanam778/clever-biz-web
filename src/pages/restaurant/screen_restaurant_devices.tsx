import { ButtonAdd, TextSearchBox } from "../../components/input";
import {
  DeviceDashboardCard,
  Pagination,
  DashboardCard,
} from "../../components/utilities";
import { TableDeviceList } from "@/components/tables";
import { IconDeviceActive, IconDeviceHold } from "@/components/icons";
import { EditDeviceModal } from "@/components/modals";
import { useState, useEffect, useCallback } from "react";
import { useOwner } from "@/context/ownerContext";
import axiosInstance from "@/lib/axios";

export const ScreenRestaurantDevices = () => {
  const {
    allDevices,
    devicesCount,
    devicesCurrentPage,
    devicesSearchQuery,
    deviceStats,
    fetchAllDevices,
    fetchDeviceStats,
    setDevicesCurrentPage,
    setDevicesSearchQuery,
  } = useOwner();

  const [deviceModal, setShowAddModall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDeviceStats(), fetchAllDevices()]);
      } catch (error) {
        console.error("Failed to load device data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchDeviceStats, fetchAllDevices]);

  const handlePageChange = (page: number) => {
    setDevicesCurrentPage(page);
    fetchAllDevices(page, devicesSearchQuery);
  };

  const handleSearchChange = (query: string) => {
    setDevicesSearchQuery(query);
    fetchAllDevices(1, query);
  };

  const showDeviceModal = () => {
    setShowAddModall(true);
  };

  const closeDeviceModal = () => {
    setShowAddModall(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading devices...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Stats Cards */}
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-3">
          <DashboardCard
            label="Total devices"
            data={deviceStats?.total_devices?.toString() || "0"}
            accentColor="#31BB24"
            gradientStart="#48E03A"
            gradientEnd="#161F42"
          />
          <DashboardCard
            label="Active devices"
            data={deviceStats?.active_devices?.toString() || "0"}
            accentColor="#4F46E5"
            gradientStart="#4F46E5"
            gradientEnd="#161F42"
          />
          <DashboardCard
            label="Hold devices"
            data={deviceStats?.hold_devices?.toString() || "0"}
            accentColor="#FFB056"
            gradientStart="#FFB056"
            gradientEnd="#161F42"
          />
        </div>

        {/* Header and search */}
        <div className="flex flex-row justify-between items-center my-3">
          <h2 className="text-2xl text-primary-text">List of devices</h2>
          <TextSearchBox
            placeholder="Search by table name"
            value={devicesSearchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg">
          <TableDeviceList data={allDevices} />
          <div className="mt-4 flex justify-center">
            <Pagination
              page={devicesCurrentPage}
              total={devicesCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <EditDeviceModal isOpen={deviceModal} close={closeDeviceModal} />
    </>
  );
};
