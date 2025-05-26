"use client";
import React, { useEffect, useState } from "react";
import { GrContactInfo } from "react-icons/gr";
import { TfiLocationPin } from "react-icons/tfi";
import { getAllUsers } from "@/api/authApi";
import Link from "next/link";
import DataTable from "@/Components/Table/DataTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[month]} ${day}, ${year}`;
};

const headers = [
  { id: "number", name: "Id", field: "id", width: "w-[20%]" },
  { id: "name", name: "Name", field: "name", width: "w-[20%]" },
  { id: "date", name: "Date", field: "date", width: "w-[20%]" },
  {
    id: "contact",
    name: "Contact Info",
    field: "contact",
    width: "w-[20%]",
    sortable: false,
  },
  {
    id: "currentposition",
    name: "Current Position",
    field: "current_position",
    width: "w-[20%]",
    sortable: false,
  },
];

const getRowStructure = (duration) => [
  {
    field: "id",
    width: "w-[20%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "name",
    width: "w-[20%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "date",
    width: "w-[20%]",
    content: (value) => <p className="text-txt">{formatDate(value)}</p>,
  },
  {
    field: "contact",
    width: "w-[20%]",
    content: (_, row) => (
      <Link
        href={`/dashboard/users/${
          row.id
        }/contactInfo?phone=${encodeURIComponent(
          row.phoneNumber
        )}&email=${encodeURIComponent(row.email)}`}
        className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
      >
        <GrContactInfo />
        <p className="text-txt">View</p>
      </Link>
    ),
  },
  {
    field: "current_position",
    width: "w-[20%]",
    content: (_, row) => (
      <Link
        href={{
          pathname: `/dashboard/users/${row.id}/location`,
          query: {
            duration,
          },
        }}
        className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:border-black flex items-center"
      >
        <TfiLocationPin />
        <p className="text-txt">View</p>
      </Link>
    ),
  },
];

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);

  const [positionDuration, setPositionDuration] = useState("1"); // Default: 1 hour
  const [customDuration, setCustomDuration] = useState(""); // Holds custom value

  const resolvedDuration =
    positionDuration === "custom" && customDuration
      ? customDuration
      : positionDuration;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Clear customDuration when positionDuration is not "custom"
  useEffect(() => {
    if (positionDuration !== "custom") {
      setCustomDuration("");
    }
  }, [positionDuration]);

  const enhancedRowData = users.map((user) => ({
    id: user.id,
    name: `${user.lastName} ${user.firstName}`,
    date: user.createdAt,
    phoneNumber: user.phoneNumber,
    email: user.email,
  }));

  return (
    <div className="w-full p-[3em] py-[1em] flex flex-col gap-[2em] relative">
      {loading ? (
        <div className="w-full flex flex-col">
          <Skeleton height={600} className="rounded-[0.6em]" />
        </div>
      ) : error ? (
        <div className="text-red-500 font-semibold text-center">
          Failed to load users.
        </div>
      ) : (
        <>
          {/* Duration Select */}
          <div className="flex flex-col gap-2 w-fit ">
            <label className="text-sm font-semibold">Position Duration</label>
            <select
              value={positionDuration}
              onChange={(e) => setPositionDuration(e.target.value)}
              className="w-full p-4 rounded-lg btn-shadow font-semibold focus:outline-none transition-all duration-200"
            >
              <option value={"0.5"}>30 minutes</option>
              <option value={"1"}>1 hour</option>
              <option value={"2"}>2 hours</option>
              <option value={"4"}>4 hours</option>
              <option value={"12"}>12 hours</option>
              <option value={"24"}>1 day</option>
              <option value={"72"}>3 days</option>
              <option value={"168"}>1 week</option>
              <option value={"720"}>1 month</option>
              <option value={"8640"}>1 year</option>
              <option value={"all"}>All</option>
              <option value={"custom"}>Custom</option>
            </select>

            {positionDuration === "custom" && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold">
                  Custom Duration (hours)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1.5"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-full p-4 rounded-lg btn-shadow font-semibold focus:outline-none transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
            <DataTable
              initialFontSize="12px"
              headers={headers}
              rowStructure={getRowStructure(resolvedDuration)}
              rowData={enhancedRowData}
              onClickContent={[]}
              rowClass={""}
              TableClass={"!border-2 !border-transparent"}
              TableText={"Users list"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
