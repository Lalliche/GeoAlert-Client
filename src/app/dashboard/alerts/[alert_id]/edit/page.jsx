"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { MdAbc } from "react-icons/md";
import { IoRemove } from "react-icons/io5";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { TiArrowRepeat } from "react-icons/ti";
import Link from "next/link";

const AlertDetail = () => {
  const router = useRouter();
  const { alert_id } = useParams();

  const [isExpanded, setIsExpanded] = useState(false);
  const [alert, setAlert] = useState({
    name: "Alert1",
    code: "ABC",
    startDate: "11/12/2023",
    endDate: "12/12/2027",
    repeat: 1,
    zone: "Zone1",
    type: "Earthquake",
    severity: "sever",
    message: "",
  });
  const severityOptions = [
    { value: "minor", color: "bg-green-500", label: "Low" },
    { value: "moderate", color: "bg-yellow-500", label: "Medium" },
    { value: "sever", color: "bg-red-500", label: "High" },
  ];
  const handleSeverityChange = (value) => {
    setAlert((prev) => ({ ...prev, severity: value }));
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your save logic here
    console.log("Saved:", alert);
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setAlert((prev) => ({
      ...prev,
      [name]: type === "date" ? formatDateForDisplay(value) : value,
    }));
  };

  return (
    <div className="px-18 py-4 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm  pb-3 ">
        <span>Alerts</span>
        <span>/</span>
        <span>Alert{alert_id}</span>
        <span>/</span>
        <span>Edit</span>
      </div>

      <button
        onClick={() => router.push("/dashboard/alerts")}
        className="flex items-center gap-2 cursor-pointer pb-3"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>
      <div className="bg-white border-2 border-gray-200 rounded-lg  shadow-sm p-6">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={alert.name}
                onChange={handleChange}
                className="break-words p-4 rounded-md border-2 border-gray-300 text-[#444343] text-[14px] w-full h-[40px] pl-4 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <MdAbc size={30} color="grey" />
              </div>
            </div>
          </div>
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">
              Starting date
            </label>

            <input
              type="date"
              name="startDate"
              value={formatDateForInput(alert.startDate)}
              onChange={handleChange}
              className="break-words p-4 rounded-md border-2 border-gray-300 text-[#444343] text-[14px] w-full h-[40px]  appearance-none"
            />

            <p className="text-sm text-gray-500 mt-1">
              Display format: mm/dd/yyyy
            </p>
          </div>
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">
              Ending date
            </label>
            <div className="flex flex-row gap-3 h-[40px]">
              {!isExpanded && (
                <input
                  type="date"
                  name="endDate"
                  value={formatDateForInput(alert.endDate)}
                  onChange={handleChange}
                  className="break-words p-4 rounded-md border-2 border-gray-300 text-[#444343] text-[14px] w-full h-[40px]"
                />
              )}

              <div
                onClick={toggleExpand}
                className={`bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer ${
                  isExpanded ? "w-full flex justify-center" : ""
                }`}
              >
                <label className="block text-sm font-medium">
                  {isExpanded ? (
                    <FaPlus className="pb-1" size={20} />
                  ) : (
                    <IoRemove className="pb-1" size={20} />
                  )}
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Display format: mm/dd/yyyy
            </p>
          </div>
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">Repeat</label>
            <div className="relative flex flex-row gap-3 h-[40px]">
              <input
                type="number"
                name="repeat"
                value={alert.repeat}
                onChange={handleChange}
                className=" break-words p-4 rounded-md border-2 border-gray-300 text-[#444343] text-[14px] w-full h-[40px]"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <TiArrowRepeat size={24} color="grey" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Repeat unit: minute</p>
          </div>
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">Zone</label>
            <div className="relative">
              <select
                name="zone"
                value={alert.zone}
                onChange={handleChange}
                className="block appearance-none w-full  rounded-md border-2 border-gray-300 text-[#444343] text-[14px] h-[40px] px-4  "
              >
                <option value="" disabled>
                  Select zone
                </option>
                <option value="Zone1">Zone 1</option>
                <option value="Zone2">Zone 2</option>
                <option value="Zone3">Zone 3</option>
                <option value="Zone4">Zone 4</option>
                <option value="Zone4">Zone 5</option>
                <option value="Zone5">Zone 6</option>
              </select>
            </div>
          </div>
          <div className="mb-6 w-[100%] flex flex-col gap-2">
            <label className="block text-sm font-medium mb-3">Type</label>
            <div className="relative">
              <select
                name="type"
                value={alert.type}
                onChange={handleChange}
                className="block appearance-none w-full  rounded-md border-2 border-gray-300 text-[#444343] text-[14px] h-[40px] px-4  "
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="Earthquake">Earthquake</option>
                <option value="zlzal">Earthquake</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Earthquake">Earthquake</option>
              </select>
            </div>
          </div>

          <div className="mb-6 w-full flex flex-col  gap-2">
            <label className="block text-sm font-medium  ">Severity</label>

            <div className="flex flex-row gap-2">
              {severityOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => handleSeverityChange(option.value)}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      alert.severity === option.value
                        ? `${option.color} border-${
                            option.color.split("-")[1]
                          }-700`
                        : "border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {alert.severity === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6 w-[100%] flex flex-row justify-between ">
            Message
            <Link
              href={{
                pathname: `/dashboard/alerts/${alert_id}/message`,
              }}
              className="px-[0.75em] py-[0.25em] box-shadow row gap-[0.5em] rounded-lg border border-transparent hover:scale-105 transition-all hover:border-black flex items-center w-[11%]"
            >
              <BsArrowsAngleExpand />
              <p className="text-txt">Expand</p>
            </Link>
          </div>
          <button className="btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AlertDetail;
