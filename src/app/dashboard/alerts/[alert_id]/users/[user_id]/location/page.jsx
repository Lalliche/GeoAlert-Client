"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getUserTracking } from "@/api/zonesApi"; // adjust path as needed

const Position = dynamic(() => import("@/Components/Global/Position"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function CurrentLocation() {
  const params = useParams();
  const alert_id = params.alert_id;
  const userId = params.user_id;
  const searchParams = useSearchParams();
  const duration = searchParams.get("duration");

  const [coordinates, setCoordinates] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function fetchTracking() {
      try {
        const data = await getUserTracking(userId, duration);

        if (!Array.isArray(data) || data.length === 0) {
          setNoData(true);
          return;
        }

        // flatten coordinates array: [[lat, lng], [lat, lng], ...]
        const allCoords = data.flatMap((entry) =>
          entry.position.map((pos) => [pos.latitude, pos.longitude])
        );
        setCoordinates(allCoords);
        setNoData(false);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        setNoData(true);
      }
    }

    fetchTracking();
  }, [userId, duration]);

  const username = `User ${userId}`;

  return (
    <div className="px-18 py-4 mx-auto">
      <div>
        <div className="flex items-center gap-1 text-sm pb-3">
          <span>Alerts</span>
          <span>/</span>
          <span>Alerts list</span>
          <span>/</span>
          <span>Alert {alert_id}</span>
          <span>/</span>
          <span>Impacted users</span>
          <span>/</span>
          <span>User {userId}</span>
          <span>/</span>
          <span className="font-medium">Location</span>
        </div>

        <Link
          href={`/dashboard/alerts/${alert_id}/users`}
          className="flex items-center gap-2 pb-4 cursor-default"
        >
          <FiArrowLeft />
          <span>Back</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          {noData ? (
            <p className="text-center text-gray-600">
              No tracking data available.
            </p>
          ) : (
            <Position username={username} coordinates={coordinates} />
          )}
        </div>
      </div>
    </div>
  );
}
