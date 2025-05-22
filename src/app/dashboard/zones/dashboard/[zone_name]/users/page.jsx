"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Spinner from "@/Components/Global/Spinner";
import StatusMessage from "@/Components/Global/StatusMessage";
import DataTable from "@/Components/Table/DataTable";
import { getUserInZone } from "@/api/zonesApi";
import { getUser } from "@/api/authApi";
import { TfiLocationPin } from "react-icons/tfi";

const headers = [
  { id: "name", name: "Name", field: "name", width: "w-[25%]" },
  { id: "phone", name: "Phone Number", field: "phone", width: "w-[20%]" },
  { id: "email", name: "Email", field: "email", width: "w-[30%]" },
  { id: "location", name: "Location", field: "location", width: "w-[25%]" },
];

const rowStructure = [
  {
    field: "name",
    width: "w-[25%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "phone",
    width: "w-[20%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "email",
    width: "w-[30%]",
    content: (value) => <p className="text-txt">{value}</p>,
  },
  {
    field: "location",
    width: "w-[25%]",
    content: (value, row) => (
      <Link
        href={`/dashboard/users/${row.id}/location?duration=all`}
        className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
      >
        <TfiLocationPin />
        <p className="text-txt">View</p>
      </Link>
    ),
  },
];

const ZoneUsersPage = () => {
  const { zone_name: rawZoneName } = useParams();
  const zone_name = decodeURIComponent(rawZoneName);

  useEffect(() => {
    const decodedZone = decodeURIComponent(zone_name);
    console.log("Zone name from params:", decodedZone);
  }, [zone_name]);

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUsersInZone = async () => {
      if (!zone_name) {
        setFetchError("Missing zone name.");
        setLoading(false);
        return;
      }

      try {
        const usersInZoneRes = await getUserInZone(zone_name);
        const userIds = usersInZoneRes || [];
        console.log("User IDs in zone:", userIds);

        const fetchedUsers = await Promise.all(
          userIds.map(async ({ UserId }) => {
            const userInfoRes = await getUser(UserId);
            const user = userInfoRes.data.data[0];

            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              phone: user.phoneNumber,
              email: user.email,
            };
          })
        );

        setRowData(fetchedUsers);
        setSuccess("Users in zone fetched successfully.");
        setFetchError(null);
      } catch (err) {
        console.error(err);
        setFetchError("Failed to fetch users in zone.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersInZone();
  }, [zone_name]);

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
        <div className="center h-screen w-full">
          <Spinner />
        </div>
      ) : fetchError ? (
        <div className="center flex-col gap-4 h-full">
          <p className="font-medium text-txt">
            No users found in zone{" "}
            <span className="text-main">{zone_name}</span>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
          <DataTable
            initialFontSize="12px"
            headers={headers}
            rowStructure={rowStructure}
            rowData={rowData}
            onClickContent={[]}
            rowClass={""}
            TableClass={"!border-2 !border-transparent"}
            TableText={`Users in ${zone_name}`}
          />
        </div>
      )}
    </div>
  );
};

export default ZoneUsersPage;
