"use client";
import axios from "./notificationBase";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access");

export const impactedUsers = async (alertId) => {
  try {
    const response = await axios.get(`/impacted-users/${alertId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response in impacted user from server is", response); // Debugging line

    return response.data;
  } catch (error) {
    console.error("Error fetching impacted users:", error);
    throw error;
  }
};

export const NotificationStats = async () => {
  try {
    const response = await axios.get(`/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response in NotificationStats from server is", response); // Debugging line

    return response.data;
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    throw error;
  }
};
