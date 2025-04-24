"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { iconComponents } from "./Icons";
import { useMap } from "react-leaflet";
import { createRoot } from "react-dom/client";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Helper function to lighten the color
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

const PredefinedZones = ({ drawnItems, selectedZone, setSelectedZone }) => {
  const map = useMap();

  // Predefined zones data
  const predefinedZones = [
    {
      name: "Flood Zone",
      riskLevel: "High",
      lastChecked: "2025-04-23",
      coordinates: [
        [36.2, 2.8],
        [36.6, 2.9],
        [36.4, 4.0],
      ],
      type: "flood",
      color: "#e11d48",
      hasAlert: true,
    },
    {
      name: "Fire Zone",
      riskLevel: "High",
      lastChecked: "2025-04-23",
      coordinates: [
        [35.3, 4.0],
        [35.5, 3.2],
        [35.9, 3.5],
      ],
      type: null,
      color: "#f59e0b",
      hasAlert: false,
    },
    {
      name: "Earthquake Zone",
      riskLevel: "Medium",
      lastChecked: "2025-04-23",
      coordinates: [
        [37.1, 6.28],
        [36.5, 7.7],
        [36.2, 5.99],
      ],
      type: "earthquake",
      color: "#31486CFF",
      hasAlert: true,
    },
  ];

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
            setSelectedZone({ name: zone.name, polygon });
          } else {
            setSelectedZone(null);
          }
        });

        polygon.bindPopup(
          `<div>
            <strong>Zone Credentials</strong><br />
            Name: ${zone.name}<br />
            Risk Level: ${zone.riskLevel}<br />
            Last Checked: ${zone.lastChecked}
          </div>`
        );

        polygon.addTo(drawnItems);
        const center = polygon.getBounds().getCenter();
        renderMarker(center, zone.type);
      });
    };

    renderPredefinedZones();
  }, [map, drawnItems, setSelectedZone]);

  return null;
};

export default PredefinedZones;
