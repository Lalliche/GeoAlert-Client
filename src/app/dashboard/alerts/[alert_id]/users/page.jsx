"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Spinner from "@/Components/Global/Spinner";
import { MdErrorOutline } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { GrContactInfo } from "react-icons/gr";
import { TfiLocationPin } from "react-icons/tfi";

import Link from "next/link";
import DataTable from "@/Components/Table/DataTable";

const getTypeContent = (value) => {
  const colors = {
    positive: "bg-[#3CB54B]",
    negative: "bg-[#DC091A]",
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
              lat: row.current_position.latitude,
              lng: row.current_position.longitude,
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
      return row.responseDetails ? (
        <Link
          href={{
            pathname: `/dashboard/alerts/${row.alert_id}/users/${row.id}/response`,
            query: { classification: row.response },
          }}
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

//  Expected Date format

const rowData = [
  {
    id: 1,
    alert_id: 10,
    name: "Sofia Karim",
    contact: {
      email: "s.k@gmail.com",
      phone: "0555555555",
    },
    current_position: {
      latitude: "36.752887",
      longitude: "3.042048",
    },
    response: "negative",
    responseDetails: {
      date: "2025-03-05",
      time: "12:00",
      type: "vocale",
      content: "I'm safe",
    },
  },
  {
    id: 2,
    alert_id: 11,
    name: "Yacine Bensalem",
    contact: {
      email: "y.bensalem@gmail.com",
      phone: "0666123456",
    },
    current_position: {
      latitude: "35.696947",
      longitude: "-0.630813",
    },
    response: "positive",
    responseDetails: {
      date: "2025-03-06",
      time: "15:30",
      type: "text",
      content: "All clear.",
    },
  },
  {
    id: 3,
    alert_id: 12,
    name: "Lina Maouchi",
    contact: {
      email: "l.maouchi@gmail.com",
      phone: "0777123456",
    },
    current_position: {
      latitude: "36.365059",
      longitude: "6.614789",
    },
    response: "none",
    responseDetails: null,
  },
  {
    id: 4,
    alert_id: 13,
    name: "Amine Haddad",
    contact: {
      email: "amine.haddad@yahoo.com",
      phone: "0556789012",
    },
    current_position: {
      latitude: "36.00069",
      longitude: "5.75",
    },
    response: "negative",
    responseDetails: {
      date: "2025-03-07",
      time: "10:00",
      type: "text",
      content: "Need assistance.",
    },
  },
  {
    id: 5,
    alert_id: 14,
    name: "Sarah Bouzid",
    contact: {
      email: "s.bouzid@hotmail.com",
      phone: "0655123456",
    },
    current_position: {
      latitude: "36.755871",
      longitude: "5.084042",
    },
    response: "positive",
    responseDetails: {
      date: "2025-03-07",
      time: "08:45",
      type: "vocale",
      content: "All good here.",
    },
  },
  {
    id: 6,
    alert_id: 15,
    name: "Rachid Belhadj",
    contact: {
      email: "rachid.belhadj@gmail.com",
      phone: "0543234567",
    },
    current_position: {
      latitude: "33.806484",
      longitude: "-1.030134",
    },
    response: "none",
    responseDetails: null,
  },
];

const AlertDetailsPage = () => {
  const { alert_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const enhancedRowData = rowData.map((row) => ({
    ...row,
    alert_id: alert_id,
    response: row.response.toLowerCase() === "none" ? "None" : row.response,
  }));
  useEffect(() => {
    if (alert_id) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert_id]);

  return (
    <div className="min-h-screen w-full p-[2em] py-[3em] flex flex-col gap-[2em] relative">
      {!loading && (
        <Link
          href="/dashboard/alerts"
          className="absolute top-[1em] left-[1em] flex items-center gap-[0.5em]"
        >
          <IoArrowBackOutline className="text-[1em]" />
          <p className=" font-medium">Back</p>
        </Link>
      )}

      {loading ? (
        <div className="center h-screen w-full">
          <Spinner />
        </div>
      ) : error ? (
        <div className="center flex-col gap-4 h-full">
          <MdErrorOutline className="text-[1.5em] text-red-500" />
          <p className="font-medium text-txt">
            No alert with the id <span className="text-main">{alert_id}</span>{" "}
            was found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col  border-2 border-[#D0D5DD] rounded-lg p-4">
          <DataTable
            initialFontSize="12px"
            headers={headers}
            rowStructure={rowStructure}
            rowData={enhancedRowData}
            onClickContent={[]}
            rowClass={""}
            TableClass={"!border-2 !border-transparent"}
            TableText={"Alerts list"}
          />
        </div>
      )}
    </div>
  );
};

export default AlertDetailsPage;
