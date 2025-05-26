"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [adminImage, setAdminImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [tempImage, setTempImage] = useState(true);

  useEffect(() => {
    const storedName = Cookies.get("adminName") || "Admin";
    const storedImage = Cookies.get("adminImage") || null;
    setAdminName(storedName);
    setAdminImage(storedImage);

    if (storedImage) {
      setTimeout(() => setTempImage(false), 2000);
    }
  }, []);

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    router.replace("/login");
    setTimeout(() => window.location.reload(), 700);
  };

  return (
    <header className="flex justify-between items-center  px-[4em] py-[1.5em] text-[14px] md:text-[16px] ">
      {/* Left Side */}

      <div className="col gap-[0.25em]  ">
        <p className="text-txt font-titillium-web text-[1.75em] font-bold leading-[1.5] ">{`Welcome Back, ${adminName}`}</p>
        <p className="text-txt  text-[1em] ">
          Here is the information about ...
        </p>
      </div>

      {/* Right Side - Profile */}
      <div className="flex items-center gap-[1.5em]">
        {/* Profile Image */}

        {/* Admin Name & Dropdown Icon */}
        <div
          className="flex flex-row items-center gap-3 p-3 mt-auto cursor-pointer text-[#7A7A7A] hover:text-red-500 hover:bg-[#F5F5F5] rounded-md transition-all"
          onClick={handleLogout}
        >
          <FiLogOut className="text-[1.4em]" />
          <span>Logout</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
