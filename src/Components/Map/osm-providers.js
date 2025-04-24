// src/Components/Map/osm-providers.js

const osmProviders = {
  maptiler: {
    url: "https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1",
    attribution:
      '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  },
};

export default osmProviders;

/* "use client";
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import osm from "./osm-providers";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw"; // necessary for the draw controls to work

// Fix Leaflet's missing marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const DrawControl = () => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Define Algeria's bounding box (approximately)
    const algeriaBounds = [
      [19.0, -8.0], // South-west corner
      [37.5, 11.5], // North-east corner
    ];

    // Create the DrawControl with constraints
    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    // Restrict drawing within Algeria's bounding box
    map.setMaxBounds(algeriaBounds);

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;

      // Check if the shape is inside Algeria's bounds
      if (layer.getBounds && !layer.getBounds().intersects(map.getBounds())) {
        alert("You cannot draw outside of Algeria!");
        map.removeLayer(layer); // Remove invalid shape
      } else {
        drawnItems.addLayer(layer);
        console.log("Shape created:", event);
      }
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map]);

  return null;
};

const DrawMap = () => {
  const [center] = useState({ lat: 36.3, lng: 3 });
  const ZOOM_LEVEL = 7;

  return (
    <div className="row border-2 border-black w-full">
      <div className="col text-center border-2 border-red-950 w-full ">
        <h2>React Leaflet + Leaflet Draw (with Algeria bounds)</h2>

        <div className="col border-2 border-black w-full ">
          <MapContainer
            center={center}
            zoom={ZOOM_LEVEL}
            style={{ height: "700px", width: "100%" }}
          >
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />
            <DrawControl />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DrawMap;
 */
