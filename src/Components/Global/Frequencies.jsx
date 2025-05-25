"use client";

import React, { useState, useEffect } from "react";
import { IoChevronForward } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { getFrequency, updateFrequency } from "@/api/zonesApi";

const Frequencies = ({ success, error, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoneFreq, setZoneFreq] = useState("");
  const [positionFreq, setPositionFreq] = useState("");
  const [hasZone, setHasZone] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [editing, setEditing] = useState(null); // "zone_fetch" or "position_fetch"
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchFrequencies = async () => {
      try {
        loading(true);
        const data = await getFrequency();
        const zone = data.find((item) => item.name === "zone_fetch");
        const pos = data.find((item) => item.name === "position_fetch");

        if (zone) {
          setZoneFreq(zone.frequency.toString());
          setHasZone(true);
        }
        if (pos) {
          setPositionFreq(pos.frequency.toString());
          setHasPosition(true);
        }
      } catch (err) {
        error("Failed to fetch frequencies.");
      } finally {
        loading(false);
      }
    };

    fetchFrequencies();
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleStartEdit = (name, currentValue) => {
    setEditing(name);
    setTempValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setTempValue("");
  };

  const handleConfirmUpdate = async (name) => {
    if (!tempValue || isNaN(parseInt(tempValue))) {
      error("Frequency must be a number.");
      return;
    }

    try {
      setUpdating(true);
      loading(true);
      await updateFrequency(name, parseInt(tempValue));
      success(`${name} frequency updated.`);

      if (name === "zone_fetch") {
        setZoneFreq(tempValue);
        setHasZone(true);
      }
      if (name === "position_fetch") {
        setPositionFreq(tempValue);
        setHasPosition(true);
      }

      setEditing(null);
      setTempValue("");
    } catch (err) {
      error(`Failed to update ${name} frequency.`);
    } finally {
      setUpdating(false);
      loading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="border-2 border-[#D0D5DD] flex flex-col rounded-xl cursor-pointer select-none"
        onClick={toggleDropdown}
      >
        <div className="flex items-center p-[1em] gap-[0.75em]">
          <p className="text-txt font-semibold">Frequencies</p>
          <IoChevronForward
            className={`text-txt transform transition-transform duration-200 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="px-[1em] pb-[1em] flex flex-col gap-[1.5em]"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              ["zone_fetch", "Zone Fetch", zoneFreq, setZoneFreq, hasZone],
              [
                "position_fetch",
                "Position Fetch",
                positionFreq,
                setPositionFreq,
                hasPosition,
              ],
            ].map(([name, label, value, setter, exists]) => (
              <div
                key={name}
                className="w-full flex flex-col gap-[0.75em] px-[1em] py-[1em] rounded-xl border bg-[#F9FAFB]"
              >
                <label className="font-semibold text-txt">
                  {label} (seconds)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={editing === name ? tempValue : value}
                    onChange={(e) =>
                      editing === name
                        ? setTempValue(e.target.value)
                        : setter(e.target.value)
                    }
                    disabled={editing !== name && updating}
                    className="border border-[#D0D5DD] rounded-lg px-4 py-2 w-32"
                  />
                  {editing === name ? (
                    <>
                      <button
                        onClick={() => handleConfirmUpdate(name)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:scale-105 transition-all duration-200 flex items-center gap-2"
                      >
                        <FaCheck className="text-[1.25em]" />
                        Confirm
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:scale-105 transition-all duration-200 flex items-center gap-2"
                      >
                        <RxCross2 className="text-[1.25em]" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(name, value)}
                      className="bg-main text-white px-4 py-2 rounded hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      <FaCheck className="text-[1.25em]" />
                      {exists ? "Update" : "Add"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Frequencies;
