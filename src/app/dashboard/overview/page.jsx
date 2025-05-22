"use client";
import { useEffect, useState } from "react";
import { getFrequency, updateFrequency } from "@/api/zonesApi";

const OverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [zoneFreq, setZoneFreq] = useState("");
  const [positionFreq, setPositionFreq] = useState("");
  const [hasZone, setHasZone] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchFrequencies = async () => {
    try {
      const zoneData = await getFrequency();
      console.log("Zone data:", zoneData);

      const zoneItem = zoneData.find((item) => item.name === "zone_fetch");
      const positionItem = zoneData.find(
        (item) => item.name === "position_fetch"
      );

      if (zoneItem) {
        setZoneFreq(zoneItem.frequency);
        setHasZone(true);
      }
      if (positionItem) {
        setPositionFreq(positionItem.frequency);
        setHasPosition(true);
      }
    } catch (err) {
      setError("Failed to fetch frequencies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrequencies();
  }, []);

  const handleUpdate = async (name, frequency) => {
    try {
      setUpdating(true);
      await updateFrequency(name, parseInt(frequency));
      setSuccess(`Successfully updated ${name} frequency.`);
    } catch (err) {
      setError(`Failed to update ${name} frequency.`);
    } finally {
      setUpdating(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading frequencies...</p>
      ) : (
        <div className="space-y-6">
          {success && <p className="text-green-600 font-semibold">{success}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {/* Zone Fetch */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold">Zone Fetch (sec):</label>
            <input
              type="text"
              value={zoneFreq}
              onChange={(e) => setZoneFreq(e.target.value)}
              className="border rounded px-3 py-2 w-32"
              placeholder="Enter value"
            />
            <button
              onClick={() => handleUpdate("zone_fetch", zoneFreq)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {hasZone ? "Update" : "Add"}
            </button>
          </div>

          {/* Position Fetch */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold">Position Fetch (sec):</label>
            <input
              type="text"
              value={positionFreq}
              onChange={(e) => setPositionFreq(e.target.value)}
              className="border rounded px-3 py-2 w-32"
              placeholder="Enter value"
            />
            <button
              onClick={() => handleUpdate("position_fetch", positionFreq)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {hasPosition ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
