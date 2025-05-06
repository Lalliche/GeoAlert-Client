import { useEffect, useState } from "react";
import { IoChevronForward, IoChevronDownSharp } from "react-icons/io5";
import { GiAlgeria } from "react-icons/gi";
import { getWilayaByName } from "@/api/zonesApi"; // Adjust path as needed

const wilayaNames = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
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
  const [loading, setLoading] = useState(false);

  const handleCitySelect = async (name) => {
    try {
      setLoading(true);

      if (selectedPresetLayer) {
        drawnItems.removeLayer(selectedPresetLayer);
        setSelectedPresetLayer(null);
      }
      if (selectedPresetMarker) {
        map.removeLayer(selectedPresetMarker);
        setSelectedPresetMarker(null);
      }

      const city = await getWilayaByName(name);
      const polygonCoords = city.coordinates.map((coord) => [
        coord?.latitude,
        coord?.longitude,
      ]);

      const polygon = L.polygon(polygonCoords, { color }).addTo(drawnItems);
      polygon.bindPopup(`<strong>${city.name}</strong> - Preset zone`);

      const center = polygon.getBounds().getCenter();
      const marker = renderMarker(center, selectedIcon);

      setSelectedPresetLayer(polygon);
      setSelectedPresetMarker(marker);
      setSelectedCity(city);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error selecting city:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 center col gap-4">
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
            setSelectedCity(null);
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
          <div
            className="p-3 w-fit btn-shadow bg-white text-[1.25em] rounded-lg row gap-2 items-center justify-start relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <GiAlgeria />
            {selectedCity ? selectedCity.name : "Select a city"}
            <div className="center">
              <IoChevronDownSharp className="text-[1em]" />
            </div>

            {showDropdown && (
              <div className="absolute top-[105%] bg-white rounded-lg btn-shadow max-h-[150px] overflow-y-auto w-full z-50">
                {wilayaNames.map((name) => (
                  <button
                    key={name}
                    className="p-2 btn-shadow bg-white text-[0.75em] rounded row gap-2 items-center justify-start w-full hover:bg-gray-200"
                    onClick={() => handleCitySelect(name)}
                    disabled={loading}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetCitySelector;
