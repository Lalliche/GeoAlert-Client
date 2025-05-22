"use client";
import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";

export const Filter = ({ Status }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Active");

  useEffect(() => {
    Status(selected);
  }, [selected]);

  return (
    <div className="w-full items-center justify-start flex flex-row flex-wrap gap-[1em]">
      <div
        className={`${
          open ? "text-white bg-main scale-110" : "text-[#344054] bg-white"
        } font-space-grotesk btn-shadow font-bold text-[1em] center gap-[0.5em] py-[0.625em] px-[1em] cursor-pointer hover:scale-105 w-fit rounded-xl duration-[450ms] ease-in-out transition-all`}
        onClick={() => setOpen(!open)}
      >
        <IoFilter className="text-[1em]" />
        Filter
      </div>

      <div className={`${open ? "block" : "hidden"} gap-[1em]`}>
        <div className="flex flex-row flex-wrap gap-[1em] items-center justify-start">
          {["", "Active", "Expired"].map((status) => (
            <div
              key={status}
              className={`${
                selected === status
                  ? "border-2 border-main text-main"
                  : "text-[#344054]"
              } font-space-grotesk bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer w-fit rounded-xl duration-[450ms] ease-in-out transition-all`}
              onClick={() => setSelected(status)}
            >
              {status === "" ? "All" : status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
