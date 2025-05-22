"use client";
import axios from "./notificationBase";
import Cookies from "js-cookie";

export const impactedUsers = async (alertId) => {
  try {
    const accessToken = Cookies.get("access");

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
