"use client";
import { useEffect, useState } from "react";
import { getFrequency, updateFrequency } from "@/api/zonesApi";
import { getAllTypes, addTypeAlert } from "@/api/alertApi"; // Adjust path if needed
import { icons } from "@/lib/alertIcons"; // Adjust path if needed

const OverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [zoneFreq, setZoneFreq] = useState("");
  const [positionFreq, setPositionFreq] = useState("");
  const [hasZone, setHasZone] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [typeName, setTypeName] = useState("");
  const [typeColor, setTypeColor] = useState("#000000");
  const [selectedIconName, setSelectedIconName] = useState(null);
  const [addingType, setAddingType] = useState(false);

  const [allTypes, setAllTypes] = useState([]);

  const fetchTypes = async () => {
    try {
      const data = await getAllTypes();
      console.log("Fetched types:", data);
      setAllTypes(data);
    } catch (err) {
      setError("Failed to fetch alert types.");
    }
  };

  const fetchFrequencies = async () => {
    try {
      const zoneData = await getFrequency();
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
    fetchTypes();
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

  const handleAddType = async () => {
    if (!typeName || !selectedIconName || !typeColor) {
      setError("All type fields are required.");
      return;
    }
    try {
      setAddingType(true);
      await addTypeAlert({
        name: typeName,
        color: typeColor,
        icon: selectedIconName,
      });
      setSuccess("Alert type added successfully.");
      setTypeName("");
      setSelectedIconName(null);
      setTypeColor("#000000");
    } catch (err) {
      setError("Failed to add alert type.");
    } finally {
      setAddingType(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {loading ? (
        <p>Loading frequencies...</p>
      ) : (
        <>
          {success && <p className="text-green-600 font-semibold">{success}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <div className="space-y-6">
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
              <label className="w-40 font-semibold">
                Position Fetch (sec):
              </label>
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

          {/* Add Alert Type */}
          <div className="mt-12 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Add Alert Type</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Type name"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="border px-4 py-2 rounded"
              />

              <input
                type="color"
                value={typeColor}
                onChange={(e) => setTypeColor(e.target.value)}
                className="w-20 h-10 border rounded"
              />

              <div className="grid grid-cols-6 gap-4">
                {Object.entries(icons).map(([name, IconComponent]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedIconName(name)}
                    className={`p-2 border rounded text-2xl hover:bg-gray-200 transition ${
                      selectedIconName === name
                        ? "bg-blue-100 border-blue-500"
                        : ""
                    }`}
                  >
                    {IconComponent}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddType}
                disabled={addingType}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-fit"
              >
                {addingType ? "Adding..." : "Add Alert Type"}
              </button>
            </div>
          </div>

          {/* Display Type Names Only */}
          <div className="pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Alert Type Names</h2>
            <ul className="list-disc list-inside space-y-1">
              {allTypes.map((type) => (
                <li key={type.name} className="text-gray-800">
                  {type.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default OverviewPage;
