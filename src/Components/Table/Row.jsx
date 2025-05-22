"use client";
import React from "react";

const Row = ({
  data,
  structure,
  clickedRowId,
  handleRowClick,
  onClickContent,
  rowClass,
  setClickedRow = () => {},
}) => {
  const handleClick = () => {
    if (clickedRowId === data.id) {
      // Row is already selected, so deselect it
      handleRowClick(null);
      setClickedRow(null);
    } else {
      // Select the new row
      handleRowClick(data.id);
      setClickedRow(data);
    }
  };

  return (
    <>
      <div
        className={`flex flex-row items-center gap-[0.5em] w-full  border-[#EAECF0] py-4 px-4 hover:bg-[#F9FAFB] cursor-pointer
          ${rowClass}
          ${clickedRowId === data.id ? "bg-[#f0f1f1]" : "bg-white border-b-2"}
          `}
        onClick={handleClick}
      >
        {structure.map((column, index) => {
          const value = column.field
            ? column.field.split(".").reduce((acc, key) => acc?.[key], data)
            : null;

          return (
            <div
              key={index}
              className={`flex items-center justify-start ${column.width}`}
            >
              {column.content(value, data)}
            </div>
          );
        })}
      </div>

      {clickedRowId === data.id &&
        onClickContent
          .filter((content) => content.condition(data))
          .map((content, index) => (
            <div
              key={index}
              className={`py-2 px-4 bg-[#F9FAFB]
              ${clickedRowId === data.id ? "border-b-2" : ""}
            `}
            >
              {content.render(data)}
            </div>
          ))}
    </>
  );
};

export default Row;
