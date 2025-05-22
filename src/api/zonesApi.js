"use client";
import axios from "./geoBase";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access");

export const addZone = async (name, coordinates) => {
  console.log("Adding zone with name:", name, "and coordinates:", coordinates); // ⬅️ Debugging line

  try {
    const response = await axios.post(
      "/addZone",
      { name, coordinates },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // ⬅️ Add Bearer token
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding zone:", error);
    throw error;
  }
};

export const deleteZone = async (id) => {
  console.log("Deleting zone with id:", id); // ⬅️ Debugging line
  try {
    const response = await axios.delete(`/deleteZone/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Zone deleted debug:", response); // ⬅️ Debugging line
    return response.data;
  } catch (error) {
    console.error("Error deleting zone:", error);
    throw error;
  }
};

export const updateFrequency = async (name, frequency) => {
  try {
    const response = await axios.post(
      "/updateFrequency",
      { name, frequency },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating frequency:", error);
    throw error;
  }
};

export const getZones = async () => {
  try {
    const response = await axios.get(
      "/Zones",

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // ⬅️ Add Bearer token
        },
      }
    );

    console.log("Zones data debug:", response.data); // Debugging line

    return response.data; // returns the list of zones
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error; // rethrow for the caller to handle
  }
};

export const getWilayaByName = async (wilayaName) => {
  try {
    const response = await axios.get(
      `/wilaya/${encodeURIComponent(wilayaName)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Wilaya data debug:", response.data); // Debugging line

    return response.data; // returns the wilaya data
  } catch (error) {
    console.error(`Error fetching wilaya '${wilayaName}':`, error);
    throw error;
  }
};

export const getUserTracking = async (id, duration) => {
  console.log(
    "Fetching tracking data for user:",
    id,
    "with duration:",
    duration
  ); // Debugging line
  try {
    const response = await axios.get(`/tracking/${id}`, {
      params: { duration },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched tracking data:", response.data); // Debugging line

    return response.data;
  } catch (error) {
    console.error(`Error fetching tracking data for user ${id}:`, error);
    throw error;
  }
};

export const getFrequency = async () => {
  try {
    const response = await axios.get(
      `/AllFrequencies`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Frequency data debug:", response.data); // Debugging line

    return response.data; // returns the frequency data
  } catch (error) {
    console.error(`Error fetching frequency for '${name}':`, error);
    throw error;
  }
};

export const getUserInZone = async (zoneName) => {
  console.log("Fetching users in zone:", zoneName); // Debugging line
  try {
    const encodedZoneName = encodeURIComponent(zoneName);

    const response = await axios.get(`/GetUserInZone/${encodedZoneName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Fetched users in zone:", response.data); // Debugging line
    return response.data; // [{ UserId: "2" }, ...]
  } catch (error) {
    console.error(`Error fetching users in zone ${zoneName}:`, error);
    throw error;
  }
};
