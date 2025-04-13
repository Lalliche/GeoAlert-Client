"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/Components/Table/DataTable";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
    Extreme: "bg-red-800",
    High: "bg-[#DC091A]",
    Medium: "bg-[#FBA23C]",
    Low: "bg-[#3CB54B]",
  };

  return (
    <div className="row px-[0.75em] py-[0.25em] gap-[0.5em] rounded-lg box-shadow ">
      <div
        className={`w-[0.5em] h-[0.5em] rounded-full ${colors[value]}`}
      ></div>
      <p className="text-txt">{value}</p>
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
  {
    id: "name",
    name: "Name",
    field: "name",
    width: "w-[7%]",
  },
  {
    id: "date",
    name: "Date",
    field: "date",
    width: "w-[9%]",
  },
  {
    id: "startDate",
    name: "Start Date",
    field: "startDate",
    width: "w-[9%]",
  },
  {
    id: "endDate",
    name: "End Date",
    field: "endDate",
    width: "w-[9%]",
  },
  {
    id: "frequency",
    name: "Frequency",
    field: "frequency",
    width: "w-[9%]",
  },
  {
    id: "zone",
    name: "Zone",
    field: "zone",
    width: "w-[6%]",
  },
  {
    id: "type",
    name: "Type",
    field: "type",
    width: "w-[9%]",
  },
  {
    id: "severity",
    name: "Severity",
    field: "severity",
    width: "w-[10%]",
  },
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
  {
    id: "responsesPercentage",
    name: "Responses",
    field: "responsesPercentage",
    width: "w-[11%]",
    sortable: false,
  },
];

const rowStructure = [
  {
    field: "name",
    width: "w-[7%]",
    content: (value) => <p className="text-txt  ">{value}</p>,
  },
  {
    field: "date",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "startDate",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "endDate",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "frequency",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "zone",
    width: "w-[6%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "type",
    width: "w-[9%]",
    content: (value) => <p className="text-txt">{value}</p>,
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
          query: { message: data?.msg }
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
    content: (imp) => {
        return (
          <Link
            href={`/dashboard/alerts/${imp}/users`}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:border-black flex items-center"
        >
          <FiUsers />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
  {
    field: "responsesPercentage",
    width: "w-[11%]",
    content: (value) => getPercentageContent(value),
  },
];

//  Expected Date format

const rowData = [
  {
    id: 1,
    name: "Alert1",
    date: "2025-01-10",
    startDate: "2025-01-10",
    endDate: "2025-01-10",
    frequency: "10min",
    zone: "Batna-center",
    type: "Earthquake",
    severity: "High",
    message: {
      id: 10, //alert id
      msg: "Earthquake alert in Batna center",
    },
    imp: 10,
    responsesPercentage: 80,
  },
  {
    id: 2,
    name: "Alert2",
    date: "2025-02-15",
    startDate: "2025-02-15",
    endDate: "2025-02-15",
    frequency: "30min",
    zone: "Algiers-west",
    type: "Flood",
    severity: "Extreme",
    message: {
      id: 11,
      msg: "Flood warning in Algiers-west",
    },
    imp: 11,
    responsesPercentage: 95,
  },
  {
    id: 3,
    name: "Alert3",
    date: "2025-03-05",
    startDate: "2025-03-05",
    endDate: "2025-03-05",
    frequency: "1h",
    zone: "Oran-center",
    type: "Storm",
    severity: "Medium",
    message: {
      id: 12,
      msg: "Severe storm approaching Oran-center",
    },
    imp: 12,
    responsesPercentage: 60,
  },
  {
    id: 4,
    name: "Alert4",
    date: "2025-04-20",
    startDate: "2025-04-20",
    endDate: "2025-04-20",
    frequency: "5min",
    zone: "Constantine-south",
    type: "Heatwave",
    severity: "Low",
    message: {
      id: 13,
      msg: "High temperature alert in Constantine-south",
    },
    imp: 13,
    responsesPercentage: 30,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col p-4 w-full  ">
      <div className="flex flex-col  border-2 border-[#D0D5DD] rounded-lg p-4 ">
        <DataTable
          initialFontSize="12px"
          headers={headers}
          rowStructure={rowStructure}
          rowData={rowData}
          onClickContent={[]}
          rowClass={""}
          TableClass={"!border-2 !border-transparent  "}
          TableText={"Alerts list"}
        />
      </div>
    </div>
  );
}
