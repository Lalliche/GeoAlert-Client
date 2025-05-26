"use client";

import React, { useState, useEffect } from "react";
import { IoChevronForward } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { getFrequency, updateFrequency } from "@/api/zonesApi";
import { TbRefreshAlert } from "react-icons/tb";
import {
  GetNotificationCooldown,
  putNotificationCooldown,
} from "@/api/notificationApi";

const severityColors = {
  severe: "#DC091A",
  moderate: "#FBA23C",
  minor: "#22A447",
};

const Frequencies = ({ success, error, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoneFreq, setZoneFreq] = useState("");
  const [positionFreq, setPositionFreq] = useState("");
  const [hasZone, setHasZone] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // === Cooldown Logic ===
  const [cooldown, setCooldown] = useState({
    minor: "",
    moderate: "",
    severe: "",
  });
  const [cooldownTemp, setCooldownTemp] = useState({
    minor: "",
    moderate: "",
    severe: "",
  });
  const [editingCooldown, setEditingCooldown] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        loading(true);
        const frequencyData = await getFrequency();
        const zone = frequencyData.find((item) => item.name === "zone_fetch");
        const pos = frequencyData.find(
          (item) => item.name === "position_fetch"
        );
        if (zone) {
          setZoneFreq(zone.frequency.toString());
          setHasZone(true);
        }
        if (pos) {
          setPositionFreq(pos.frequency.toString());
          setHasPosition(true);
        }

        const cooldownData = await GetNotificationCooldown();
        setCooldown({
          minor: cooldownData.cooldown_minor.toString(),
          moderate: cooldownData.cooldown_moderate.toString(),
          severe: cooldownData.cooldown_severe.toString(),
        });
      } catch (err) {
        error("Failed to fetch initial data.");
      } finally {
        loading(false);
      }
    };

    fetchAllData();
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
      success(`Parameter updated.`);

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

  // === Cooldown Edit Handlers ===
  const handleCooldownEditStart = () => {
    setEditingCooldown(true);
    setCooldownTemp({ ...cooldown });
  };

  const handleCooldownCancel = () => {
    setEditingCooldown(false);
    setCooldownTemp({ minor: "", moderate: "", severe: "" });
  };

  const handleCooldownConfirm = async () => {
    try {
      const parsed = {
        cooldown_minor: parseInt(cooldownTemp.minor),
        cooldown_moderate: parseInt(cooldownTemp.moderate),
        cooldown_severe: parseInt(cooldownTemp.severe),
      };

      if (Object.values(parsed).some((v) => isNaN(v))) {
        error("All cooldowns must be valid numbers.");
        return;
      }

      if (
        !(
          parsed.cooldown_severe < parsed.cooldown_moderate &&
          parsed.cooldown_moderate < parsed.cooldown_minor
        )
      ) {
        error("Cooldowns must follow: severe < moderate < minor.");
        return;
      }

      loading(true);
      await putNotificationCooldown(parsed);
      setCooldown({
        minor: cooldownTemp.minor,
        moderate: cooldownTemp.moderate,
        severe: cooldownTemp.severe,
      });
      success("Cooldown values updated.");
      setEditingCooldown(false);
    } catch (err) {
      error("Failed to update cooldown values.");
    } finally {
      loading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="border-2 border-[#D0D5DD] font-space-grotesk flex flex-col rounded-xl cursor-pointer select-none"
        onClick={toggleDropdown}
      >
        <div className="flex items-center p-[1em] gap-[0.75em]">
          <p className="text-txt font-semibold">Parameters</p>
          <IoChevronForward
            className={`text-txt transform transition-transform duration-200 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="px-[1em] pb-[1em] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zone and Position Frequencies */}
            {[
              [
                "zone_fetch",
                "Presence update interval",
                "How often GeoAlert checks and updates the list of users in a zone.",
                zoneFreq,
                setZoneFreq,
                hasZone,
              ],
              [
                "position_fetch",
                "Position update interval",
                "How often GeoAlert checks and updates the users’ current location.",
                positionFreq,
                setPositionFreq,
                hasPosition,
              ],
            ].map(([name, label, explanation, value, setter, exists]) => (
              <div
                key={name}
                className="w-full flex flex-col gap-[0.75em] px-[1em] py-[1em] rounded-xl"
              >
                <label className="font-semibold text-txt">
                  {label} (seconds)
                </label>
                <p className="text-xs text-txt">{explanation}</p>
                <div className="flex w-full items-center gap-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={editing === name ? tempValue : value}
                      onChange={(e) =>
                        editing === name
                          ? setTempValue(e.target.value)
                          : setter(e.target.value)
                      }
                      disabled={editing !== name && updating}
                      className="border border-[#D0D5DD] rounded-lg px-4 py-2 w-full pr-10"
                    />
                    <TbRefreshAlert className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                  {editing === name ? (
                    <>
                      <button
                        onClick={() => handleConfirmUpdate(name)}
                        className="bg-main text-white px-4 py-2 rounded hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <FaCheck className="text-[1.25em]" /> Confirm
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-shadow text-txt px-4 py-2 rounded hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <RxCross2 className="text-[1.25em]" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(name, value)}
                      className="bg-main text-white px-4 py-2 rounded hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {exists ? "Update" : "Add"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Cooldown Section */}
            <div className=" mt-4 pt-4 px-[1em] flex flex-col justify-center gap-[1em] w-full ">
              <label className="font-semibold text-txt mb-2 block">
                Notification cooldown by severity (seconds)
              </label>
              <p className="text-sm text-txt mb-4">
                Cooldown determines how long GeoAlert waits before sending
                another notification for the same alert severity. This helps
                prevent spamming users with alerts.
              </p>

              {["minor", "moderate", "severe"].map((type) => (
                <div key={type} className="mb-4">
                  <label className=" text-txt font-semibold capitalize flex items-center gap-2 mb-1">
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: severityColors[type],
                      }}
                    />
                    {type} alert
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        editingCooldown ? cooldownTemp[type] : cooldown[type]
                      }
                      onChange={(e) =>
                        setCooldownTemp((prev) => ({
                          ...prev,
                          [type]: e.target.value,
                        }))
                      }
                      disabled={!editingCooldown}
                      className="border border-[#D0D5DD] rounded-lg px-4 py-2 w-full pr-10"
                    />
                    <TbRefreshAlert className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              ))}

              {editingCooldown ? (
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={handleCooldownConfirm}
                    className="w-full bg-main text-white px-4 py-2 rounded hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <FaCheck className="text-[1.25em]" /> Confirm
                  </button>
                  <button
                    onClick={handleCooldownCancel}
                    className="btn-shadow w-full text-txt px-4 py-2 rounded hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <RxCross2 className="text-[1.25em]" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCooldownEditStart}
                  className="bg-main text-white mt-3 px-4 py-2 rounded hover:scale-105 transition-all"
                >
                  Update Cooldowns
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Frequencies;
