"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import PredefinedZones from "./PredefinedZones";
import ZoneCreationToolbar from "./ZoneCreationToolbar";
import { GrUndo } from "react-icons/gr";
import { GoAlert } from "react-icons/go";
import InputField from "@/Components/Global/InputField";
import useField from "@/hooks/useField";
import { MdOutlineAbc, MdOutlineAddLocation } from "react-icons/md";
import { addAlert } from "@/api/alertApi";
import { deleteZone } from "@/api/zonesApi";
import StatusMessage from "@/Components/Global/StatusMessage";

const AssigningAlert = ({ setAssignAlert, selectedZone }) => {
  const namePattern = /^[a-zA-Z0-9_\-\s]+$/;
  const alertName = useField("", (value) => namePattern.test(value));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [repeat, setRepeat] = useState("");
  const [severity, setSeverity] = useState("");
  const [type, setType] = useState("");
  const [notificationTypes, setNotificationTypes] = useState({
    sms: false,
    email: false,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (
      !alertName.value ||
      !alertName.isValid ||
      !startDate ||
      (endDate && new Date(endDate) < new Date(startDate)) ||
      !message.trim() ||
      !repeat ||
      isNaN(repeat) ||
      repeat <= 0 ||
      !severity ||
      !type
    ) {
      setError("Please insert all fields correctly.");
      return;
    }

    try {
      await addAlert({
        alertTitle: alertName.value,
        notification_type: "APP-Notification",
        gravity: severity,
        message: message.trim(),
        StartDate: `${startDate} 00:00:00`,
        EndDate: endDate ? `${endDate} 23:59:59` : null,
        frequency: String(repeat),
        type: type.toLowerCase(),
        ZoneSelected: selectedZone.name,
      });

      console.log("Alert successfully created");
      setAssignAlert(false);
    } catch (error) {
      console.error("Failed to create alert:", error);
      setError("Failed to create alert. Please try again.");
    }
  };

  const toggleNotification = (notifType) => {
    setNotificationTypes((prev) => ({
      ...prev,
      [notifType]: !prev[notifType],
    }));
  };

  return (
    <div className="absolute text-txt top-4 right-4 z-[1500] bg-white p-4 rounded-lg shadow-md font-space-grotesk w-[25%] max-h-[80vh] flex flex-col gap-4">
      <div className="center w-full mb-2">
        <h2 className="text-lg font-semibold">
          Assign Alert to {selectedZone?.name}
        </h2>
      </div>

      <button
        className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer"
        onClick={() => setAssignAlert(false)}
      >
        Cancel
      </button>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
        {/* Alert Name */}
        <label className="text-sm font-semibold">Alert Name</label>
        <div className="relative w-full">
          <InputField
            label=""
            iconSrc={MdOutlineAbc}
            placeholder="Enter alert name"
            inputType="text"
            isValid={
              !alertName.isValid && alertName.value && !alertName.focus
                ? false
                : true
            }
            onChange={(e) => {
              alertName.setValue(e.target.value);
              setError(null);
            }}
            value={alertName.value}
            errorMessage="Please enter a valid alert name"
            holderClassName=""
            containerClassName=" mb-[1em]"
            inputClassName="!p-[0.625em]"
            onFocus={() => alertName.setFocus(true)}
            onBlur={() => alertName.setFocus(false)}
          />
        </div>

        {/* Start Date */}
        <label className="text-sm font-semibold">Starting Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setError(null);
          }}
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
        />

        {/* End Date */}
        <label className="text-sm font-semibold">Ending Date (optional)</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            const newEndDate = e.target.value;
            if (startDate && new Date(newEndDate) < new Date(startDate)) {
              setError("Ending date cannot be before the starting date.");
              setEndDate(""); // Clear it if it's invalid
            } else {
              setEndDate(newEndDate);
              setError(null);
            }
          }}
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
        />

        {/* Message */}
        <label className="text-sm font-semibold">Message</label>
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError(null);
          }}
          className="w-full text-txt font-semibold p-4 min-h-16 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
          rows={4}
        />

        {/* Notification Type */}
        <label className="text-sm font-semibold">Notification Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notificationTypes.sms}
              onChange={() => toggleNotification("sms")}
            />{" "}
            SMS
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notificationTypes.email}
              onChange={() => toggleNotification("email")}
            />{" "}
            Email
          </label>
        </div>

        {/* Repeat */}
        <label className="text-sm font-semibold">Repeat (in seconds)</label>
        <input
          type="number"
          value={repeat}
          onChange={(e) => {
            setRepeat(e.target.value);
            setError(null);
          }}
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
          placeholder="e.g. 600"
        />

        {/* Severity */}
        <label className="text-sm font-semibold">Severity</label>
        <select
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value);
            setError(null);
          }}
          className="w-full p-4 rounded-lg btn-shadow font-semibold focus:outline-none transition-all duration-200"
        >
          <option value="">Select severity</option>
          <option value="severe">High</option>
          <option value="moderate">Medium</option>
          <option value="minor">Low</option>
        </select>

        {/* Type */}
        <label className="text-sm font-semibold">Type</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setError(null);
          }}
          className="w-full p-4 rounded-lg btn-shadow font-semibold focus:outline-none transition-all duration-200"
        >
          <option value="">Select type</option>
          <option value="Inondation">Inondation</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Fire">Fire</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 font-semibold text-sm">{error}</div>
      )}

      {/* Submit Button */}
      <button
        className="btn-primary w-full mt-4 py-3 font-semibold"
        onClick={handleSubmit}
      >
        Add Alert
      </button>
    </div>
  );
};

const ZoneClicked = ({ zone, onClick, assignAlert, removeAlert, setZone }) => {
  console.log("ZoneClicked component rendered with zone:", zone);

  return (
    <div
      className="absolute text-txt top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk"
      //onClick={onClick}
    >
      <div className="center w-full">
        <h2 className="text-lg font-semibold">{zone.name}</h2>
      </div>

      <button
        className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer"
        onClick={() => {
          setZone(null);
        }}
      >
        <GrUndo className="text-[1.5em]" />
        Deselect Zone
      </button>

      {zone.hasAlert ? null : (
        <button
          onClick={assignAlert}
          className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer"
        >
          <GoAlert className="text-[1.5em]" />
          Assign Alert
        </button>
      )}

      <button className="btn-primary" onClick={onClick}>
        Delete Zone
      </button>
    </div>
  );
};

const StarterToolbar = ({ onCreateZone }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
      <p className="text-sm">
        Select a <span className="font-semibold">zone</span> to get started or
      </p>
      <button className="btn-primary row gap-[0.5em]" onClick={onCreateZone}>
        <MdOutlineAddLocation className="text-2xl" />
        <span className="text-sm font-medium">Create a new zone</span>
      </button>
    </div>
  );
};

const DrawMap = () => {
  const drawnItems = useRef(new L.FeatureGroup()).current;
  const [selectedZone, setSelectedZone] = useState(null);
  const [step, setStep] = useState("initial");
  const [mapInteractable, setMapInteractable] = useState(true);

  const onMouseEnter = () => {
    console.log("Mouse entered the toolbar");
    setMapInteractable(false);
  };

  // Function to re-enable map interaction when mouse leaves the ZoneCreationToolbar
  const onMouseLeave = () => {
    console.log("Mouse left the toolbar");
    setMapInteractable(true);
  };

  useEffect(() => {
    console.log("Selected Zone:", selectedZone);
  }, [selectedZone]);

  useEffect(() => {
    if (step === "zone creation") {
      console.log("Zone creation mode activated.");
      // You could show a drawing tool or UI feedback here
    }
  }, [step]);

  const [assignAlert, setAssignAlert] = useState(false);

  //get predefined zones from the endpoint once this copo mounts

  const [predefinedZones, setPredefinedZones] = useState([]);

  /* useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await getAllZones();
        setPredefinedZones(zones);
      } catch (error) {
        console.error("Failed to fetch predefined zones:", error);
      }
    };

    fetchZones();
  }, []); */

  /* useEffect(() => {
    if (predefinedZones.length > 0) {
      predefinedZones.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.fillColor,
          fillOpacity: 0.5,
        }).addTo(drawnItems);

        polygon.on("click", () => {
          setSelectedZone(zone);
        });
      });
    }
    console.log("Predefined Zones:", predefinedZones);
  }, [predefinedZones]); */

  const [zoneCreatedFlag, setZoneCreatedFlag] = useState(false);

  const notifyZoneCreated = () => {
    // Toggle flag to trigger useEffect in PredefinedZones
    setZoneCreatedFlag((prev) => !prev);
  };

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDeleteZone = async () => {
    if (!selectedZone?.name) {
      setError("No zone selected.");
      return;
    }

    try {
      setError(null); // Clear previous errors
      const response = await deleteZone(selectedZone.name);
      console.log("Zone deleted successfully:", response);
      setSuccess("Zone deleted successfully.");
    } catch (error) {
      console.error("Failed to delete zone:", error);
      setError("Failed to delete zone.");
      setSuccess(null);
    } finally {
      setSelectedZone(null);
    }
  };

  return (
    <div className="relative w-full h-[700px]">
      <StatusMessage
        error={error}
        success={success}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />
      <div
        className={
          mapInteractable
            ? "h-full w-full"
            : "h-full w-full pointer-events-none"
        }
      >
        <MapContainer
          center={{ lat: 36.3, lng: 3 }}
          zoom={7}
          style={{ height: "100%", width: "100%", borderRadius: "1em" }}
          whenCreated={(mapInstance) => {
            drawnItems.addTo(mapInstance);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {selectedZone && step === "initial" && !assignAlert && (
            <ZoneClicked
              setZone={setSelectedZone}
              zone={selectedZone}
              onClick={handleDeleteZone}
              assignAlert={() => {
                setAssignAlert(true);
              }}
              removeAlert={() => {
                setAssignAlert(false);
              }}
            />
          )}
          {assignAlert && (
            <AssigningAlert
              setAssignAlert={setAssignAlert}
              selectedZone={selectedZone}
            />
          )}

          {step === "initial" && !selectedZone && (
            <StarterToolbar onCreateZone={() => setStep("zone creation")} />
          )}

          {step === "zone creation" && (
            <ZoneCreationToolbar
              onBack={() => setStep("initial")}
              drawnItems={drawnItems}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onZoneCreated={notifyZoneCreated}
            />
          )}

          <PredefinedZones
            drawnItems={drawnItems}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zoneCreatedFlag={zoneCreatedFlag}
          />

          {step === "zone creation" && (
            <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded shadow-md">
              <p className="text-sm font-medium text-green-600">
                Drawing mode activated.
              </p>
            </div>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DrawMap;
