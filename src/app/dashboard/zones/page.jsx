"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Load map without SSR
const DrawMap = dynamic(() => import("@/Components/Map/Draw"), { ssr: false });
import ZoneDash from "./Dashboard";

// Toggle Button Component
const ToggleButton = ({ isMapView, setView }) => (
  <div
    className={`absolute bg-white rounded-lg p-[0.25em] top-[1em] left-1/2 transform -translate-x-1/2 z-[1000] flex gap-2
    ${!isMapView ? "border border-[#D0D5DD]" : ""}`}
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
        !isMapView ? "bg-main text-white" : "bg-white text-black"
      }`}
    >
      Table View
    </button>
  </div>
);

// Helper component to read URL param and update parent state
const ViewComponent = ({ setIsMap }) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const isMap =
      searchParams.get("map") !== null || searchParams.get("dash") === null;
    setIsMap(isMap);
  }, [searchParams, setIsMap]);
  return null;
};

const Page = () => {
  const [isMap, setIsMap] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const setView = (view) => {
    const param = view === "map" ? "map" : "dash";
    router.push(`${pathname}?${param}`);
  };

  return (
    <div className="relative w-full h-full">
      <ToggleButton isMapView={isMap} setView={setView} />
      <div
        className={`center w-full h-full px-[2em] ${!isMap ? "py-[2em]" : ""}`}
      >
        {isMap ? <DrawMap /> : <ZoneDash />}
      </div>

      <Suspense fallback={null}>
        <ViewComponent setIsMap={setIsMap} />
      </Suspense>
    </div>
  );
};

export default Page;
