"use client";
import React, { useEffect } from "react";
import { NotificationStats } from "@/api/notificationApi"; // adjust path as needed

const AlertAnalytics = () => {
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await NotificationStats();
        console.log("NotificationStats data:", data);
      } catch (error) {
        console.error("Failed to fetch NotificationStats:", error);
      }
    };

    fetchStats();
  }, []);

  return <div>AlertAnalytics</div>;
};

export default AlertAnalytics;
