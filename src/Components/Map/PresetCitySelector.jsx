import { useEffect, useState } from "react";
import { IoChevronForward, IoChevronDownSharp } from "react-icons/io5";
import { GiAlgeria } from "react-icons/gi";

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

const PresetCitySelector = ({
  showPresets,
  setShowPresets,
  map,
  color,
  selectedIcon,
  drawnItems,
  selectedPresetLayer,
  setSelectedPresetLayer,
  selectedPresetMarker,
  setSelectedPresetMarker,
  selectedCity,
  setSelectedCity,
  renderMarker,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (showPresets) {
      setSelectedCity(presetCities.find((city) => city.name === "Algiers"));
    }
  }, [showPresets]);

  const handleCitySelect = (city) => {
    if (selectedPresetLayer) {
      drawnItems.removeLayer(selectedPresetLayer);
      setSelectedPresetLayer(null);
    }

    if (selectedPresetMarker) {
      map.removeLayer(selectedPresetMarker);
      setSelectedPresetMarker(null);
    }

    const polygon = L.polygon(city.coordinates, { color }).addTo(drawnItems);
    polygon.bindPopup(`<strong>${city.name}</strong> - Preset zone`);
    const center = polygon.getBounds().getCenter();
    const marker = renderMarker(center, selectedIcon);

    setSelectedPresetLayer(polygon);
    setSelectedPresetMarker(marker);
    setSelectedCity(city);
  };

  return (
    <div className="w-full  p-4 center col gap-4">
      <button
        className="text-sm text-txt font-semibold row gap-2 items-center"
        onClick={() => {
          if (showPresets) {
            if (selectedPresetLayer) {
              drawnItems.removeLayer(selectedPresetLayer);
              setSelectedPresetLayer(null);
            }
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
              className="p-3 w-fit btn-shadow bg-white text-[1.25em] rounded-lg row gap-2 items-center justify-start relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <GiAlgeria />
              {selectedCity.name}
              <div className="center">
                <IoChevronDownSharp className="text-[1em]" />
              </div>

              {showDropdown && (
                <div className="absolute top-[105%] bg-white rounded-lg btn-shadow max-h-[100px] overflow-y-auto w-full">
                  {presetCities
                    .filter((city) => city.name !== selectedCity.name)
                    .map((city) => (
                      <button
                        key={city.name}
                        className="p-2 btn-shadow bg-white text-[0.75em] rounded row gap-2 items-center justify-start w-full hover:bg-gray-200"
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
  );
};

export default PresetCitySelector;
