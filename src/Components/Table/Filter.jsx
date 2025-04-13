"use client";
import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";

export const Filter = ({ Status }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    Status(selected);
  }, [selected]);

  return (
    <div className="w-full items-center justify-start flex flex-row flex-wrap gap-[1em] ">
      <div
        className={` ${
          open
            ? "text-white bg-[#2D60FF] scale-110 "
            : "text-[#344054] bg-white"
        } font-jakarta  font-bold text-[1em] center gap-[0.5em] py-[0.625em] px-[1em] cursor-pointer hover:scale-105 w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
        onClick={() => setOpen(!open)}
      >
        <IoFilter className=" text-[1em] " />
        Filtrer par statut
      </div>
      <div className={` ${open ? "block" : "hidden"}   gap-[1em] `}>
        <div className="flex flex-row flex-wrap gap-[1em] items-center justify-start">
          <div
            className={` ${
              selected == ""
                ? "border-2 border-[#2D60FF] text-[#2D60FF]  "
                : "text-[#344054] "
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("")}
          >
            Tous
          </div>
          <div
            className={` ${
              selected == "Requested"
                ? " border-2 border-[#2D60FF] text-[#2D60FF]  "
                : "text-[#344054] "
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("Requested")}
          >
            Demandée
          </div>
          <div
            className={` ${
              selected == "Refused"
                ? "border-2 border-[#2D60FF] text-[#2D60FF] "
                : "text-[#344054]"
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("Refused")}
          >
            Refusée
          </div>
          <div
            className={` ${
              selected == "In Progress"
                ? "border-2 border-[#2D60FF] text-[#2D60FF]  "
                : "text-[#344054] "
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("In Progress")}
          >
            En cours
          </div>
          <div
            className={` ${
              selected == "Done"
                ? "border-2 border-[#2D60FF] text-[#2D60FF]  "
                : "text-[#344054] "
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("Done")}
          >
            Terminée
          </div>
          <div
            className={` ${
              selected == "Abolished"
                ? "border-2 border-[#2D60FF] text-[#2D60FF]  "
                : "text-[#344054] "
            } font-jakarta bg-white font-bold text-[1em] center py-[0.625em] px-[1em] cursor-pointer  w-fit rounded-xl duration-[450ms] ease-in-out transition-all `}
            onClick={() => setSelected("Abolished")}
          >
            Abolie
          </div>
        </div>
      </div>
    </div>
  );
};
