"use client";
import React, { useEffect, useState } from "react";
import { NotificationStats } from "@/api/notificationApi";
import { useParams } from "next/navigation";
import { BsReply } from "react-icons/bs";
import { FaPercentage } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { AiOutlinePercentage } from "react-icons/ai";

const AlertAnalytics = () => {
  const { alert_id } = useParams();
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await NotificationStats(alert_id);
        console.log("NotificationStats data:", data);
        setStats(data); // Save to state
      } catch (error) {
        console.error("Failed to fetch NotificationStats:", error);
      }
    };

    if (alert_id) {
      fetchStats();
    }
  }, [alert_id]);

  return (
    <div>
      {stats ? (
        <>
          <div className="bg-white rounded-lg  shadow-sm border-2 border-[#D0D5DD] p-6">
            <div className="space-y-6 flex text-txt flex-row justify-around gap-4">
              <div className="flex flex-row items-center gap-6">
                <div className="flex flex-col items-center gap">
                  <h1 className="font-bold text-3xl">{stats.total_sent}</h1>
                  <h3>Total sent</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <FiSend size={26} />
                </div>
              </div>
              <hr className="w-px h-16 bg-gray-300 border-0 rotate-0" />

              <div className="flex flex-row items-center gap-6">
                <div className="flex flex-col items-center ">
                  <h1 className=" font-bold text-3xl">{stats.total_replied}</h1>
                  <h3>Total replied</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <BsReply size={26} />
                </div>
              </div>
              <hr className="w-px h-16 bg-gray-300 border-0 rotate-0" />
              <div className="flex flex-row items-center gap-6">
                <div className="flex flex-col items-center gap">
                  <h1
                    className={`font-bold text-3xl ${
                      stats.reply_percentage > 50
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {`${stats.reply_percentage}%`}
                  </h1>
                  <h3>Reply percentage</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <AiOutlinePercentage size={26} />
                </div>
              </div>
              <hr className="w-px h-16 bg-gray-300 border-0 rotate-0" />

              <div className="flex flex-row items-center gap-6">
                <div className="flex flex-col items-center gap">
                  <h1 className="font-bold text-3xl">
                    {stats.average_reply_time != null
                      ? `${stats.average_reply_time.toFixed(0)} seconds`
                      : "No replies yet"}
                  </h1>

                  <h3>Average reply time</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <MdAccessTime size={26} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading stats...</div>
      )}
    </div>
  );
};

export default AlertAnalytics;
