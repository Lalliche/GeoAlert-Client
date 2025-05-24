"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import dynamic from "next/dynamic";
import { getUserInZone } from "@/api/zonesApi"; // <-- import here

const UserZoneMap = dynamic(
  () => import("@/Components/Global/UsersPositions"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function ZoneUsersPage() {
  const params = useParams();
  const zoneId = params.zone_id;

  const [users, setUsers] = useState([]);
  const [storedZone, setStoredZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [idMismatch, setIdMismatch] = useState(false);

  useEffect(() => {
    const zoneData = localStorage.getItem("selectedZone");
    if (zoneData) {
      const parsedZone = JSON.parse(zoneData);
      setStoredZone(parsedZone);
      if (parsedZone.id !== zoneId) {
        setIdMismatch(true);
      } else {
        setIdMismatch(false);
      }
    } else {
      setIdMismatch(true);
    }
  }, [zoneId]);

  useEffect(() => {
    if (storedZone && !idMismatch) {
      const fetchUsers = async () => {
        try {
          const data = await getUserInZone(zoneId);
          setUsers(data);
          setError(false);
        } catch (err) {
          console.error("Error fetching users:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [storedZone, idMismatch, zoneId]);

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
      ) : loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load users.</p>
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
}
