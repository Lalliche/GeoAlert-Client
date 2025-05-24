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
import DataTable from "@/Components/Table/DataTable";

const headers = [
  { id: "name", name: "Name", field: "name", width: "w-[33%]" },
  { id: "phone", name: "Phone Number", field: "phoneNumber", width: "w-[33%]" },
  { id: "email", name: "Email", field: "email", width: "w-[33%]" },
];

// Transform users prop into DataTable row data
const getRowData = (users) =>
  users.map((user) => ({
    name: `${user.lastName} ${user.firstName}`,
    phoneNumber: user.phoneNumber,
    email: user.email,
  }));

const UsersTable = ({ users }) => {
  const rowData = getRowData(users);

  return (
    <div className="h-full p-4 overflow-auto bg-white/90 shadow-lg rounded-l-lg">
      <DataTable
        initialFontSize="14px"
        headers={headers}
        rowStructure={[
          {
            field: "name",
            width: "w-[33%]",
            content: (value) => <p className="text-txt">{value}</p>,
          },
          {
            field: "phoneNumber",
            width: "w-[33%]",
            content: (value) => <p className="text-txt">{value}</p>,
          },
          {
            field: "email",
            width: "w-[33%]",
            content: (value) => <p className="text-txt">{value}</p>,
          },
        ]}
        rowData={rowData}
        onClickContent={[]}
        rowClass={""}
        TableClass={"!border-2 !border-transparent"}
        TableText={"Users list"}
      />
    </div>
  );
};

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
    <div className="relative w-full h-screen">
      {/* Map 100% width & height */}
      <MapContainer
        center={center}
        zoom={10}
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

        {users.map((user) => {
          const pos = user.position?.[0];
          if (!pos) return null;
          const lat = parseFloat(pos.latitude);
          const lng = parseFloat(pos.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={user.UserId} position={[lat, lng]}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span>
                  {user.firstName} {user.lastName} <br />
                  Email: {user.email} <br />
                  Phone: {user.phoneNumber}
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Table overlays on the right, 50% width of the map */}
      <div
        className="absolute right-0 z-[1500]"
        style={{
          width: "50%",
          height: "50%",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
          overflowY: "auto",
          borderTopLeftRadius: "0.5rem",
          borderBottomLeftRadius: "0.5rem",
        }}
      >
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UserZoneMap;
