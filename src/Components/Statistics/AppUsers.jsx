import React, { useEffect, useState, useRef } from "react";
import { getUsersByDateRange } from "@/api/authApi";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

import DateInput from "../Global/DateInput";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const AppUsers = () => {
  const chartRef = useRef(null);
  /* const [startDate, setStartDate] = useState({ year: "", month: "", day: "" });
  const [endDate, setEndDate] = useState({ year: "", month: "", day: "" }); */

  const [startDate, setStartDate] = useState(null); // will hold a dayjs object or null
  const [endDate, setEndDate] = useState(null);

  const [startDateFocus, setStartDateFocus] = useState(false);
  const [endDateFocus, setEndDateFocus] = useState(false);

  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);

  /*  const formatToISODate = ({ year, month, day }) => {
    if (!year || !month || !day) return null;
    const mm = month.padStart(2, "0");
    const dd = day.padStart(2, "0");
    return `${year}-${mm}-${dd}T00:00:00`;
  }; */

  const formatToISODate = (date) => dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

  const generateDateArray = (start, end) => {
    const arr = [];
    let date = dayjs(start);

    const endDate = dayjs(end);
    while (date.isSameOrBefore(endDate, "day")) {
      arr.push(date.toDate());
      date = date.add(1, "day");
    }

    return arr;
  };

  const labelDates = (dates) => {
    const duration = dates.length;
    const usedMonths = [];
    return dates.map((date, i) => {
      if (duration < 7) {
        return date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (duration < 30) {
        const week = Math.floor(i / 7) + 1;
        return `Week ${week}`;
      } else {
        const month = date.toLocaleDateString("en-US", { month: "short" });
        if (!usedMonths.includes(month) && usedMonths.length < 9) {
          usedMonths.push(month);
          return month;
        }
        return "";
      }
    });
  };

  const fetchUsers = async (startISO, endISO) => {
    try {
      const users = await getUsersByDateRange(startISO, endISO);

      console.log("Fetched users:", users);

      /* const counts = {};
      users.forEach((user) => {
        const key = new Date(user.createdAt).toISOString().split("T")[0];
        counts[key] = (counts[key] || 0) + 1;
      });

      const dateArray = generateDateArray(startISO, endISO);
      let total = 0;
      const dataPoints = dateArray.map((d) => {
        const key = d.toISOString().split("T")[0];
        total += counts[key] || 0;
        return total;
      }); */
      const counts = {};
      users.forEach((user) => {
        const key = dayjs(user.createdAt).format("YYYY-MM-DD");
        counts[key] = (counts[key] || 0) + 1;
      });

      const dateArray = generateDateArray(startISO, endISO);
      let total = 0;
      const dataPoints = dateArray.map((d) => {
        const key = dayjs(d).format("YYYY-MM-DD");
        total += counts[key] || 0;
        return total;
      });

      let gradientFill = null;
      if (chartRef.current) {
        const chart = chartRef.current;
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        if (chartArea) {
          gradientFill = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradientFill.addColorStop(0, "rgba(220, 9, 26, 0.4)"); // 40% opacity #DC091A
          gradientFill.addColorStop(1, "rgba(220, 9, 26, 0)"); // 0% opacity
        }
      }

      setChartData({
        labels: labelDates(dateArray),
        // dates: dateArray.map((d) => d.toISOString().split("T")[0]),
        dates: dateArray.map((d) => dayjs(d).format("YYYY-MM-DD")),

        datasets: [
          {
            label: "Total Users",
            data: dataPoints,
            fill: true,
            borderColor: "#DC091A",
            backgroundColor: gradientFill || "rgba(220, 9, 26, 0.4)",
          },
        ],
      });
    } catch (err) {
      console.log("Error fetching users:", err);
      setError(
        err?.response?.data?.message === "No users found"
          ? "No users found for the selected date range."
          : "No user found."
      );
    }
  };

  const handleFetch = () => {
    setError("");

    const startISO = formatToISODate(startDate) || "2025-01-01T00:00:00";
    const endISO =
      formatToISODate(endDate) || dayjs().format("YYYY-MM-DDTHH:mm:ss");

    if (new Date(endISO) <= new Date(startISO)) {
      setError("End date must be greater than start date.");
      return;
    }

    fetchUsers(startISO, endISO);
  };

  useEffect(() => {
    const today = dayjs();
    setEndDate(today); // store the full current timestamp

    const todayFormatted = today.format("YYYY-MM-DDTHH:mm:ss");
    fetchUsers("2025-01-01T00:00:00", todayFormatted);
  }, []);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const inputClass =
    "w-20 p-1 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="w-full rounded-xl flex justify-center items-center flex-col gap-[1em] p-[1em] font-space-grotesk border border-[#D0D5DD] ">
      <p className="w-full font-titillium-web text-[2em] font-semibold text-left ">
        Authentication activity
      </p>
      <div className="flex gap-[2em] justify-center items-center w-full  ">
        <div className=" flex flex-row gap-[0.75em] items-center  ">
          <p>Starting Date</p>
          {showStartDate && (
            <DateInput
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              onFocus={() => setStartDateFocus(true)}
              onBlur={() => setStartDateFocus(false)}
              isValid={!!startDate || !startDateFocus} // you can adjust validation logic here
              errorMessage="Invalid start date"
              containerClassName=""
            />
          )}
          <div
            className="p-[0.5em] rounded-md btn-shadow "
            onClick={() => setShowStartDate(!showStartDate)}
          >
            {showStartDate ? <IoMdRemove /> : <IoMdAdd />}
          </div>
        </div>

        <div className=" flex flex-row gap-[0.75em] items-center  ">
          <p>Ending Date</p>

          {showEndDate && (
            <DateInput
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              onFocus={() => setEndDateFocus(true)}
              onBlur={() => setEndDateFocus(false)}
              isValid={!!endDate || !endDateFocus || endDate > startDate} // adjust validation
              errorMessage="Invalid end date"
              containerClassName="ml-3"
            />
          )}
          <div
            className="p-[0.5em] rounded-md btn-shadow "
            onClick={() => setShowEndDate(!showEndDate)}
          >
            {showEndDate ? <IoMdRemove /> : <IoMdAdd />}
          </div>
        </div>
        <button
          onClick={handleFetch}
          className="px-4 py-2 text-xl  bg-main text-white rounded-lg btn-shadow"
        >
          Fetch Users
        </button>
      </div>
      {error && <div className="text-red-600 mb-3 font-bold">{error}</div>}

      {chartData && (
        <div className=" h-[15em] w-full px-[3em] ">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: true,
                  displayColors: false,
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex;
                      const isoDate = chartData.dates?.[index];
                      if (!isoDate) return "";
                      const date = new Date(isoDate);
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });
                    },
                    label: (tooltipItem) =>
                      `${tooltipItem.formattedValue} Users`,
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    drawBorder: true,
                    borderWidth: 2,
                    color: "#aaa",
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                  grid: {
                    drawBorder: true,
                    borderWidth: 2,
                    color: "#aaa",
                  },
                },
              },
              elements: {
                point: {
                  radius: 0,
                  hoverRadius: 6,
                  hitRadius: 10,
                },
              },
              hover: {
                mode: "nearest",
                intersect: true,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AppUsers;
