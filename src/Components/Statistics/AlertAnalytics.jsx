"use client";
import React, { useEffect, useState } from "react";
import { NotificationStats } from "@/api/notificationApi";
import { useParams } from "next/navigation";
import { BsReply } from "react-icons/bs";
import { FaPercentage } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { AiOutlinePercentage } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LuTriangleAlert } from "react-icons/lu"; //for negative res
import { IoShieldCheckmarkOutline } from "react-icons/io5"; // for positive res
import { getAlertSentiment } from "@/api/sentimentApi";

/* const Res = [
  {
    positive: 2,
    negative: 2,
    replies: 4,
  },
]; */

const AlertAnalytics = () => {
  const { alert_id } = useParams();
  const [stats, setStats] = useState(null);
  const [Res, setRes] = useState([]);
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

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const data = await getAlertSentiment(alert_id);
        console.log("getAlertSentiment data:", data);
        setRes(data); // Save to state
      } catch (error) {
        console.error("Failed to fetch getAlertSentiment:", error);
      }
    };
    if (alert_id) {
      fetchSentiment();
    }
  }, [alert_id]);

  const [hovered, setHovered] = useState(null);
  const source = Res[0] || stats;

  return (
    <div className="flex flex-col gap-[1em]   ">
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
                      ? stats.average_reply_time < 300
                        ? `${stats.average_reply_time.toFixed(0)} seconds`
                        : stats.average_reply_time < 7200
                        ? `${(stats.average_reply_time / 60).toFixed(
                            0
                          )} minutes`
                        : `${(stats.average_reply_time / 3600).toFixed(
                            1
                          )} hours`
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
        <div className="w-full flex flex-col">
          <Skeleton height={200} className="rounded-[0.6em]" />
        </div>
      )}

      {Res ? (
        <div className="w-full center">
          <div className="bg-white rounded-lg shadow-sm border-2 border-[#D0D5DD] w-fit p-6 mt-6">
            <div className="space-y-6 flex text-txt flex-row justify-around gap-4">
              {/* Positive Responses */}
              <div
                className="flex flex-row items-center gap-6 group"
                onMouseEnter={() => setHovered("positive")}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex flex-col items-center gap">
                  <h1
                    className={`font-bold text-3xl ${
                      hovered === "positive" ? "text-green-600" : ""
                    }`}
                  >
                    {hovered === "positive"
                      ? `${((source?.positive / source?.replies) * 100).toFixed(
                          1
                        )}%`
                      : source?.positive}
                  </h1>
                  <h3>Positive responses</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <IoShieldCheckmarkOutline
                    size={26}
                    className="text-green-600"
                  />
                </div>
              </div>

              <hr className="w-px h-16 bg-gray-300 border-0 rotate-0" />

              {/* Negative Responses */}
              <div
                className="flex flex-row items-center gap-6 group"
                onMouseEnter={() => setHovered("negative")}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex flex-col items-center gap">
                  <h1
                    className={`font-bold text-3xl ${
                      hovered === "negative" ? "text-red-600" : ""
                    }`}
                  >
                    {hovered === "negative"
                      ? `${((source?.negative / source?.replies) * 100).toFixed(
                          1
                        )}%`
                      : source?.negative}
                  </h1>
                  <h3>Negative responses</h3>
                </div>
                <div className="rounded-2xl shadow-md border border-white p-2">
                  <LuTriangleAlert size={26} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <Skeleton height={200} className="rounded-[0.6em]" />
        </div>
      )}
    </div>
  );
};

export default AlertAnalytics;
