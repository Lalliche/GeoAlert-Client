"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";

const UserZoneMap = dynamic(
  () => import("@/Components/Global/UsersPositions"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

const ZoneUsersPage = () => {
  const params = useParams();
  const zoneIdFromParams = params?.zone_id; // assuming your dynamic route is [id]
  const [storedZone, setStoredZone] = useState(null);
  const [idMismatch, setIdMismatch] = useState(false);

  useEffect(() => {
    const zoneData = localStorage.getItem("selectedZone");
    if (zoneData) {
      console.log("Zone Data from Local Storage:", zoneData);
      const parsedZone = JSON.parse(zoneData);
      setStoredZone(parsedZone);
      if (parsedZone.id !== zoneIdFromParams) {
        setIdMismatch(true);
      } else {
        console.log("Matched Zone:", parsedZone);
      }
    } else {
      setIdMismatch(true);
    }
  }, [zoneIdFromParams]);

  // Dummy users for now — you can fetch real ones later
  const users = [
    {
      UserId: 1,
      position: {
        latitude: "35.2",
        longitude: "-0.7",
      },
      firstName: "Aboubakr",
      lastName: "Belmiloud",
      phoneNumber: "0123456789",
      id: 1,
      email: "belmiloudaboubakr.contact@gmail.com",
    },
    {
      UserId: 2,
      position: {
        latitude: "35.15",
        longitude: "-0.65",
      },
      firstName: "Lalliche",
      lastName: "Abdelhadi",
      phoneNumber: "0987654321",
      id: 2,
      email: "lalliche.abdelhadi@example.com",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Zone and Users Map</h1>
      <Link
        href={`/dashboard/zones?dash`}
        className="flex items-center gap-2 pb-4 cursor-default"
      >
        <FiArrowLeft />
        <span>Back</span>
      </Link>

      {idMismatch ? (
        <div className="flex items-center gap-2 text-red-600 font-semibold">
          <MdErrorOutline size={24} />
          <span>Zone ID mismatch or missing zone data.</span>
        </div>
      ) : (
        <UserZoneMap
          users={users}
          coordinates={storedZone?.coordinates || []}
          zone={{
            name: storedZone?.name,
            type: storedZone?.type || "Critical",
            hasAlert: storedZone?.isActive,
          }}
        />
      )}
    </div>
  );
};

export default ZoneUsersPage;
