'use client';
import React from 'react';
import dynamic from "next/dynamic";
import { useParams ,useSearchParams} from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
const Position = dynamic(
  () => import("@/Components/Global/Position"),
  { 
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);


export default function currentLocation() {
  const params = useParams();
   const alert_id = params.alert_id;
   const userId = params.userId;
   const searchParams = useSearchParams();

   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");
 

   const latitude = lat ? parseFloat(lat) : 51.505; // Default: London
   const longitude = lng ? parseFloat(lng) : -0.09; // Default: London

   const username = `User ${userId}`;

  return (

     <div className="px-18 py-4 mx-auto">
    <div>
      <div className="flex items-center gap-1 text-sm pb-3">
        <span>Alerts</span>
        <span>/</span>
        <span>Alerts list</span>
        <span>/</span>
        <span>Alert{alert_id}</span>
        <span>/</span>
        <span>Impacted users</span>
        <span>/</span>
        <span>User{userId}</span>
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
       <Position
         latitude={latitude}
         longitude={longitude}
         username={username}
         />
      </div>
    </div>
    </div>
  )
}
