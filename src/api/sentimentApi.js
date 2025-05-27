"use client";
import axios from "./sentimentBase";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access");

export const getAlertSentiment = async (alertId) => {
  console.log("getAlertSentiment called with alertId:", alertId);
  try {
    const response = await axios.get(`/alert_sentiment/${alertId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response in getAlertSentiment from server is", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching alert sentiment:", error);
    throw error;
  }
};

export const getUserSentiment = async (userId) => {
  try {
    const response = await axios.get(`/user_sentiment/${userId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response in getUserSentiment from server is", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user sentiment:", error);
    throw error;
  }
};
