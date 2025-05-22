"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { iconComponents } from "./Icons";
import { useMap } from "react-leaflet";
import { createRoot } from "react-dom/client";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { getAllZones } from "@/api/zonesApi";

const lightenColor = (hex, amount = 0.2) => {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(
    255,
    Math.floor(((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * amount)
  );
  const g = Math.min(
    255,
    Math.floor(((num >> 8) & 255) + (255 - ((num >> 8) & 255)) * amount)
  );
  const b = Math.min(
    255,
    Math.floor((num & 255) + (255 - (num & 255)) * amount)
  );

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const PredefinedZones = ({
  drawnItems,
  selectedZone,
  setSelectedZone,
  zoneCreatedFlag,
}) => {
  const map = useMap();

  const [predefinedZones, setPredefinedZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getAllZones();
        const zones = response?.message; // <-- this is the actual array

        console.log("Fetched zones:", zones);
        console.log(
          "Fetched zones length:",
          zones[0]?.polygon?.geometry?.coordinates
        );

        const formattedZones = zones.map((zone) => ({
          name: zone.name || "Unnamed Zone",
          riskLevel: "---", // or derive if available
          lastChecked: "--", // or replace with actual if available
          coordinates:
            zone?.polygon?.geometry?.coordinates
              ?.flat()
              .map(([lng, lat]) => [lat, lng]) || [],

          type: zone?.type || null, // or hardcode if your API doesn't return it
          color: "#31486CFF", // helper function below
          hasAlert: zone?.isActive, // adjust based on actual field
          id: zone?.id || null,
        }));

        console.log("Predefined zones formatted:", formattedZones);
        setPredefinedZones(formattedZones);
      } catch (error) {
        console.error("Failed to fetch predefined zones:", error);
      }
    };

    fetchZones();
  }, [zoneCreatedFlag]);

  // Render the marker for each zone
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

    L.marker(center, { icon }).addTo(map);
  };

  // Render predefined zones and handle click events
  useEffect(() => {
    if (!map.hasLayer(drawnItems)) {
      drawnItems.addTo(map);
    }

    const renderPredefinedZones = () => {
      predefinedZones.forEach((zone) => {
        console.log("Rendering zone:", zone);
        const polygon = L.polygon(zone.coordinates, {
          color: zone.hasAlert ? zone.color : lightenColor(zone.color, 0.5),
          weight: 3,
          dashArray: zone.hasAlert ? "6, 6" : "",
        });

        // Hover effect: scale-up when hovered
        polygon.on("mouseover", () => {
          polygon.setStyle({
            weight: 4,
            color: lightenColor(zone.color, 0.3),
          });
        });

        polygon.on("mouseout", () => {
          polygon.setStyle({
            weight: 3,
            color: zone.hasAlert ? zone.color : lightenColor(zone.color, 0.5),
          });
        });

        // Pulse effect: applied to the selected polygon
        polygon.on("click", () => {
          // Reset previous selected zone style if it was different
          if (selectedZone && selectedZone.polygon !== polygon) {
            selectedZone.polygon.setStyle({
              dashArray: "",
              weight: 3,
              color: zone.hasAlert ? zone.color : lightenColor(zone.color, 0.5),
            });
          }

          // Toggle the selection
          const isDashed = polygon.options.dashArray === "6, 6";
          polygon.setStyle({
            dashArray: isDashed ? "" : "6, 6",
            weight: isDashed ? 3 : 6,
            color: zone.hasAlert ? zone.color : lightenColor(zone.color, 0.5),
          });

          if (!isDashed) {
            setSelectedZone({
              name: zone.name,
              hasAlert: zone.hasAlert,
              polygon,
              id: zone.id,
            });
          } else {
            setSelectedZone(null);
          }
        });

        polygon.bindPopup(
          `<div>
            <strong>Zone Credentials</strong><br />
            Name: ${zone.name}<br />
            ${zone.hasAlert ? "This zone has an alert!" : ""}<br />
          </div>`
        );

        polygon.addTo(drawnItems);
        const center = polygon.getBounds().getCenter();
        renderMarker(center, zone.type);
      });
    };

    renderPredefinedZones();
  }, [map, drawnItems, setSelectedZone, predefinedZones]);

  return null;
};

export default PredefinedZones;
