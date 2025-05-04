"use client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

const Position = ({ username, coordinates }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading map...</div>;

  if (!coordinates || coordinates.length === 0) {
    // Render empty centered map (Algiers as default)
    return (
      <div style={{ height: "70vh" }}>
        <MapContainer
          center={[36.7538, 3.0588]} // Algiers fallback
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    );
  }

  const currentPos = coordinates[coordinates.length - 1];
  const pastCoords = coordinates.slice(0, -1);

  return (
    <div style={{ height: "70vh" }}>
      <MapContainer
        center={currentPos}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polyline positions={coordinates} color="blue" weight={4} />

        {pastCoords.map(([lat, lng], index) => (
          <CircleMarker
            key={index}
            center={[lat, lng]}
            radius={6}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.7 }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span>
                Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}

        <Marker position={currentPos}>
          <Popup>
            <strong>{username}</strong> <br />
            Lat: {currentPos[0].toFixed(6)}, Lng: {currentPos[1].toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Position;
