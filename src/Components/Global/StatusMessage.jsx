"use client";
import React, { useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import Spinner from "./Spinner";

const StatusMessage = ({
  isLoading,
  success,
  error,
  info,
  hideAlert,
  containerClass = "",
}) => {
  useEffect(() => {
    if (success || error || info) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, info, hideAlert]);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${containerClass} `}
        >
          <Spinner />
        </div>
      )}
      {success && (
        <div className="flex flex-row gap-8 items-center fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000] text-[#4CAF50] border-2 border-[#4CAF50] bg-[#DFF2BF] px-5 py-2 animateSuccess rounded-[20px] shadow-lg">
          <FaRegCheckCircle className="min-h-[1.5em] min-w-[1.5em] h-[1.5em] w-[1.5em]  " />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="flex flex-row gap-8 items-center fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000]  text-[#D8000C] border-2 border-[#D8000C] bg-[#FFD2D2] px-5 py-2 animate-fadeOut rounded-[20px] shadow-lg">
          <MdErrorOutline className="min-h-[1.5em] min-w-[1.5em] h-[1.5em] w-[1.5em]" />
          <p>{error}</p>
        </div>
      )}
      {info && (
        <div className="flex flex-row gap-8 items-center fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000]  text-[#0056A0] border-2 border-[#0056A0] bg-[#E0F7FF] px-5 py-2 animate-fadeIn rounded-[20px] shadow-lg">
          <IoIosInformationCircle className="min-h-[1.5em] min-w-[1.5em] h-[1.5em] w-[1.5em]" />
          <p>{info}</p>
        </div>
      )}
    </>
  );
};

export default StatusMessage;
