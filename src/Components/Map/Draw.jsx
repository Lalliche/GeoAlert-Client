"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { addAlert, getAllTypes } from "@/api/alertApi";
import { deleteZone } from "@/api/zonesApi";
import StatusMessage from "@/Components/Global/StatusMessage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { IoFilter } from "react-icons/io5";

const ZoneFilter = ({ alertType }) => {
  const [allTypes, setAllTypes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await getAllTypes();
        setAllTypes(data);
      } catch (err) {
        setError("Failed to fetch alert types.");
        console.error(err);
      }
    };

    fetchTypes();
  }, []);

  const handleSelect = (typeName) => {
    setSelectedType(typeName);
    alertType(typeName);
    setShowDropdown(false);
  };

  return (
    <div
      className="absolute text-txt top-2 left-12 z-[1000]  p-4  flex flex-col gap-[1em] font-space-grotesk"
      style={{ width: "max-content" }}
    >
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 shadow-sm"
      >
        <IoFilter size={20} />
        <span className="text-sm">
          {selectedType === "all" ? "All Types" : selectedType}
        </span>
      </button>

      {showDropdown && (
        <div className="flex flex-col gap-[1em] bg-white mt-4 max-h-60 overflow-auto">
          <div
            onClick={() => handleSelect("all")}
            className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded"
          >
            All Types
          </div>
          {allTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleSelect(type.name)}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded"
            >
              {type.name}
            </div>
          ))}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

const AssigningAlert = ({
  setAssignAlert,
  selectedZone,
  setError,
  setSuccess,
  setLoading,
}) => {
  const namePattern = /^[a-zA-Z0-9_\-\s]+$/;
  const alertName = useField("", (value) => namePattern.test(value));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [repeat, setRepeat] = useState("");
  const [severity, setSeverity] = useState("");
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getAllTypes();
        const typesArray = response || [];

        // Extract only the names
        const typeNames = typesArray.map((type) => type.name);

        setTypes(typeNames);
      } catch (error) {
        console.error("Error fetching types:", error);
        setError("Failed to fetch types.");
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    console.log("Fetched types:", types);
  }, [types]);

  const [error, setTheError] = useState(null);

  const handleSubmit = async () => {
    if (
      !alertName.value ||
      !alertName.isValid ||
      !startDateTime ||
      !message.trim() ||
      !repeat ||
      isNaN(repeat) ||
      repeat <= 0 ||
      !severity ||
      !type ||
      (endDateTime &&
        format(endDateTime, "yyyy-MM-dd HH:mm") <=
          format(startDateTime, "yyyy-MM-dd HH:mm"))
    ) {
      setTheError("Please insert all fields correctly.");
      console.log("Error in form submission");
      console.log("🔍 Debug Alert Submission:");
      console.log("Alert Name:", alertName.value);
      console.log("Start DateTime:", startDate);
      console.log("End DateTime:", endDate || "N/A");
      console.log("Message:", message.trim());
      console.log("Repeat (s):", repeat);
      console.log("Severity:", severity);
      console.log("Type:", type);

      return;
    }

    try {
      setLoading(true);
      console.log("Type:", type);

      await addAlert({
        alertTitle: alertName.value,
        notification_type: "APP-Notification",
        gravity: severity,
        message: message.trim(),
        StartDate: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
        EndDate: endDateTime
          ? format(endDateTime, "yyyy-MM-dd HH:mm:ss")
          : null,

        frequency: String(repeat),
        type: type.toLowerCase(),
        ZoneSelected: selectedZone.name,
      });
      setSuccess("Alert successfully created");
      setAssignAlert(false);
    } catch (error) {
      console.error("Failed to create alert:", error);
      setError("Failed to create alert. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Start Date & Time */}
        <label className="text-sm font-semibold">Start Date & Time</label>
        <DatePicker
          selected={startDateTime}
          onChange={(date) => {
            setStartDateTime(date);
            setError(null);
          }}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          placeholderText="Select start date and time"
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
        />

        {/* End Date & Time */}
        <label className="text-sm font-semibold">
          End Date & Time (optional)
        </label>
        <DatePicker
          selected={endDateTime}
          onChange={(date) => {
            console.log("End date selected:", date);
            if (startDateTime && date < startDateTime) {
              setError("Ending date cannot be before the starting date.");
              setEndDateTime(null);
            } else {
              setEndDateTime(date);
              setError(null);
            }
          }}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          placeholderText="Select end date and time"
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
          {types.map((t, index) => (
            <option key={index} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
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

  const [zoneCreatedFlag, setZoneCreatedFlag] = useState(false);

  const notifyZoneCreated = () => {
    console.log("Zone created/deleteing notification triggered.");
    setZoneCreatedFlag((prev) => !prev);
  };

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success === "Alert successfully created") {
      notifyZoneCreated();
    }
  }, [success]);

  const handleDeleteZone = async () => {
    if (!selectedZone?.name) {
      setError("No zone selected.");
      return;
    }

    if (selectedZone.hasAlert) {
      setInfo("Cannot delete a zone with an assigned alert.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Deleting zone:", selectedZone);
      const response = await deleteZone(selectedZone.id);
      console.log("Zone deleted successfully:", response);
      setSuccess("Zone deleted successfully.");
      notifyZoneCreated();
    } catch (error) {
      console.error("Failed to delete zone:", error);
      setError("Failed to delete zone.");
      setSuccess(null);
    } finally {
      setSelectedZone(null);
      setLoading(false);
    }
  };

  const [alertType, setAlertType] = useState("all");

  return (
    <div className="relative w-full h-[700px]">
      <StatusMessage
        error={error}
        success={success}
        info={info}
        isLoading={loading}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
          setInfo(null);
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

          <ZoneFilter alertType={setAlertType} />

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
              setError={setError}
              setSuccess={setSuccess}
              setLoading={setLoading}
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
