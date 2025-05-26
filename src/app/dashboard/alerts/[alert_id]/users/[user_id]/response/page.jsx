"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { LuAudioLines } from "react-icons/lu";
import Cookies from "js-cookie";
import axios from "axios";

// Helper to extract searchParams
function ClassificationReader({ setClassification }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const classification = searchParams.get("classification");
    setClassification(classification);
  }, [searchParams, setClassification]);

  return null;
}

export default function ResponseDetailPage() {
  const params = useParams();
  const alertId = params.alert_id;
  const userId = params.userId;

  const [classification, setClassification] = useState(null);
  const [reply, setReply] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    const storedReply = localStorage.getItem("reply");
    if (storedReply) {
      try {
        const parsed = JSON.parse(storedReply);
        setReply(parsed);

        const token = Cookies.get("access");
        const audioUrl = parsed.audio_url
          ? `${process.env.NEXT_PUBLIC_APP_DOMAIN_LOCAL}/${parsed.audio_url}`
          : null;

        if (audioUrl && token) {
          axios
            .get(audioUrl, {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const blobUrl = URL.createObjectURL(res.data);
              setAudioSrc(blobUrl);
            })
            .catch((err) => {
              console.error("Audio fetch failed:", err);
            });
        } else {
          setAudioSrc(null);
        }
      } catch (error) {
        console.error("Error parsing reply from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  return (
    <div className="px-18 py-4 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm pb-3">
        <span>Alerts</span>
        <span>/</span>
        <span>Alerts list</span>
        <span>/</span>
        <span>Alert {alertId}</span>
        <span>/</span>
        <span>Impacted users</span>
        <span>/</span>
        <span>User {userId}</span>
        <span>/</span>
        <span className="font-medium">Response</span>
      </div>

      {/* Back link */}
      <Link
        href={`/dashboard/alerts/${alertId}/users`}
        className="flex items-center gap-2 pb-4 cursor-default"
      >
        <FiArrowLeft />
        <span>Back</span>
      </Link>

      {/* Reply box */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        {!reply ? (
          <div className="text-center text-[#7A7A7A] text-[15px]">
            No response.
          </div>
        ) : (
          <div className="flex flex-col gap-[2em]">
            {/* Text */}
            {(reply.type === "text" ||
              (reply.type === "audio" && reply.content)) && (
              <div>
                <div className="flex gap-2 pb-4">
                  <div className="w-8 h-8 flex-shrink-0">
                    <img
                      src="/T.svg"
                      alt="Response icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1 className="text-xl font-bold pt-1">Text response</h1>
                </div>
                <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-xl text-[#7A7A7A] text-[15px]">
                  {reply.content || "No text response."}
                </div>
              </div>
            )}

            {/* Audio */}
            {(reply.type === "audio" ||
              (reply.type === "audio" && reply.content)) &&
              audioSrc && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                    <LuAudioLines className="text-main" />
                    <span>Vocal response</span>
                  </div>
                  <audio
                    key={audioSrc}
                    controls
                    className="w-full"
                    src={audioSrc}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

            {/* Text fallback */}
            {reply.type === "text" && !reply.content && (
              <div className="text-[#7A7A7A] text-[15px]">
                No text response.
              </div>
            )}
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ClassificationReader setClassification={setClassification} />
      </Suspense>
    </div>
  );
}
