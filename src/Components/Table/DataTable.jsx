"use client";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Pagination from "./Pagination";
import Row from "./Row";
import { FiSearch } from "react-icons/fi";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((value, key) => value?.[key], obj) || "";
};

const TableCol = ({
  id,
  name,
  width,
  isClicked,
  handleClick,
  sortDirection,
  sortable = true,
}) => {
  let arrowClass =
    "transform transition-transform duration-300 text-[0.6em] font-extrabold text-[#667085]";
  if (isClicked) {
    arrowClass += sortDirection === "asc" ? " -rotate-90" : " rotate-90";
  }

  return (
    <div
      className={`flex flex-row items-center justify-start gap-[1em] ${width} ${
        sortable ? "cursor-pointer" : ""
      }`}
      onClick={sortable ? () => handleClick(id) : undefined} // Only clickable if sortable
    >
      <p className="text-[0.8em] font-bold text-[#8A92A6]">{name}</p>
      {sortable && <FaArrowRight className={arrowClass} />}
    </div>
  );
};

const DataTable = ({
  headers,
  rowStructure,
  rowData,
  onClickContent,
  rowClass,
  TableClass,
  TableText,
  initialFontSize = "16px",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedRowId, setClickedRowId] = useState(null);
  const rowsPerPage = 5;

  const handleClick = (id) => {
    const field = headers.find((header) => header.id === id)?.field;
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (id) => {
    setClickedRowId(clickedRowId === id ? null : id);
  };

  const filteredData = rowData.filter((row) => {
    if (!searchTerm) return true;
    return headers.some((header) => {
      const field = header.field;
      const value = getNestedValue(row, field)?.toString().toLowerCase();
      return value?.includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col gap-[1.5em] ">
      <div className="flex flex-row items-center justify-between gap-[1em]   ">
        <p className="font-titillium-web text-[1.3em] text-txt ">
          {TableText}{" "}
        </p>
        <div className="row gap-[1em] ">
          <div className="border border-[#D0D5DD] rounded-xl flex flex-row items-center px-[0.75em] py-[0.5em] gap-2 bg-white">
            <FiSearch className="text-[1.2em]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input bg-transparent placeholder-[#667085]"
              placeholder="Search..."
            />
          </div>
          {(searchTerm || sortField) && (
            <button
              onClick={() => {
                setSortField(null);
                setSortDirection("asc");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-[14px] py-2 bg-main text-white rounded-md text-[1em] "
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        className={`bg-white border-2 border-[#EAECF0] rounded-2xl 
        ${TableClass}
        `}
      >
        <div
          className={`flex !text-[${initialFontSize}] flex-row items-center gap-[0.5em] bg-[#F9FAFB]  w-full rounded-tr-2xl rounded-tl-2xl px-[1em] py-[1em]`}
          style={{ borderBottom: "2px solid #EAECF0" }}
        >
          {headers.map((header) => (
            <TableCol
              key={header.id}
              id={header.id}
              name={header.name}
              width={header.width}
              isClicked={sortField === header.field}
              sortDirection={sortDirection}
              handleClick={handleClick}
              sortable={header?.sortable}
            />
          ))}
        </div>
        <div className={`!text-[${initialFontSize}]`}>
          {paginatedData.map((row, index) => (
            <Row
              key={index}
              data={row}
              structure={rowStructure}
              clickedRowId={clickedRowId}
              handleRowClick={handleRowClick}
              onClickContent={onClickContent}
              rowClass={rowClass}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DataTable;
