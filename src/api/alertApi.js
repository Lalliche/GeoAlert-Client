"use client";
import axios from "./alertBase";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access");

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

export const updateAlert = async ({ id, updatedData }) => {
  try {
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

export const deleteAlert = async (id) => {
  try {
    console.log("Deleting alert with ID:", id);

    const response = await axios.delete("/deleteAlert", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: { id }, // ⬅️ 'data' is how axios sends body with DELETE
    });

    console.log("Alert deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting alert:",
      error.response?.data || error.message
    );
    throw error;
  }
};
