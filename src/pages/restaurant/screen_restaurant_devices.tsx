import { ButtonAdd, TextSearchBox } from "../../components/input";
import { DeviceDashboardCard, Pagination } from "../../components/utilities";
import { TableDeviceList } from "@/components/tables";
import { IconDeviceActive, IconDeviceHold } from "@/components/icons";
import { EditDeviceModal } from "@/components/modals";
import { useState, useEffect, useCallback } from "react";
import { useOwner } from "@/context/ownerContext";
import axiosInstance from "@/lib/axios";

export const ScreenRestaurantDevices = () => {
  const {
    fetchAllDevices,
    allDevices,
    setAllDevices,
    devicesSearchQuery,
    setDevicesSearchQuery,
    devicesCurrentPage,
    devicesCount,
    setDevicesCurrentPage,
  } = useOwner();

  const [deviceModal, setShowAddModall] = useState(false);
  const [deviceStats, setDeviceStats] = useState({
    total_devices: 0,
    active_devices: 0,
    hold_devices: 0,
    restaurant: "",
  });

  useEffect(() => {
    fetchAllDevices();
  }, [fetchAllDevices]);

  useEffect(() => {
    // Fetch device stats from API
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/owners/devices/stats/");
        setDeviceStats(res.data);
      } catch (err) {
        setDeviceStats({
          total_devices: 0,
          active_devices: 0,
          hold_devices: 0,
          restaurant: "",
        });
      }
    };
    fetchStats();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setDevicesSearchQuery(searchTerm);
          setDevicesCurrentPage(1); // Reset to first page when searching
          fetchAllDevices(1, searchTerm);
        }, 500);
      };
    })(),
    [fetchAllDevices, setDevicesSearchQuery, setDevicesCurrentPage]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setDevicesCurrentPage(page);
      fetchAllDevices(page, devicesSearchQuery);
    },
    [fetchAllDevices, devicesSearchQuery, setDevicesCurrentPage]
  );

  const showDeviceModal = () => {
    setShowAddModall(true);
  };

  const closeDeviceModal = () => {
    setShowAddModall(false);
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Stats Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <DeviceDashboardCard
            count={deviceStats.active_devices}
            label="Active Devices"
            barColor="#0EA5E9"
            accentColor="#0EA5E9"
            icon={<IconDeviceActive />}
          />
          <DeviceDashboardCard
            count={deviceStats.hold_devices}
            label="Hold Device"
            barColor="#D8954A"
            accentColor="#D8954A"
            icon={<IconDeviceHold />}
          />
          <DeviceDashboardCard
            count={deviceStats.total_devices}
            label="Total Devices"
            barColor="#8B5CF6"
            accentColor="#8B5CF6"
          />
        </div>
        {/* Label */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-y-2 md:gap-y-0 my-4">
          <h2 className="flex-1 text-2xl text-primary-text">
            Registered Device List
          </h2>
          <div className="flex-1 flex gap-x-4 justify-end">
            <ButtonAdd label="Add Device" onClick={() => showDeviceModal()} />
            <TextSearchBox
              placeholder="Search"
              value={devicesSearchQuery}
              onChange={(value) => debouncedSearch(value)}
            />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg overflow-x-auto">
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
