"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { getUserTracking } from "@/api/zonesApi"; // adjust path

const Position = dynamic(() => import("@/Components/Global/Position"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function CurrentLocation() {
  const params = useParams();
  const userId = params.user_id;
  const searchParams = useSearchParams();
  const duration = searchParams.get("duration");

  const [coordinates, setCoordinates] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const data = await getUserTracking(userId, duration);

        if (!Array.isArray(data) || data.length === 0) {
          setNoData(true);
          return;
        }

        // Extract and flatten all coordinates
        const allCoords = data.flatMap((entry) =>
          entry.position.map((p) => [p.latitude, p.longitude])
        );

        setCoordinates(allCoords);
      } catch (err) {
        setNoData(true);
        console.error("Error fetching tracking data:", err);
      }
    };

    fetchTrackingData();
  }, [userId, duration]);

  const username = `User ${userId}`;

  return (
    <div className="px-18 py-4 mx-auto">
      <div>
        <div className="flex items-center gap-1 text-sm pb-3">
          <span>Users</span>
          <span>/</span>
          <span>User {userId}</span>
          <span>/</span>
          <span className="font-medium">Location</span>
        </div>

        <Link
          href={`/dashboard/users`}
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
