"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ZoneDash from "./Dashboard";

// Load map without SSR
const DrawMap = dynamic(() => import("@/Components/Map/Draw"), {
  ssr: false,
});

const ToggleButton = ({ isMapView, setView }) => {
  return (
    <div
      className={`absolute bg-white rounded-lg p-[0.25em] top-[1em] left-1/2 transform -translate-x-1/2 z-[1000] flex gap-2
    ${!isMapView ? "border border-[#D0D5DD] " : ""} 
    `}
    >
      <button
        onClick={() => setView("map")}
        className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
          isMapView ? "bg-main text-white" : "bg-white text-black"
        }`}
      >
        Map View
      </button>
      <button
        onClick={() => setView("dash")}
        className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
          !isMapView ? "bg-main text-white " : "bg-white text-black"
        }`}
      >
        Table View
      </button>
    </div>
  );
};

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isMap =
    searchParams.get("map") !== null || searchParams.get("dash") === null;

  const setView = (view) => {
    router.push(`${pathname}?${view}`);
  };

  return (
    <div className="relative w-full h-full ">
      <ToggleButton isMapView={isMap} setView={setView} />
      <div
        className={`center w-full h-full px-[2em] ${!isMap ? "py-[2em]" : ""}`}
      >
        {isMap ? <DrawMap /> : <ZoneDash />}
      </div>
    </div>
  );
};

export default Page;
