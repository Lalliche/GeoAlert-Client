"use client";
import React, { useState } from "react";

const useField = (initialValue, validateFn) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(() => validateFn(initialValue));
  const [focus, setFocus] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue);
    setIsValid(validateFn(newValue));
  };

  return {
    value,
    setValue: handleChange,
    isValid,
    focus,
    setFocus,
  };
};

export default useField;
