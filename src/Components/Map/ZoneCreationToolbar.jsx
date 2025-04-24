"use client";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { createRoot } from "react-dom/client";
import { ImCancelCircle } from "react-icons/im";
import { FaMapMarkerAlt } from "react-icons/fa";
import PresetCitySelector from "./PresetCitySelector";
import ColorPicker from "./ColorPicker";
import IconSelector from "./IconSelector";
import DrawButtons from "./DrawButtons";
import DeleteZonePopup from "./DeleteZonePopup";
import { MdFlood, MdDone, MdOutlineAbc } from "react-icons/md";
import { FaFireFlameSimple } from "react-icons/fa6";
import { GiPistolGun } from "react-icons/gi";
import { RiEarthquakeFill } from "react-icons/ri";
import { FaVirusCovid, FaArrowRight } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import CoordinatesSelector from "./CoordinatesSelector";
import { TbPlaceholder } from "react-icons/tb";

const iconComponents = {
  default: FaMapMarkerAlt,
  flood: MdFlood,
  fire: FaFireFlameSimple,
  gun: GiPistolGun,
  earthquake: RiEarthquakeFill,
  covid: FaVirusCovid,
};

const TimeSelectorButton = () => {
  const [expanded, setExpanded] = useState(false);
  const [seconds, setSeconds] = useState(10);

  const increment = () => setSeconds((prev) => Math.min(prev + 1, 60));
  const decrement = () => setSeconds((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full col items-center gap-4">
      <p>
        Users location will be fetched every{" "}
        <span className="font-semibold">{seconds}</span> seconds
      </p>
      <div
        className={`p-4 rounded-lg btn-shadow bg-white row gap-2 items-center transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "w-[150px]" : "w-[56px]"
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <TbPlaceholder className="text-[1.5em]" />
        {expanded && (
          <div className="row items-center min-w-20 gap-4 justify-between w-full">
            <span className="text-sm font-semibold">{seconds} sec</span>
            <div className="col items-center gap-1 justify-center">
              <button onClick={increment}>
                <FaChevronUp className="text-xs" />
              </button>
              <button onClick={decrement}>
                <FaChevronDown className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ZoneCreationToolbar = ({ onBack, drawnItems }) => {
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
  const [selectedCity, setSelectedCity] = useState(null);

  const drawControlRef = useRef(null);

  const enableTool = (type) => {
    // If there's an active drawing tool, disable it
    if (drawControlRef.current) {
      drawControlRef.current.disable();
      drawControlRef.current = null;
    }

    if (activeTool === type || type === null) {
      setActiveTool(null);
      return;
    }

    setActiveTool(type);
    const shapeOptions = { color };

    if (type === "polygon") {
      drawControlRef.current = new L.Draw.Polygon(map, { shapeOptions });
    } else if (type === "rectangle") {
      drawControlRef.current = new L.Draw.Rectangle(map, { shapeOptions });
    }

    drawControlRef.current?.enable();
  };

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
    return marker;
  };

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
      setActiveTool(null);
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
    };
  };

  useEffect(() => {
    if (activeTool) {
      const cleanup = handleNewZoneCreation();
      return cleanup;
    }
    return () => {
      map.off(L.Draw.Event.CREATED);
    };
  }, [activeTool]);

  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && (
        <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
          <p className="w-full center">1/3</p>
          <button
            onClick={onBack}
            className="btn-primary w-full !p-2 row gap-[0.5em] !bg-white !text-txt btn-shadow "
          >
            <ImCancelCircle className="text-[1.5em]" />
            <span className="font-semibold">Cancel</span>
          </button>

          <p className="text-sm whitespace-normal">
            Start by <span className="font-semibold">outlining your zone</span>{" "}
            on the map
          </p>

          <div className="w-full col gap-0">
            <PresetCitySelector
              showPresets={showPresets}
              setShowPresets={setShowPresets}
              map={map}
              drawnItems={drawnItems}
              selectedPresetLayer={selectedPresetLayer}
              setSelectedPresetLayer={setSelectedPresetLayer}
              selectedPresetMarker={selectedPresetMarker}
              setSelectedPresetMarker={setSelectedPresetMarker}
              color={color}
              selectedIcon={selectedIcon}
              renderMarker={renderMarker}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
            <CoordinatesSelector />
            <DrawButtons activeTool={activeTool} enableTool={enableTool} />
          </div>

          {selectedZoneRef.current && showDeletePopup && (
            <DeleteZonePopup
              selectedZoneRef={selectedZoneRef}
              selectedPresetMarker={selectedPresetMarker} // Pass marker here
              drawnItems={drawnItems}
              setSelectedZoneName={setSelectedZoneName}
              setShowDeletePopup={setShowDeletePopup}
            />
          )}

          <button
            className="btn-primary row gap-2 w-full !py-[1em]"
            onClick={() => {
              setStep(2);
            }}
          >
            <FaArrowRight className="text-[1.5em]" />
            <span className="font-semibold">Next</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
          <p className="w-full center">2/3</p>
          <button
            onClick={
              () => {
                setStep(1);
              } /* Reset the state when going back */
            }
            className="btn-primary w-full !p-2 row gap-[0.5em] !bg-white !text-txt btn-shadow "
          >
            <FiArrowLeft className="text-[1.5em]" />
            <span className="font-semibold">Go back</span>
          </button>

          <p className="text-sm whitespace-normal">
            Add a <span className="font-semibold">warning outline</span> to
            alert people in zone
          </p>

          <TimeSelectorButton />

          <button
            className="btn-primary row gap-2 w-full !py-[1em]"
            onClick={() => {
              setStep(3);
            }}
          >
            <FaArrowRight className="text-[1.5em]" />
            <span className="font-semibold">Next</span>
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
          <p className="w-full center">3/3</p>
          <button
            onClick={() => {
              setStep(2);
            }}
            className="btn-primary w-full !p-2 row gap-[0.5em] !bg-white !text-txt btn-shadow "
          >
            <FiArrowLeft className="text-[1.5em]" />
            <span className="font-semibold">Go back</span>
          </button>

          <p className="text-sm whitespace-normal">
            Finish by <span className="font-semibold">naming your zone</span>
          </p>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Zone name"
              className="w-full text-txt font-semibold p-4 pr-10 rounded-lg btn-shadow focus:outline-none transition-all duration-200"
            />
            <MdOutlineAbc className="absolute right-3 top-1/2 -translate-y-1/2 text-[2em] text-gray-500" />
          </div>

          <button
            className="btn-primary row gap-2 w-full !py-[1em]"
            onClick={() => {
              onBack();
            }}
          >
            <MdDone className="text-[1.5em]" />
            <span className="font-semibold">Done</span>
          </button>
        </div>
      )}
    </>
  );
};

export default ZoneCreationToolbar;
