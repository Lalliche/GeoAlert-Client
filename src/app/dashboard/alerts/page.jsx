"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/Components/Table/DataTable";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getAlerts } from "@/api/alertApi";
import Spinner from "@/Components/Global/Spinner";

const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getTypeContent = (value) => {
  const colors = {
    severe: "bg-[#DC091A]",
    moderate: "bg-[#FBA23C]",
    minor: "bg-[#3CB54B]",
  };

  return (
    <div className="row px-[0.75em] py-[0.25em] gap-[0.5em] rounded-lg box-shadow ">
      <div
        className={`w-[0.5em] h-[0.5em] rounded-full ${
          colors[value] || "bg-gray-400"
        }`}
      ></div>
      <p className="text-txt capitalize">{value}</p>
    </div>
  );
};

const getPercentageContent = (value) => {
  return (
    <div className="flex items-center gap-[0.5em]">
      <p className="text-txt">{value}</p>
      <div className="w-[1.5em] h-[1.5em]">
        <CircularProgressbar
          value={value}
          text={""}
          strokeWidth={15}
          styles={buildStyles({
            pathColor: "#3CB54B",
            trailColor: "#CFF4D2",
          })}
        />
      </div>
    </div>
  );
};

const headers = [
  { id: "name", name: "Name", field: "name", width: "w-[12%]" },

  { id: "startDate", name: "Start Date", field: "startDate", width: "w-[14%]" },
  { id: "endDate", name: "End Date", field: "endDate", width: "w-[14%]" },
  { id: "frequency", name: "Frequency", field: "frequency", width: "w-[9%]" },
  { id: "zone", name: "Zone", field: "zone", width: "w-[11%]" },
  { id: "type", name: "Type", field: "type", width: "w-[9%]" },
  { id: "severity", name: "Severity", field: "severity", width: "w-[10%]" },
  {
    id: "message",
    name: "Message",
    field: "message",
    width: "w-[11%]",
    sortable: false,
  },
  {
    id: "imp",
    name: "Impacted Users",
    field: "imp",
    width: "w-[10%]",
    sortable: false,
  },
];

const rowStructure = [
  {
    field: "name",
    width: "w-[12%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "startDate",
    width: "w-[14%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "endDate",
    width: "w-[14%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "frequency",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "zone",
    width: "w-[11%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "type",
    width: "w-[9%]",
    content: (value) => <p className="text-txt capitalize">{value}</p>,
  },
  {
    field: "severity",
    width: "w-[10%]",
    content: (value) => getTypeContent(value),
  },
  {
    field: "message",
    width: "w-[11%]",
    content: (data) => {
      return (
        <Link
          href={{
            pathname: `/dashboard/alerts/${data?.id}/message`,
            query: { message: data?.msg },
          }}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
        >
          <BsArrowsAngleExpand />
          <p className="text-txt">Expand</p>
        </Link>
      );
    },
  },
  {
    field: "imp",
    width: "w-[10%]",
    content: (_, row) => {
      return (
        <Link
          href={`/dashboard/alerts/${row.id}/users`}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:border-black flex items-center"
        >
          <FiUsers />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
];

export default function Home() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const rawData = await getAlerts();

        const formatted = rawData.map((item, index) => ({
          id: item._id,
          name: item.alertTitle || `Alert #${index + 1}`,
          date: item.StartDate,
          startDate: item.StartDate,
          endDate: item.EndDate,
          frequency: `${Number((item.frequency / 60).toFixed(2))}min`,
          zone: item.ZoneSelected,
          type: item.type,
          severity: item.gravity,
          message: {
            id: item._id,
            msg: item.message,
          },
          imp: Math.floor(Math.random() * 100), // Placeholder
        }));

        setAlerts(formatted);
      } catch (error) {
        console.error(error);
        setFetchError("Failed to fetch alerts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="flex flex-col p-4 w-full">
      {loading ? (
        <div className="center w-full h-[60vh]">
          <Spinner />
        </div>
      ) : fetchError ? (
        <p className="text-red-500">{fetchError}</p>
      ) : (
        <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
          <DataTable
            initialFontSize="12px"
            headers={headers}
            rowStructure={rowStructure}
            rowData={alerts}
            onClickContent={[]}
            rowClass={""}
            TableClass={"!border-2 !border-transparent"}
            TableText={"Alerts list"}
          />
        </div>
      )}
    </div>
  );
}
