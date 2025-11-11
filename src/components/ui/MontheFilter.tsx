import { useState } from "react";

const MonthFilter = ({ onChange }) => {
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    onChange?.(value, selectedMonth);
  };

  return (
    <div className="flex w-full max-w-xs gap-2 items-center">
      <label htmlFor="month" className="text-sm text-gray-400 mb-1">
        Filter by Month
      </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={handleChange}
        className="border border-none bg-primary text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Months</option>
        {months.map((month) => (
          <option key={month.value} value={month.label}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthFilter;
