"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { IoSaveOutline } from "react-icons/io5";
import { GrFormEdit } from "react-icons/gr";
import StatusMessage from "@/Components/Global/StatusMessage";
import { updateAlert } from "@/api/alertApi";

// 🧩 Helper component to read and set initial message
const MessageParamLoader = ({ setMessage }) => {
  const searchParams = useSearchParams();
  const messageFromParam = searchParams.get("message") || "";

  useEffect(() => {
    setMessage(messageFromParam);
  }, [messageFromParam, setMessage]);

  return null;
};

export default function AlertMessagePage() {
  const { alert_id } = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(""); // Will be set via helper
  const [initialMessage, setInitialMessage] = useState("");

  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInitialMessage(message); // Sync initial message only once after load
  }, [message]);

  const handleSave = async () => {
    if (message === initialMessage) {
      setInfo("Nothing changed.");
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await updateAlert({ id: alert_id, updatedData: { message } });

      setSuccess("Alert updated successfully!");
      setIsEditing(false);
      setInitialMessage(message); // Sync after saving
    } catch (error) {
      setError("Failed to update alert.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-18 py-4 mx-auto">
      <StatusMessage
        isLoading={isLoading}
        success={success}
        error={err}
        info={info}
        hideAlert={() => {
          setError("");
          setSuccess("");
          setInfo("");
        }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm pb-3">
        <span>Alerts</span>
        <span>/</span>
        <span>Alerts list</span>
        <span>/</span>
        <span>Alert {alert_id}</span>
        <span>/</span>
        <span>Message</span>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 cursor-pointer pb-3"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      {/* Message Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium pb-5">Message</h2>

        {!isEditing ? (
          <div className="whitespace-pre-wrap break-words bg-[#C4C4C433] p-4 rounded-md text-[#7A7A7A] text-[12px]">
            {message || "No message content available"}
          </div>
        ) : (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-[#F7F7F7]"
          />
        )}

        <div className={`pt-5 ${isEditing ? "flex flex-col gap-3" : ""}`}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center justify-center gap-1 w-full"
            >
              <GrFormEdit size={22} className="text-white" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="btn-primary flex items-center justify-center gap-2 w-full py-2 hover:bg-gray-50 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            >
              <IoSaveOutline className="text-white" />
              <span className="text-sm font-medium text-white">Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Suspense-wrapped search param reader */}
      <Suspense fallback={null}>
        <MessageParamLoader setMessage={setMessage} />
      </Suspense>
    </div>
  );
}
