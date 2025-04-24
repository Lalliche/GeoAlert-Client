"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Spinner from "@/Components/Global/Spinner";
import { GrContactInfo } from "react-icons/gr";
import { TfiLocationPin } from "react-icons/tfi";

import Link from "next/link";
import DataTable from "@/Components/Table/DataTable";



const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return `${months[month]} ${day}, ${year}`;
  
  };


const headers = [
    {
        id: "number",
        name: "No",
        field: "No",
        width: "w-[20%]",
    },
    {
        id: "name",
        name: "Name",
        field: "name",
        width: "w-[20%]",
    },
    {
     id: "date",
     name: "Date",
     field: "date",
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
];

const rowStructure =  [
    {
        field: "No",
        width: "w-[20%]",
        content: (value) => <p className="text-txt  ">{value}</p>,
      },
      {
          field: "name",
          width: "w-[20%]",
          content: (value) => <p className="text-txt  ">{value}</p>,
        },
        {
            field: "date",
            width: "w-[20%]",
            content: (value) => <p className="text-txt">{formatDate(value)}</p>,
          },
  {
    field: "contact",
    width: "w-[20%]",
    content: (contactData, row) => {
      return (
        <Link
          href={`/dashboard/users/${row.id}/contactInfo`}
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
            pathname: `/dashboard/users/${row.id}/location`,
            query: { 
              lat: row.current_position.latitude,
              lng: row.current_position.longitude
            }
          }}
          className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:border-black flex items-center"
        >
          <TfiLocationPin />
          <p className="text-txt">View</p>
        </Link>
      );
    },
  },
];

//  Expected Date format

const rowData = [
  {
    id: 1,
    No : 1,
    name: "Sofia Karim",
    date: "2025-02-15",
    contact: {
      email: "s.k@gmail.com",
      phone: "0555555555",
    },
    current_position: {
      latitude: "36.752887",
      longitude: "3.042048",
    },
  },
  {
    id: 2,
    No : 2,
    name: "Yacine Bensalem",
    date: "2025-03-25",
    contact: {
      email: "y.bensalem@gmail.com",
      phone: "0666123456",
    },
    current_position: {
      latitude: "35.696947",
      longitude: "-0.630813",
    },
  },
  {
    id: 3,
    name: "Lina Maouchi",
    date: "2025-01-02",
    No : 3,
    contact: {
      email: "l.maouchi@gmail.com",
      phone: "0777123456",
    },
    current_position: {
      latitude: "36.365059",
      longitude: "6.614789",
    },
  },
  {
    id: 4,
    name: "Amine Haddad",
    date: "2025-04-10",
    No : 4,
    contact: {
      email: "amine.haddad@yahoo.com",
      phone: "0556789012",
    },
    current_position: {
      latitude: "34.885391",
      longitude: "5.737184",
    },
  },
  {
    id: 5,
    name: "Sarah Bouzid",
    date: "2025-01-20",
    No : 5,
    contact: {
      email: "s.bouzid@hotmail.com",
      phone: "0655123456",
    },
    current_position: {
      latitude: "36.755871",
      longitude: "5.084042",
    },
  },
  {
    id: 6,
    name: "Rachid Belhadj",
    date: "2025-02-28",
    No : 6,
    contact: {
      email: "rachid.belhadj@gmail.com",
      phone: "0543234567",
    },
    current_position: {
      latitude: "33.806484",
      longitude: "-1.030134",
    },
  },
];

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const enhancedRowData = rowData.map(row => ({
    ...row,
  }));
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" w-full p-[3em] py-[1em] flex flex-col gap-[2em] relative">
      {loading ? (
        <div className="center h-screen w-full">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col border-2 border-[#D0D5DD] rounded-lg p-4">
          <DataTable
            initialFontSize="12px"
            headers={headers}
            rowStructure={rowStructure}
            rowData={enhancedRowData} 
            onClickContent={[]}
            rowClass={""}
            TableClass={"!border-2 !border-transparent"}
            TableText={"Users list"}
          />
        </div>
      )}
    </div>
  );

};

export default UsersPage;