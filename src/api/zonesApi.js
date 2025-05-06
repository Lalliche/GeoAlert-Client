"use client";
import axios from "./geoBase";
import Cookies from "js-cookie";

export const addZone = async (name, coordinates) => {
  console.log("Adding zone with name:", name, "and coordinates:", coordinates); // ⬅️ Debugging line

  try {
    const accessToken = Cookies.get("access"); // ⬅️ Get the token from cookies

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

export const deleteZone = async (name) => {
  console.log("Deleting zone with name:", name); // ⬅️ Debugging line
  try {
    const accessToken = Cookies.get("access");

    const response = await axios.patch(
      "/deleteZone",
      { name: name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Zone deleted debug:", response); // ⬅️ Debugging line

    return response.data;
  } catch (error) {
    console.error("Error deleting zone:", error);
    throw error;
  }
};

export const updateFrequency = async (name, frequency) => {
  try {
    const accessToken = Cookies.get("access");

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

export const getAllZones = async () => {
  try {
    const accessToken = Cookies.get("access"); // ⬅️ Get the token from cookies

    const response = await axios.get(
      "/AllZones",

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // ⬅️ Add Bearer token
        },
      }
    );

    return response.data; // returns the list of zones
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error; // rethrow for the caller to handle
  }
};

export const getWilayaByName = async (wilayaName) => {
  try {
    const accessToken = Cookies.get("access");

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
    const accessToken = Cookies.get("access");

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
