"use client";

import React, { useEffect, useState } from "react";
import { IoChevronForward, IoAddOutline, IoColorFill } from "react-icons/io5";
import { getAllTypes, deleteTypeAlert, addTypeAlert } from "@/api/alertApi";
import { icons } from "@/lib/alertIcons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegTrashCan, FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const AlertType = ({ success, error, loading }) => {
  const [types, setTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [typeName, setTypeName] = useState("");
  const [typeColor, setTypeColor] = useState("#000000");
  const [selectedIconName, setSelectedIconName] = useState(null);
  const [addingType, setAddingType] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        loading(true);
        const res = await getAllTypes();
        setTypes(res);
      } catch (err) {
        console.error("Failed to fetch alert types:", err);
        error("Failed to fetch alert types.");
      } finally {
        loading(false);
      }
    };

    fetchTypes();
  }, [refresh]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async (id) => {
    try {
      loading(true);
      await deleteTypeAlert(id);
      setTypes((prev) => prev.filter((type) => type._id !== id));
      success("Alert type deleted successfully.");
    } catch (err) {
      console.error("Failed to delete alert type:", err);
      error("Failed to delete alert type.");
    } finally {
      loading(false);
    }
  };

  const handleAddType = async () => {
    if (!typeName || !selectedIconName || !typeColor) {
      error("All type fields are required.");
      return;
    }

    try {
      setAddingType(true);
      loading(true);
      await addTypeAlert({
        name: typeName,
        color: typeColor,
        icon: selectedIconName,
      });
      success("Alert type added successfully.");
      setTypeName("");
      setSelectedIconName(null);
      setTypeColor("#000000");
      setShowAddForm(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Failed to add alert type:", err);
      error("Failed to add alert type.");
    } finally {
      setAddingType(false);
      loading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="border-2 border-[#D0D5DD] flex flex-col rounded-xl cursor-pointer select-none"
        onClick={toggleDropdown}
      >
        <div className="flex items-center p-[1em] gap-[0.75em]">
          <p className="text-txt font-semibold">Alert Type</p>
          <IoChevronForward
            className={`text-txt transform transition-transform duration-200 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>

        {isOpen && (
          <div className="px-[1em] pb-[1em] flex flex-col gap-[1em]">
            <div className="grid grid-cols-2 gap-[1em] px-[1em] py-[0.5em]">
              {types.map((type) => (
                <div
                  key={type._id}
                  className="flex items-center justify-between p-3 rounded-lg text-txt"
                  style={{ backgroundColor: `${type.color}33` || "#999" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-white">
                      <span
                        className="text-lg"
                        style={{ color: type.color || "#999" }}
                      >
                        {icons[type.icon] || <FaMapMarkerAlt />}
                      </span>
                    </div>
                    <span className="font-space-grotesk font-bold capitalize">
                      {type.name}
                    </span>
                  </div>
                  <div
                    className="bg-white text-txt rounded-md p-[0.75em] font-semibold text-sm flex items-center gap-[0.5em]  hover:scale-105 cursor-pointer transition-all duration-200 hover:text-main"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(type._id);
                    }}
                  >
                    <FaRegTrashCan className="text-[1.5em]" />
                    Delete
                  </div>
                </div>
              ))}
            </div>

            {/* Add Alert Type Button */}
            {!showAddForm && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddForm(true);
                }}
                className="text-txt font-semibold flex items-center justify-center gap-2 cursor-pointer btn-shadow rounded-lg p-[1em] hover:scale-105  transition-all duration-200 "
              >
                <IoAddOutline className="text-[1.5em]" />
                <p>Add Alert Type</p>
              </div>
            )}

            {/* Add Alert Type Form */}
            {showAddForm && (
              <div className=" pt-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col gap-[3em] ">
                  <div className="flex flex-col gap-[1em] ">
                    <label className="font-semibold">Name</label>
                    <input
                      type="text"
                      placeholder="Type name"
                      value={typeName}
                      onChange={(e) =>
                        setTypeName(e.target.value.toLowerCase())
                      }
                      className="border border-[#D0D5DD] rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="w-full flex flex-row justify-between items-center gap-[2em]  ">
                    <p className="font-bold ">Color</p>

                    <div className="flex flex-row justify-center items-center btn-shadow p-2 gap-4 rounded-lg">
                      <IoColorFill className="text-[1.5em] text-txt" />
                      <input
                        type="color"
                        value={typeColor}
                        onChange={(e) => setTypeColor(e.target.value)}
                        className="w-[2em] h-[2em]  cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-4">
                    {Object.entries(icons).map(([name, IconComponent]) => (
                      <button
                        key={name}
                        onClick={() => setSelectedIconName(name)}
                        className={`p-2 flex justify-center items-center rounded text-2xl hover:bg-gray-200 transition ${
                          selectedIconName === name
                            ? "bg-blue-100 border-blue-500"
                            : ""
                        }`}
                        style={{
                          color: typeColor || "#999",
                        }}
                      >
                        {IconComponent}
                      </button>
                    ))}
                  </div>

                  <div className="w-full flex flex-row justify-between items-center gap-[0.5em]  ">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setTypeName("");
                        setSelectedIconName(null);
                        setTypeColor("#000000");
                      }}
                      className="font-medium btn-shadow text-txt w-full px-4 py-2 rounded-md flex justify-center items-center gap-[1em] hover:scale-105 transition  duration-200 "
                    >
                      <RxCross2 className="text-[1.5em]" />
                      Cancel
                    </button>
                    <button
                      onClick={handleAddType}
                      disabled={addingType}
                      className="font-medium bg-main text-white w-full px-4 py-2 rounded-md flex justify-center items-center gap-[1em] hover:scale-105 transition  duration-200"
                    >
                      <FaCheck className="text-[1.5em]" />
                      {addingType ? "Adding..." : "Add Alert Type"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertType;
