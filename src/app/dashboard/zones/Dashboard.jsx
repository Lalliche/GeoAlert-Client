"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "@/Components/Global/Spinner";
import { MdErrorOutline } from "react-icons/md";
import { getZones } from "@/api/zonesApi";
import StatusMessage from "@/Components/Global/StatusMessage";
import DataTable from "@/Components/Table/DataTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Animated green heartbeat dot
const HeartBeatDot = () => (
  <div className="relative">
    <div className="w-[4px] h-[4px] bg-green-500 rounded-full animate-ping absolute top-0 left-0" />
    <div className="w-[4px] h-[4px] bg-green-500 rounded-full relative z-10" />
  </div>
);

const headers = [
  {
    id: "name",
    name: "Zone Name",
    field: "name",
    width: "w-[40%]",
  },
  {
    id: "hasAlert",
    name: "Alert",
    field: "isActive",
    width: "w-[20%]",
  },
  {
    id: "users",
    name: "In-Zone Users",
    field: "link",
    width: "w-[40%]",
    sortable: false,
  },
];

const rowStructure = [
  {
    field: "name",
    width: "w-[40%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "isActive",
    width: "w-[20%]",
    content: (value) => (
      <p className="text-txt">{value ? "Assigned" : "Unassigned"}</p>
    ),
  },
  {
    field: "link",
    width: "w-[40%]",
    content: (_, row) => {
      const handleClick = () => {
        const zoneData = {
          id: row.id,
          name: row.name,
          isActive: row.isActive,
          coordinates: row.coordinates,
        };
        localStorage.setItem("selectedZone", JSON.stringify(zoneData));
      };

      return (
        <Link
          href={`/dashboard/zones/dashboard/${row.id}/users`}
          onClick={handleClick}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
        >
          <HeartBeatDot />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
];

const ZoneDash = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getZones();
        console.log("Fetched zones:", response);

        const formatted = response.map((zone) => ({
          name: zone.name,
          isActive: zone.isActive,
          id: zone._id,
          coordinates: zone.coordinates,
        }));
        console.log("Formatted zones:", formatted);

        setZones(formatted);
        setFetchError(null);
      } catch (err) {
        console.error(err);
        setFetchError("Failed to fetch zones.");
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  return (
    <div className="min-h-screen w-full p-[2em] py-[3em] flex flex-col gap-[2em] relative">
      <StatusMessage
        error={fetchError}
        success={success}
        isLoading={loading}
        hideAlert={() => {
          setFetchError(null);
          setSuccess(null);
        }}
      />

      {loading ? (
        <div className="w-full flex flex-col">
          <Skeleton height={600} className="rounded-[0.6em]" />
        </div>
      ) : fetchError ? (
        <div className="center flex-col gap-4 h-full">
          <MdErrorOutline className="text-[1.5em] text-red-500" />
          <p className="font-medium text-txt">{fetchError}</p>
        </div>
      ) : (
        <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
          <DataTable
            initialFontSize="12px"
            headers={headers}
            rowStructure={rowStructure}
            rowData={zones}
            onClickContent={[]}
            rowClass={""}
            TableClass={"!border-2 !border-transparent"}
            TableText={"Zones"}
          />
        </div>
      )}
    </div>
  );
};

export default ZoneDash;
