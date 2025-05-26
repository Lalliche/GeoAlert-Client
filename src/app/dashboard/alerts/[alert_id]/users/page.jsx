"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Spinner from "@/Components/Global/Spinner";
import { MdErrorOutline } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { GrContactInfo } from "react-icons/gr";
import { TfiLocationPin } from "react-icons/tfi";
import StatusMessage from "@/Components/Global/StatusMessage";
import { impactedUsers } from "@/api/notificationApi";
import dynamic from "next/dynamic";
const AlertAnalytics = dynamic(
  () => import("@/Components/Statistics/AlertAnalytics"),
  { ssr: false }
);
import Link from "next/link";
import DataTable from "@/Components/Table/DataTable";

const getTypeContent = (value) => {
  const colors = {
    Replied: "bg-[#3CB54B]",

    None: "bg-white",
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

const headers = [
  {
    id: "name",
    name: "Name",
    field: "name",
    width: "w-[20%]",
  },
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
  {
    id: "response",
    name: "Response",
    field: "response",
    width: "w-[20%]",
    sortable: false,
  },
  {
    id: "responseDetails",
    name: "Response Details",
    field: "responseDetails",
    width: "w-[20%]",
  },
];

const rowStructure = [
  {
    field: "name",
    width: "w-[20%]",
    content: (value) => <p className="text-txt  ">{value}</p>,
  },
  {
    field: "contact",
    width: "w-[20%]",
    content: (contactData, row) => {
      return (
        <Link
          href={`/dashboard/alerts/${row.alert_id}/users/${row.id}/contactInfo`}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
        >
          <GrContactInfo />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
  {
    field: "current_position",
    width: "w-[20%]",
    content: (value, row) => {
      return (
        <Link
          href={{
            pathname: `/dashboard/alerts/${row.alert_id}/users/${row.id}/location`,
            query: {
              duration: "all",
            },
          }}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:border-black flex items-center"
        >
          <TfiLocationPin />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
  {
    field: "response",
    width: "w-[20%]",
    content: (value) => getTypeContent(value),
  },
  {
    field: "responseDetails",
    width: "w-[20%]",
    content: (contactData, row) => {
      const pathname = usePathname();

      const handleClick = () => {
        if (row.responseDetails) {
          localStorage.setItem("reply", JSON.stringify(row.responseDetails));
        }
      };

      return row.responseDetails ? (
        <Link
          href={{
            pathname: `/dashboard/alerts/${row.alert_id}/users/${row.id}/response`,
            query: { classification: row.response },
          }}
          onClick={handleClick}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center"
        >
          <BsArrowsAngleExpand />
          <p className="text-txt">Expand</p>
        </Link>
      ) : (
        <p className="text-txt">None</p>
      );
    },
  },
];

const AlertDetailsPage = () => {
  const { alert_id } = useParams();
  const [rowDataa, setRowDataa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!alert_id) {
        setFetchError("Missing alert ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await impactedUsers(alert_id);
        const data = response?.data;
        console.log("Response data:", data); // Debugging line

        const formatted = data?.map(({ user, reply }) => {
          let responseDetails = null;
          let response = "None";

          if (reply !== null) {
            response = "Replied";

            const dateObj = new Date(reply.reply_date);
            const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
            const time = dateObj.toTimeString().split(" ")[0].slice(0, 5); // HH:mm

            const type = reply.audio_url ? "audio" : "text";

            responseDetails = {
              date,
              time,
              type,
              content: reply.text || "",
              ...(reply.audio_url && { audio_url: reply.audio_url }),
            };
          }

          return {
            id: user.id,
            alert_id,
            name: `${user.first_name} ${user.last_name}`,
            contact: {
              email: user.email,
              phone: user.phone_number,
            },
            current_position: {
              user_id: user.id,
            },
            response,
            responseDetails,
          };
        });

        console.log("Formatted data:", formatted); // Debugging line

        setRowDataa(formatted);
        setSuccess("Impacted users fetched successfully.");
        setError(false);
        setFetchError(null);
      } catch (err) {
        console.error(err);
        setFetchError("Failed to fetch impacted users.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [alert_id]);

  useEffect(() => {
    console.log("Row data updated:", rowDataa); // Debugging line
  }, [rowDataa]);

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

      {!loading && (
        <Link
          href="/dashboard/alerts"
          className="absolute top-[1em] left-[1em] flex items-center gap-[0.5em]"
        >
          <IoArrowBackOutline className="text-[1em]" />
          <p className=" font-medium">Back</p>
        </Link>
      )}

      {loading ? null : error ? (
        <div className="center flex-col gap-4 h-full">
          <MdErrorOutline className="text-[1.5em] text-red-500" />
          <p className="font-medium text-txt">
            No alert with the ID <span className="text-main">{alert_id}</span>{" "}
            was found.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
            <DataTable
              initialFontSize="12px"
              headers={headers}
              rowStructure={rowStructure}
              rowData={rowDataa}
              onClickContent={[]}
              rowClass={""}
              TableClass={"!border-2 !border-transparent"}
              TableText={"Impacted Users"}
            />
          </div>
          <div>
            <AlertAnalytics />
          </div>
        </>
      )}
    </div>
  );
};

export default AlertDetailsPage;
