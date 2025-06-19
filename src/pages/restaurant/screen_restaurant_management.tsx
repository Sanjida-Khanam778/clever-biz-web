import { EditStaffModal } from "@/components/modals";
import { TableTeamManagement } from "@/components/tables";
import { useEffect, useState } from "react";
import { ButtonAdd, TextSearchBox } from "../../components/input";
import { Pagination } from "../../components/utilities";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
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

export const ScreenRestaurantManagement = () => {
  const [member, setMember] = useState<Member[]>([]);

  const [staffModal, setShowStaffModal] = useState(false);
  const staffData: StaffItem[] = [
    {
      staffId: 1,
      name: "Nasi uduk",
      role: "Chef",
      email: "namehere@cleverbiz.com",
      password: "aldsf;ljajdlfj",
      action: "Active",
    },
    {
      staffId: 2,
      name: "Ruman uduk",
      role: "Stuff",
      email: null,
      password: null,
      action: "Hold",
    },
    {
      staffId: 3,
      name: "Ruman uduk",
      role: "Stuff",
      email: null,
      password: null,
      action: "Hold",
    },
  ];
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "http://192.168.10.150:8000/owners/chef-staff/"
        );
        setMember(response.data.results);
        console.log("------------------", response.data.results);
      } catch (error) {
        console.error("Failed to load all members", error);
        toast.error("Failed to load all members.");
      }
    };

    fetchCategories();
  }, []);

  const showModal = () => {
    setShowStaffModal(true);
  };

  const closeModal = () => {
    setShowStaffModal(false);
  };
  return (
    <>
      <div className="flex flex-col">
        {/* Label */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-y-2 md:gap-y-0 my-4">
          <h2 className="flex-1 text-2xl text-primary-text">Team management</h2>
          <div className="flex-1 flex gap-x-4 justify-end">
            <ButtonAdd label="Add Member" onClick={() => showModal()} />
            <TextSearchBox placeholder="Search by Email or ID" />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg overflow-x-auto">
          <TableTeamManagement data={member} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
      <EditStaffModal isOpen={staffModal} close={closeModal} />
    </>
  );
};
