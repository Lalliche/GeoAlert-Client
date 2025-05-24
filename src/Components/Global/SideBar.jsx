"use client";
import React, { useState, useEffect } from "react";
import { GoHome, GoAlert } from "react-icons/go";
import { TbMap2 } from "react-icons/tb";
import { FiLogOut, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spinner from "./Spinner";
import { IoSettingsOutline } from "react-icons/io5";

const AdminRoutes = [
  {
    name: "Overview",
    Icon: GoHome,
    path: "/dashboard/overview",
    pathName: "Overview",
  },
  {
    name: "Alerts",
    Icon: GoAlert,
    path: "/dashboard/alerts",
    pathName: "Alerts",
    isPartialMatch: true,
  },
  {
    name: "Users",
    Icon: FiUsers,
    path: "/dashboard/users",
    pathName: "Users",
    isPartialMatch: true,
  },
  {
    name: "Zones Management",
    Icon: TbMap2,
    path: "/dashboard/zones",
    opt: "/dashboard/zones?map",
    pathName: "Zones",
    isPartialMatch: true,
  },
  {
    name: "Settings",
    Icon: IoSettingsOutline,
    path: "/dashboard/settings",
    pathName: "Settings",
    isPartialMatch: true,
  },
];

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("role");
    router.replace("/login");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="h-full  overflow-y-auto border-r-2 border-[#E6EFF5] py-8 pl-[2em] pr-[1em] flex flex-col text-[14px] md:text-[16px] gap-6">
      <p className="text-[#DC091A] text-[1.5em] font-bold text-center">
        GeoAlert
      </p>

      <div className="w-full justify-between flex flex-col h-full">
        <div className="flex flex-col gap-[1.75em] ">
          {AdminRoutes.map((route, index) => {
            const isActive = route.isPartialMatch
              ? pathname.startsWith(route.path)
              : pathname === route.path;

            return (
              <Link
                href={route.opt || route.path}
                key={index}
                className={`flex flex-row font-semibold items-center gap-[1.5em] py-[0.5em] px-[0.75em] rounded-sm transition-all font-titillium-web ${
                  isActive
                    ? "bg-[#FFF5F5] text-main border-l-[3px] border-main"
                    : "text-[#7A7A7A] hover:text-[#DC091A] hover:bg-[#F5F5F5]"
                }`}
              >
                <route.Icon className="text-[1.8em]" />
                <span>{route.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div
          className="flex flex-row items-center gap-3 p-3 mt-auto cursor-pointer text-[#7A7A7A] hover:text-red-500 hover:bg-[#F5F5F5] rounded-md transition-all"
          onClick={handleLogout}
        >
          <FiLogOut className="text-[1.4em]" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
