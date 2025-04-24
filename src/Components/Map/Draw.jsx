"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdFlood, MdOutlineAddLocation } from "react-icons/md";
import { FaFireFlameSimple, FaVirusCovid } from "react-icons/fa6";
import { GiPistolGun } from "react-icons/gi";
import { FiArrowLeft } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { IoChevronForward, IoChevronDownSharp } from "react-icons/io5";
import { GiAlgeria } from "react-icons/gi";

import { RiEarthquakeFill } from "react-icons/ri";
import { createRoot } from "react-dom/client";
import PredefinedZones from "./PredefinedZones";
import ZoneCreationToolbar from "./ZoneCreationToolbar";
import { GrUndo } from "react-icons/gr";

const iconComponents = {
  default: FaMapMarkerAlt,
  flood: MdFlood,
  fire: FaFireFlameSimple,
  gun: GiPistolGun,
  earthquake: RiEarthquakeFill,
  covid: FaVirusCovid,
};

const presetCities = [
  {
    name: "Algiers",
    coordinates: [
      [36.85, 2.95],
      [36.85, 3.25],
      [36.65, 3.25],
      [36.65, 2.95],
    ],
  },
  {
    name: "Oran",
    coordinates: [
      [35.8, -0.85],
      [35.8, -0.45],
      [35.6, -0.45],
      [35.6, -0.85],
    ],
  },
  {
    name: "Constantine",
    coordinates: [
      [36.35, 6.6],
      [36.35, 6.9],
      [36.15, 6.9],
      [36.15, 6.6],
    ],
  },
  {
    name: "Annaba",
    coordinates: [
      [36.9, 7.75],
      [36.9, 8.05],
      [36.7, 8.05],
      [36.7, 7.75],
    ],
  },
];

/* const ZoneCreationToolbar = ({
  onBack,
  drawnItems,
  onMouseEnter,
  onMouseLeave,
}) => {
  const map = useMap();
  const selectedZoneRef = useRef(null);
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [color, setColor] = useState("#3388ff");
  const [selectedIcon, setSelectedIcon] = useState("default");
  const [showPresets, setShowPresets] = useState(false);
  const [selectedPresetLayer, setSelectedPresetLayer] = useState(null);
  const [selectedPresetMarker, setSelectedPresetMarker] = useState(null);

  // Enable drawing tool (polygon or rectangle)
  const enableTool = (type) => {
    if (activeTool === type) {
      setActiveTool(null);
      return;
    }
    setActiveTool(type);
    const shapeOptions = { color };

    if (type === "polygon") {
      new L.Draw.Polygon(map, { shapeOptions }).enable();
    } else if (type === "rectangle") {
      new L.Draw.Rectangle(map, { shapeOptions }).enable();
    }
  };

  // Render custom marker
  const renderMarker = (center, iconKey) => {
    const zoom = map.getZoom();
    const iconSize = Math.max(12, zoom * 2);
    const containerSize = iconSize + 8;

    const iconDiv = document.createElement("div");
    iconDiv.style.background = "white";
    iconDiv.style.borderRadius = "50%";
    iconDiv.style.width = `${containerSize}px`;
    iconDiv.style.height = `${containerSize}px`;
    iconDiv.style.display = "flex";
    iconDiv.style.alignItems = "center";
    iconDiv.style.justifyContent = "center";
    iconDiv.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";

    const IconComponent = iconComponents[iconKey] || iconComponents.default;
    const root = createRoot(iconDiv);
    root.render(<IconComponent color="red" size={iconSize} />);

    const icon = L.divIcon({
      html: iconDiv,
      className: "",
      iconSize: [containerSize, containerSize],
      iconAnchor: [containerSize / 2, containerSize / 2],
    });

    const marker = L.marker(center, { icon }).addTo(map);
    return marker; // ← return it
  };

  // Handle new zone creation by drawing a shape
  const handleNewZoneCreation = () => {
    const onCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      layer.bindPopup(
        `<div>
          <strong>Zone Credentials</strong><br />
          Name: Custom Zone<br />
          Risk Level: Unknown<br />
          Last Checked: ${new Date().toISOString().split("T")[0]}
        </div>`
      );

      const center = layer.getBounds().getCenter();
      renderMarker(center, selectedIcon);

      layer.on("click", () => {
        if (selectedZoneRef.current && selectedZoneRef.current !== layer) {
          selectedZoneRef.current.setStyle({ dashArray: "" });
        }

        const isDashed = layer.options.dashArray === "6, 6";
        layer.setStyle({ dashArray: isDashed ? "" : "6, 6" });

        selectedZoneRef.current = isDashed ? null : layer;
        setSelectedZoneName(isDashed ? null : "Custom Zone");
        setShowDeletePopup(!isDashed);
      });
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
    };
  };

  // Hook to setup drawing functionality when zone creation mode is active
  useEffect(() => {
    if (activeTool) {
      handleNewZoneCreation();
    }

    return () => {
      map.off(L.Draw.Event.CREATED);
    };
  }, [activeTool]);

  const [selectedCity, setSelectedCity] = useState(null); // Track the selected city
  const [showDropdown, setShowDropdown] = useState(false); // Control the dropdown visibility

  // Default to Algiers when presets are shown
  useEffect(() => {
    if (showPresets) {
      setSelectedCity(presetCities.find((city) => city.name === "Algiers")); // Set Algiers as the default city
    }
  }, [showPresets]);

  const handleCitySelect = (city) => {
    // Clear previous preset polygon and marker
    if (selectedPresetLayer) {
      drawnItems.removeLayer(selectedPresetLayer);
      setSelectedPresetLayer(null);
    }

    if (selectedPresetMarker) {
      map.removeLayer(selectedPresetMarker);
      setSelectedPresetMarker(null);
    }

    // Create and add polygon layer
    const polygon = L.polygon(city.coordinates, { color }).addTo(drawnItems);
    polygon.bindPopup(`<strong>${city.name}</strong> - Preset zone`);
    const center = polygon.getBounds().getCenter();

    // Render and store marker
    const marker = renderMarker(center, selectedIcon);
    setSelectedPresetMarker(marker);
    setSelectedPresetLayer(polygon);

    // Update the selected city
    setSelectedCity(city);
  };

  return (
    <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
      <p className="w-full center">1/3</p>
      <button
        onClick={onBack}
        className="btn-primary w-full !p-2 row gap-[0.5em] !bg-white !text-txt shadow-2xl !text-[1.5em]  "
      >
        <ImCancelCircle />
        <span>Cancel</span>
      </button>

      <p className="text-sm whitespace-normal  ">
        Start by <span className="font-semibold">outlining your zone</span> on
        the map
      </p>

      

      <div className="w-full border-2 border-black p-4 center col gap-4">
        <button
          className="text-sm text-txt font-semibold row gap-2 items-center"
          onClick={() => {
            if (showPresets) {
              // Remove polygon
              if (selectedPresetLayer) {
                drawnItems.removeLayer(selectedPresetLayer);
                setSelectedPresetLayer(null);
              }
              // Remove marker
              if (selectedPresetMarker) {
                map.removeLayer(selectedPresetMarker);
                setSelectedPresetMarker(null);
              }
            }
            setShowPresets(!showPresets);
          }}
        >
          Presets
          <IoChevronForward
            className={`transition-transform duration-200 ${
              showPresets ? "rotate-90" : ""
            }`}
          />
        </button>

        {showPresets && (
          <div className="w-full center !text-txt flex flex-col gap-2">
            {selectedCity && (
              <div
                className="p-3  w-fit shadow-2xl bg-white text-[1.25em]  rounded-lg row gap-2 items-center justify-start relative"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <GiAlgeria />
                {selectedCity.name}
                <div className="center">
                  <IoChevronDownSharp className="text-[1em]" />
                </div>

             
                {showDropdown && (
                  <div
                    className="absolute top-full bg-white border shadow-xl max-h-[100px] overflow-y-auto w-full"
                    style={{ maxHeight: "100px" }}
                  >
                    {presetCities
                      .filter((city) => city.name !== selectedCity.name)
                      .map((city) => (
                        <button
                          key={city.name}
                          className="p-2 shadow-2xl bg-white text-[0.75em] rounded row gap-2 items-center justify-start w-full
                          hover:bg-gray-200"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

     

      <label className="text-sm">Zone Color</label>
      <label className="text-xs text-gray-500 mb-1">
        Current selected zone is: {selectedZoneName ?? "None"}
      </label>

      
      <div className="flex flex-wrap gap-1">
        {[
          "#3388ff",
          "#e11d48",
          "#16a34a",
          "#f59e0b",
          "#8b5cf6",
          "#0ea5e9",
          "#f43f5e",
          "#14b8a6",
          "#6b7280",
          "#000000",
        ].map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            className="w-4 h-4 rounded cursor-pointer border"
            style={{
              backgroundColor: c,
              borderColor: color === c ? "black" : "transparent",
              borderWidth: "2px",
            }}
          />
        ))}
      </div>

     
      <label className="text-sm mt-2">Select Icon</label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(iconComponents).map(([key, Icon]) => (
          <div
            key={key}
            onClick={() => setSelectedIcon(key)}
            className={`p-1 rounded cursor-pointer border ${
              selectedIcon === key ? "border-black" : "border-transparent"
            }`}
          >
            <Icon size={20} />
          </div>
        ))}
      </div>

     
      <button
        onClick={() => enableTool("polygon")}
        className={`px-4 py-2 rounded ${
          activeTool === "polygon" ? "bg-blue-700" : "bg-blue-600"
        } text-white`}
      >
        Draw Polygon
      </button>
      <button
        onClick={() => enableTool("rectangle")}
        className={`px-4 py-2 rounded ${
          activeTool === "rectangle" ? "bg-green-700" : "bg-green-600"
        } text-white`}
      >
        Draw Rectangle
      </button>

      
      {selectedZoneRef.current && showDeletePopup && (
        <div className="mt-4 flex flex-col gap-2 border-t pt-2">
          <button
            onClick={() => setShowDeletePopup(true)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete Zone
          </button>

          <div className="bg-white border rounded shadow p-3">
            <p className="text-sm mb-2">
              Are you sure you want to delete this zone?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  drawnItems.removeLayer(selectedZoneRef.current);
                  setSelectedZoneName(null);
                  setShowDeletePopup(false);
                  selectedZoneRef.current = null;
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 */
import { CiSquareRemove } from "react-icons/ci";
import { GoAlert } from "react-icons/go";

const ZoneClicked = ({ zone, onClick, assignAlert, removeAlert }) => {
  return (
    <div
      className="absolute text-txt top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk"
      onClick={onClick}
    >
      <div className="center w-full">
        <h2 className="text-lg font-semibold">{zone.name}</h2>
      </div>

      <button className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer">
        <GrUndo className="text-[1.5em]" />
        Deselect Zone
      </button>

      {zone.hasAlert ? (
        <button
          onClick={removeAlert}
          className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer"
        >
          <CiSquareRemove className="text-[1.5em]" />
          Remove Alert
        </button>
      ) : (
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

import { MdOutlineAbc } from "react-icons/md";

const AssigningAlert = ({ setAssignAlert }) => {
  return (
    <div className="absolute text-txt top-4 right-4 z-[1500] bg-white p-4 rounded-lg shadow-md font-space-grotesk w-[25%] max-h-[80vh] flex flex-col gap-4">
      <div className="center w-full mb-2">
        <h2 className="text-lg font-semibold">Assign Alert</h2>
      </div>

      <button
        className="w-full center row gap-2 rounded-lg px-10 py-3 btn-shadow font-semibold cursor-pointer"
        onClick={() => setAssignAlert(false)}
      >
        Cancel
      </button>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
        <label className="text-sm font-semibold">Alert Name</label>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Alert name"
            className="w-full text-txt font-semibold p-4 pr-10 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
          />
          <MdOutlineAbc className="absolute right-3 top-1/2 -translate-y-1/2 text-[2em] text-gray-500" />
        </div>

        <label className="text-sm font-semibold">Starting Date</label>
        <input
          type="date"
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
        />

        <label className="text-sm font-semibold">Ending Date (optional)</label>
        <input
          type="date"
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
        />

        <label className="text-sm font-semibold">Message</label>
        <textarea
          placeholder="Enter your message"
          className="w-full text-txt font-semibold p-4 min-h-16 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
          rows={4}
        />

        <label className="text-sm font-semibold">Notification Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> SMS
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Email
          </label>
        </div>

        <label className="text-sm font-semibold">Repeat (in minutes)</label>
        <input
          type="number"
          className="w-full text-txt font-semibold p-4 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
          placeholder="e.g. 10"
        />
      </div>
      <button className="btn-primary w-full mt-4 py-3 font-semibold">
        Add Alert
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

  return (
    <div className="relative w-full h-[700px]">
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
              zone={selectedZone}
              onClick={() => setSelectedZone(null)}
              assignAlert={() => {
                setAssignAlert(true);
                setSelectedZone({ ...selectedZone, hasAlert: true });
              }}
              removeAlert={() => {
                setAssignAlert(false);
                setSelectedZone({ ...selectedZone, hasAlert: false });
              }}
            />
          )}
          {assignAlert && <AssigningAlert setAssignAlert={setAssignAlert} />}

          {step === "initial" && !selectedZone && (
            <StarterToolbar onCreateZone={() => setStep("zone creation")} />
          )}

          {step === "zone creation" && (
            <ZoneCreationToolbar
              onBack={() => setStep("initial")}
              drawnItems={drawnItems}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}

          <PredefinedZones
            drawnItems={drawnItems}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
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
