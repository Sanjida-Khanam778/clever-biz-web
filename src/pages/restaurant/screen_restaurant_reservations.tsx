import { TableReservationList } from "@/components/tables";
import { DateSearchBox, TextSearchBox } from "../../components/input";
import { Pagination, StatCard } from "../../components/utilities";
import { useEffect, useState } from "react";
import { useOwner } from "@/context/ownerContext";

/* Screen to list of reservations on staff end */
const ScreenRestaurantReservations = () => {
  const {
    reservations,
    reservationsCount,
    reservationsCurrentPage,
    reservationsSearchQuery,
    reservationStatusReport,
    fetchReservations,
    fetchReservationStatusReport,
    setReservationsCurrentPage,
    setReservationsSearchQuery,
  } = useOwner();

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(reservationsSearchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [reservationsSearchQuery]);

  // Load reservations and status report on component mount
  useEffect(() => {
    fetchReservations(reservationsCurrentPage, debouncedSearchQuery);
    fetchReservationStatusReport();
  }, [
    reservationsCurrentPage,
    debouncedSearchQuery,
    fetchReservations,
    fetchReservationStatusReport,
  ]);

  const handlePageChange = (page: number) => {
    setReservationsCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setReservationsSearchQuery(query);
    setReservationsCurrentPage(1); // Reset to first page when searching
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Stats Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <StatCard
            count={
              reservationStatusReport?.total_active_accepted_reservations || 0
            }
            label="Active booking"
            barColor="#4F46E5" // indigo
            accentColor="#4F46E5"
          />
          <StatCard
            count={reservationStatusReport?.last_month_reservations || 0}
            label="Booking last month"
            barColor="#8B5CF6" // violet
            accentColor="#8B5CF6"
          />
          <StatCard
            count={reservationStatusReport?.running_month_reservations || 0}
            label="Total booking (Jun)"
            barColor="#0EA5E9" // sky blue
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
            <TextSearchBox
              placeholder="Search by Reservation ID"
              value={reservationsSearchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        {/* List of content */}
        <div className="bg-sidebar p-4 rounded-lg overflow-x-auto ">
          <TableReservationList data={reservations} />
          <div className="mt-4 flex justify-center">
            <Pagination
              page={reservationsCurrentPage}
              total={reservationsCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenRestaurantReservations;
