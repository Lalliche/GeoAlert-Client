"use client";
import React from "react";
import { addZone } from "@/api/zonesApi"; // ⬅️ Import your addZone function (adjust the path if needed)

const Page = () => {
  const handleTestAddZone = async () => {
    const testZone = {
      name: "Zone huirhrhro",
      coordinates: [
        { latitude: 35.958, longitude: -0.823975 },
        { latitude: 35.117662, longitude: -2.208252 },
        { latitude: 31.407568, longitude: 1.505127 },
        { latitude: 35.315125, longitude: 3.218994 },
        { latitude: 36.489765, longitude: 1.307373 },
      ],
    };

    try {
      const response = await addZone(testZone.name, testZone.coordinates);
      console.log("Zone added successfully:", response);
      alert("Zone added successfully!");
    } catch (error) {
      console.error("Failed to add zone:", error);
      alert("Failed to add zone.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Overview Page</h1>
      <button
        onClick={handleTestAddZone}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Test Zone
      </button>
    </div>
  );
};

export default Page;
