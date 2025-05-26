"use client";
import React from "react";
import { GoHome, GoAlert } from "react-icons/go";
import { TbMap2 } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  const pathname = usePathname();

  return (
    <div className="h-full  overflow-y-auto border-r-2 border-[#E6EFF5] py-8 pl-[2em] pr-[1em] flex flex-col text-[14px] md:text-[16px] gap-6">
      <div className="flex justify-center mb-6 w-full">
        <Image src="/bg_logo.PNG" alt="lkjasdf" width={100} height={100} />
      </div>
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
      </div>
    </div>
  );
};

export default SideBar;
