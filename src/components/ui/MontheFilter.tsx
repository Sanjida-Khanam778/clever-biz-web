import { useState } from "react";

export const MonthFilter = ({ onChange }) => {
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
    <div className="flex  gap-2 items-center">
      <select
        id="month"
        value={selectedMonth}
        onChange={handleChange}
        className="border border-none bg-primary text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Filter by month</option>
        {months.map((month) => (
          <option key={month.value} value={month.label}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const YearFilter = ({ onChange }) => {
  const [selectedYear, setSelectedYear] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
    onChange?.(value);
  };

  return (
    <div className="flex w-full  gap-2 items-center">
      <select
        id="year"
        value={selectedYear}
        onChange={handleChange}
        className="border border-none bg-primary text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Filter by year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
