"use client";
import React, { useEffect } from "react";
import { NotificationStats } from "@/api/notificationApi"; // adjust path as needed
import { MdOutlineTimer } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { BsReply } from "react-icons/bs";

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

  return (
    <div className="text-txt w-full border-2 border-black flex flex-row justify-between items-center p-[1em] ">
      <div className="border-r-2 border-r-[#D0D5DD] p-[1em] ">aaaaa</div>
    </div>
  );
};

export default AlertAnalytics;
