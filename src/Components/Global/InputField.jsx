"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const InputField = ({
  label,
  iconSrc,
  placeholder,
  onChange,
  inputType = "text",
  containerClassName = "",
  holderClassName = "",
  isValid = true,
  errorMessage = "",
  value = "",
  onFocus,
  onBlur,
  displayHolder = true,
  inputClassName = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDelayedValid, setIsDelayedValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayedValid(isValid);
    }, 200);

    return () => clearTimeout(timer);
  }, [isValid]);

  const dynamicContainerClass = isDelayedValid
    ? "inputContainer"
    : "invalidInputContainer";

  const labelTextColor = isDelayedValid ? "text-[#344054]" : "text-red-500";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderIcon = () => {
    if (typeof iconSrc === "function") {
      const IconComponent = iconSrc;
      return (
        <IconComponent
          className={`h-[1.5em] w-[1.5em] ${
            isFocused ? "text-black" : "text-[#A9A9A9]"
          }`}
        />
      );
    }

    return <Image src={iconSrc} alt="icon" height={24} width={24} />;
  };

  return (
    <div
      className={`flex relative flex-col gap-[0.5em] w-full ${containerClassName}`}
    >
      {displayHolder && (
        <label
          className={`text-[1em] font-medium ${labelTextColor} ${holderClassName}`}
        >
          {label}
        </label>
      )}

      <div
        className={` flex items-center justify-between gap-[1em] md:py-[0.5em]  text-[1em] px-[0.9em] sm:py-[0.7em] py-[0.6em] rounded-md w-full transition-all ${
          isDelayedValid
            ? "  "
            : "relative border-2 border-red-500  mb-[0.75em]"
        } ${
          isFocused ? "border border-black bg-transparent" : "bg-[#C4C4C433]"
        } ${dynamicContainerClass}`}
      >
        <input
          value={value}
          type={showPassword ? "text" : inputType}
          placeholder={placeholder}
          className={`input w-full outline-none ${inputClassName} ${
            isFocused ? "text-black" : "text-[#7A7A7A]"
          }`}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
        />

        {inputType === "password" &&
          (showPassword ? (
            <MdOutlineVisibilityOff
              className={`cursor-pointer h-[1.5em] w-[1.5em] ${
                isFocused ? "text-black" : "text-[#A9A9A9]"
              }`}
              onClick={togglePasswordVisibility}
            />
          ) : (
            <MdOutlineVisibility
              className={`cursor-pointer h-[1.5em] w-[1.5em] ${
                isFocused ? "text-black" : "text-[#A9A9A9]"
              }`}
              onClick={togglePasswordVisibility}
            />
          ))}

        {iconSrc && (
          <div className="h-[1.5em] w-[1.5em] center">{renderIcon()}</div>
        )}
      </div>

      {!isDelayedValid && <p className="InvalidText">{errorMessage}</p>}
    </div>
  );
};

export default InputField;
