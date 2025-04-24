"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the map with SSR disabled
const DrawMap = dynamic(() => import("@/Components/Map/Draw"), {
  ssr: false,
});

const page = () => {
  return (
    <div className="center">
      <div className="col w-full h-full p-[2em] ">
        <DrawMap />
      </div>
    </div>
  );
};

export default page;
