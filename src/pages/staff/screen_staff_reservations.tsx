import { TableReservationList } from "@/components/tables";
import { DateSearchBox, TextSearchBox } from "../../components/input";
import { Pagination, StatCard } from "../../components/utilities";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios"; // Make sure this is your axios setup

type ReservationStats = {
  total_active_accepted_reservations: number;
  last_month_reservations: number;
  running_month_reservations: number;
};

/* Screen to list of reservations on staff end */
const ScreenStaffReservations = () => {
  const [stats, setStats] = useState<ReservationStats>({
    total_active_accepted_reservations: 0,
    last_month_reservations: 0,
    running_month_reservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          "/staff/reservations/report-reservation-status/"
        );
        setStats(res.data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const reservationData: ReservationItem[] = [
    {
      reservationId: "1122",
      customerName: "Nasi uduk",
      tableNo: "2B",
      guestNo: 4,
      cellNumber: "(205) 555-0100",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30AM",
      customRequest: "N/A",
    },
    {
      reservationId: "1122",
      customerName: "Bakso",
      tableNo: "3C",
      guestNo: 5,
      cellNumber: "(405) 555-0128",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30AM",
      customRequest: "N/A",
    },
    {
      reservationId: "1122",
      customerName: "Satay",
      tableNo: "5B",
      guestNo: 3,
      cellNumber: "(239) 555-0108",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30PM",
      customRequest: "accepted",
    },
    {
      reservationId: "1122",
      customerName: "Pepes",
      tableNo: "4A",
      guestNo: 4,
      cellNumber: "(308) 555-0121",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30AM",
      customRequest: "accepted",
    },
    {
      reservationId: "1122",
      customerName: "Sate Padang",
      tableNo: "2A",
      guestNo: 4,
      cellNumber: "(307) 555-0133",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30AM",
      customRequest: "accepted",
    },
    {
      reservationId: "1122",
      customerName: "Babi Pangang",
      tableNo: "3B",
      guestNo: 2,
      cellNumber: "(229) 555-0109",
      email: "namehere@cleverbiz.com",
      reservationTime: "12.30AM",
      customRequest: "hold",
    },
    {
      reservationId: "1122",
      customerName: "Soto",
      tableNo: "2A",
      guestNo: 1,
      cellNumber: "(316) 555-0116",
      email: "namehere@cleverbiz.com",
      reservationTime: "9.30AM",
      customRequest: "accepted",
    },
  ];
  return (
    <>
      <div className="flex flex-col">
        {/* Stats Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <StatCard
            count={stats.total_active_accepted_reservations}
            label="Active booking"
            barColor="#4F46E5"
            accentColor="#4F46E5"
          />
          <StatCard
            count={stats.last_month_reservations}
            label="Booking last month"
            barColor="#8B5CF6"
            accentColor="#8B5CF6"
          />
          <StatCard
            count={stats.running_month_reservations}
            label="Total booking (Jun)"
            barColor="#0EA5E9"
            accentColor="#0EA5E9"
          />
        </div>
        {/* Label */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-y-2 md:gap-y-0 my-4">
          <h2 className="flex-1 text-2xl text-primary-text">List of items</h2>
          <div className="flex-1 flex gap-x-4 justify-end">
            {/* Date filter */}
            <DateSearchBox />
            {/* Search box by id */}
            <TextSearchBox placeholder="Search by Reservation ID" />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg overflow-x-auto ">
          <TableReservationList data={reservationData} />
          <div className="mt-4 flex justify-center">
            <Pagination page={1} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenStaffReservations;
