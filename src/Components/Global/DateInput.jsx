"use client";
import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DateInput = ({
  label,
  onChange,
  errorMessage,
  value,
  isValid,
  containerClassName = "",
  parentClassName = "",
  onFocus,
  onBlur,
  minDate = dayjs("1900-01-01"),
  maxDate = dayjs(),
}) => {
  const [isDelayedValid, setIsDelayedValid] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayedValid(isValid);
    }, 200);

    return () => clearTimeout(timer);
  }, [isValid]);

  const dynamicContainerClass = isDelayedValid
    ? "inputContainer"
    : "invalidInputContainer";
  return (
    <div
      className={`relative flex flex-col justify-center gap-[0.5em] text-[1em]  ${parentClassName} `}
    >
      {" "}
      <label className="text-[#232323] text-[1em] pointer-events-none ">
        {label}
      </label>
      <div
        className={`${dynamicContainerClass} ${containerClassName} btn-shadow !px-0 !py-0  !text-[#718EBF] !text-[0.75em] `}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={(newValue) => onChange(newValue)}
            format={"YYYY/MM/DD"}
            minDate={minDate}
            maxDate={maxDate}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },

              "& input": {
                fontWeight: 400,
                fontSize: "0.4em",
                fontSize: {
                  xs: "0.5em",
                  sm: "0.8em",
                  md: "0.5em",
                },
                color: "#718EBF",
                padding: "0.5em",
              },
            }}
            slotProps={{
              inputAdornment: {
                position: "start",
              },
            }}
          />
        </LocalizationProvider>
      </div>
      {!isDelayedValid && <p className="InvalidText ">{errorMessage}</p>}
    </div>
  );
};

export default DateInput;
