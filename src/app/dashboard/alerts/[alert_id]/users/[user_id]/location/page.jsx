"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getUserTracking } from "@/api/zonesApi";

const Position = dynamic(() => import("@/Components/Global/Position"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

// Helper to extract and pass duration param
function DurationReader({ setDuration }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const duration = searchParams.get("duration");
    setDuration(duration);
  }, [searchParams, setDuration]);

  return null;
}

export default function CurrentLocation() {
  const params = useParams();
  const alertId = params.alert_id;
  const userId = params.user_id;

  const [duration, setDuration] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function fetchTracking() {
      if (!userId || !duration) return;

      try {
        const data = await getUserTracking(userId, duration);

        if (!Array.isArray(data) || data.length === 0) {
          setNoData(true);
          return;
        }

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
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm pb-3">
        <span>Alerts</span>
        <span>/</span>
        <span>Alerts list</span>
        <span>/</span>
        <span>Alert {alertId}</span>
        <span>/</span>
        <span>Impacted users</span>
        <span>/</span>
        <span>User {userId}</span>
        <span>/</span>
        <span className="font-medium">Location</span>
      </div>

      {/* Back link */}
      <Link
        href={`/dashboard/alerts/${alertId}/users`}
        className="flex items-center gap-2 pb-4 cursor-default"
      >
        <FiArrowLeft />
        <span>Back</span>
      </Link>

      {/* Map box */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        {noData ? (
          <p className="text-center text-[#7A7A7A] text-[15px]">
            No tracking data available.
          </p>
        ) : (
          <Position username={username} coordinates={coordinates} />
        )}
      </div>

      {/* Suspense boundary for query param */}
      <Suspense fallback={null}>
        <DurationReader setDuration={setDuration} />
      </Suspense>
    </div>
  );
}
