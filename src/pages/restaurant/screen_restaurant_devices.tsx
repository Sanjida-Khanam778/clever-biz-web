import { ButtonAdd, TextSearchBox } from "../../components/input";
import { DeviceDashboardCard, Pagination } from "../../components/utilities";
import { TableDeviceList } from "@/components/tables";
import { IconDeviceActive, IconDeviceHold } from "@/components/icons";
import { EditDeviceModal } from "@/components/modals";
import { useState } from "react";

export const ScreenRestaurantDevices = () => {
  const data: DeviceItem[] = [
    {
      userName: "ISSUE-1290",
      tableNo: "2B",
      password: "lkasdlfkjadsad",
      status: "Active",
    },
    {
      userName: "ISSUE-23",
      tableNo: "3C",
      password: "lvNtA6FHI",
      status: "Active",
    },
    {
      userName: "UBER-344",
      tableNo: "5B",
      password: "TCiAfwi87I",
      status: "Hold",
    },
    {
      userName: "APP-012",
      tableNo: "4A",
      password: null,
      status: "Active",
    },
    {
      userName: "APP-12",
      tableNo: "2A",
      password: "yRzjajHTjXiE4",
      status: "Active",
    },
    {
      userName: "ISSUE-879",
      tableNo: "3B",
      password: "3TKyV4cE",
      status: "Active",
    },
    {
      userName: "ISSUE-488",
      tableNo: "2A",
      password: "u18dhS",
      status: "Hold",
    },
    {
      userName: "APP-1",
      tableNo: "1B",
      password: "yc91tIpF",
      status: "Active",
    },
  ];
  const [deviceModal, setShowAddModall] = useState(false);

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
            count={300}
            label="Active Devices"
            barColor="#0EA5E9"
            accentColor="#0EA5E9"
            icon={<IconDeviceActive />}
          />
          <DeviceDashboardCard
            count={20}
            label="Hold Device"
            barColor="#D8954A"
            accentColor="#D8954A"
            icon={<IconDeviceHold />}
          />
          <DeviceDashboardCard
            count={320}
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
            <TextSearchBox placeholder="Search" />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg overflow-x-auto">
          <TableDeviceList data={data} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
      <EditDeviceModal isOpen={deviceModal} close={closeDeviceModal} />
    </>
  );
};
