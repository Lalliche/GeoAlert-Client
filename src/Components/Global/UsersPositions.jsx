"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const UserZoneMap = ({ users, coordinates, zone }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix Leaflet default icon configuration on client only
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  if (!isClient) return <div>Loading map...</div>;

  const zoneCoordinates = coordinates.map((coord) => [
    coord.latitude,
    coord.longitude,
  ]);
  const center = zoneCoordinates[0] || [36.7538, 3.0588];

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polygon
          positions={zoneCoordinates}
          pathOptions={{ color: "blue", weight: 3 }}
        >
          <Tooltip sticky direction="top" offset={[0, -10]} opacity={1}>
            <div>
              <strong>Zone Credentials</strong>
              <br />
              Name: {zone.name}
              <br />
              Type: {zone.type || "N/A"}
              <br />
              {zone.hasAlert ? "This zone has an alert!" : ""}
              <br />
            </div>
          </Tooltip>
        </Polygon>

        {users.map((user) => (
          <Marker
            key={user.UserId}
            position={[
              parseFloat(user.position.latitude),
              parseFloat(user.position.longitude),
            ]}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span>
                {user.firstName} {user.lastName} <br />
                Email: {user.email} <br />
                Phone: {user.phoneNumber}
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UserZoneMap;
