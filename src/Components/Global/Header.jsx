"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
        <div className="h-[2em] w-[2em] relative flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
          {tempImage || !adminImage || imageError ? (
            <FaRegUser className="text-[#718EBF] w-[80%] h-[80%]" />
          ) : (
            <Image
              src={adminImage}
              alt="Admin Picture"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Admin Name & Dropdown Icon */}
        <div className="flex items-center gap-[0.5em] cursor-pointer">
          <p className="text-[1em] text-txt  "> {adminName}</p>
          <MdKeyboardArrowDown className="text-[1.5em] text-[#A9A9A9]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
