"use client";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { createRoot } from "react-dom/client";
import { ImCancelCircle } from "react-icons/im";
import { FaMapMarkerAlt } from "react-icons/fa";
import PresetCitySelector from "./PresetCitySelector";
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
import { addZone } from "@/api/zonesApi";
import InputField from "@/Components/Global/InputField";
import useField from "@/hooks/useField";
import StatusMessage from "@/Components/Global/StatusMessage";

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

const SecondStep = ({
  setStep,
  onBack,
  zone,
  onZoneCreated,
  presetCityName,
}) => {
  const namePattern = /^[a-zA-Z0-9_\-\s]+$/;
  const zoneName = useField(presetCityName || "", (value) =>
    namePattern.test(value)
  );

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const onDone = async () => {
    if (zoneName.isValid && zoneName.value.trim() !== "") {
      const name = zoneName.value;
      const coordinates = presetCityName ? undefined : zone;

      try {
        setLoading(true);
        const response = await addZone(name, coordinates);
        console.log("Zone added successfully:", response);
        setSuccess("Zone added successfully!");
        onZoneCreated();
        onBack();
      } catch (error) {
        console.error("Failed to add zone:", error);
        setError("Failed to add zone. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in a valid zone name.");
    }
  };

  return (
    <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1.5em] font-space-grotesk">
      <StatusMessage
        error={error}
        isLoading={loading}
        success={success}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />
      <button
        onClick={() => {
          setStep(1);
        }}
        className="w-full justify-items-start cursor-pointer"
      >
        <FiArrowLeft className="text-[1.5em]" />
      </button>

      <p className="text-sm whitespace-normal">
        Finish by <span className="font-semibold">naming your zone</span>
      </p>

      <div className="relative w-full">
        <InputField
          label=""
          iconSrc={MdOutlineAbc}
          placeholder="Enter zone name"
          inputType="text"
          isValid={
            !zoneName.isValid && zoneName.value && !zoneName.focus
              ? false
              : true
          }
          onChange={(e) => {
            zoneName.setValue(e.target.value);
            setError(null); // clear error on typing
          }}
          value={zoneName.value}
          errorMessage="Please enter a valid zone name"
          holderClassName=""
          containerClassName=" mb-[2em]"
          inputClassName="!p-[0.625em]"
          onFocus={() => zoneName.setFocus(true)}
          onBlur={() => zoneName.setFocus(false)}
          disabled={presetCityName ? true : false}
        />
      </div>

      <button
        className="btn-primary row gap-2 w-full !py-[1em]"
        onClick={onDone}
      >
        <MdDone className="text-[1.5em]" />
        <span className="font-semibold">Done</span>
      </button>

      <p className="w-full center">2/2</p>
    </div>
  );
};

const ZoneCreationToolbar = ({ onBack, drawnItems, onZoneCreated }) => {
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
  const [createdZoneName, setCreatedZoneName] = useState("");
  const [createdZone, setCreatedZone] = useState(null);
  const [createdLayers, setCreatedLayers] = useState([]);
  const [lastCreatedLayer, setLastCreatedLayer] = useState(null);

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

      console.log("Zone created:", layer);

      layer.bindPopup(
        `<div>
            <strong>Zone Credentials</strong><br />
            Name: Custom Zone<br />
            
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
      setCreatedLayers((prev) => [...prev, layer]);
      setLastCreatedLayer(layer);
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

  useEffect(() => {
    console.log("created layers are:", createdLayers);
  }, [createdLayers]);

  useEffect(() => {
    console.log("last created is:", lastCreatedLayer);
  }, [lastCreatedLayer]);

  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log("step is:", step);
  }, [step]);

  useEffect(() => {
    console.log("selected city is:", selectedCity);
  }, [selectedCity]);

  //coordinates selector

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    console.log("coordinates are:", coordinates);
    if (coordinates && activeTool !== "coordinates") {
      // If coordinates are set and no other tool is active, we can handle the zone creation based on coordinates
      const latLngs = coordinates.map((coord) => [
        coord.latitude,
        coord.longitude,
      ]);
      const polygon = L.polygon(latLngs, { color: "#3388ff" }).addTo(map);
      drawnItems.addLayer(polygon);
      setStep(2); // Move to the next step after creating the polygon
    }
  }, [coordinates]);

  //handle zone creation

  const clickNext = () => {
    console.log("hascreated layer is:", lastCreatedLayer);
    console.log("hascoordinates is:", coordinates);
    console.log("hasselected city is:", selectedCity);
    // Check if exactly one of the states is populated
    const hasCreatedLayer =
      lastCreatedLayer &&
      lastCreatedLayer._latlngs &&
      lastCreatedLayer._latlngs.length > 0;
    const hasCoordinates = coordinates && coordinates.length > 0;
    const hasSelectedCity =
      selectedCity &&
      selectedCity.coordinates &&
      selectedCity.coordinates.length > 0;

    // If none or more than one state is populated, show an error or return
    if (hasCreatedLayer + hasCoordinates + hasSelectedCity !== 1) {
      alert(
        "Please ensure exactly one option is selected (LastCreatedLayer, Coordinates, or SelectedCity)."
      );
      return;
    }

    let zoneCoordinates = [];

    // Handle each case:
    if (hasCreatedLayer) {
      // Extract coordinates from the LastCreatedLayer
      zoneCoordinates = lastCreatedLayer._latlngs[0].map((latLng) => ({
        latitude: latLng.lat,
        longitude: latLng.lng,
      }));
    } else if (hasCoordinates) {
      // Use the provided coordinates
      zoneCoordinates = coordinates.map((coord) => ({
        latitude: coord[0],
        longitude: coord[1],
      }));
    } else if (hasSelectedCity) {
      // Use the selected city's coordinates
      zoneCoordinates = selectedCity.coordinates.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));
    }

    // Store the zone coordinates in createdZone state
    setCreatedZone(zoneCoordinates);

    // Proceed to the next step
    setStep(2);
  };

  useEffect(() => {
    console.log("created zone is:", createdZone);
    console.log("created zone name is:", createdZoneName);
  }, [createdZone, createdZoneName]);

  return (
    <>
      {step === 1 && (
        <div className="absolute w-[25%] center top-4 right-0 z-[1000] bg-[rgba(255,255,255,0.9)] p-4 rounded-lg shadow-md flex flex-col gap-[1em] font-space-grotesk">
          <button
            onClick={onBack}
            className="w-full justify-items-start cursor-pointer "
          >
            <ImCancelCircle className="text-[1.5em]" />
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
            <CoordinatesSelector setCoordinates={setCoordinates} />
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
              clickNext();
            }}
          >
            <FaArrowRight className="text-[1.5em]" />
            <span className="font-semibold">Next</span>
          </button>
          <p className="w-full center">1/2</p>
        </div>
      )}

      {/*  {step === 2 && <SecondStep setStep={setStep} />} */}
      {step === 2 && (
        <SecondStep
          presetCityName={selectedCity?.name}
          setStep={setStep}
          onBack={onBack}
          zone={createdZone}
          onZoneCreated={onZoneCreated}
        />
      )}
    </>
  );
};

export default ZoneCreationToolbar;
