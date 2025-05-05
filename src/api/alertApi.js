"use client";
import axios from "./alertBase";
import Cookies from "js-cookie";

export const addAlert = async ({
  alertTitle,
  notification_type,
  gravity,
  message,
  StartDate,
  EndDate,
  frequency,
  type,
  ZoneSelected,
}) => {
  console.log("Adding alert with data:", {
    alertTitle,
    notification_type,
    gravity,
    message,
    StartDate,
    EndDate,
    frequency,
    type,
    ZoneSelected,
  });

  try {
    const accessToken = Cookies.get("access");

    const response = await axios.post(
      "/AddAlert",
      {
        alertTitle,
        notification_type,
        gravity,
        message,
        StartDate,
        EndDate,
        frequency,
        type,
        ZoneSelected,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding alert:", error);
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    const accessToken = Cookies.get("access"); // ⬅️ Get the token from cookies

    const response = await axios.get(
      "/AllAlerts",

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // ⬅️ Add Bearer token
        },
      }
    );
    console.log("Alerts fetched :", response.data); // ⬅️ Debugging line

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching alerts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateAlert = async (id, updatedData) => {
  try {
    const accessToken = Cookies.get("access");
    console.log("Updating alert with ID:", id, "and data:", updatedData); // ⬅️ Debugging line

    const response = await axios.patch(`/updateAlert/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Alert updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating alert:",
      error.response?.data || error.message
    );
    throw error;
  }
};
