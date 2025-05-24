"use client";
import React, { useState, useEffect } from "react";
import AlertType from "@/Components/Global/AlertType";
import StatusMessage from "@/Components/Global/StatusMessage";
import Spinner from "@/Components/Global/Spinner";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="w-full h-full px-[2em] pb-[5em] ">
      {loading && (
        <div className="center w-full h-full">
          <Spinner />
        </div>
      )}
      <StatusMessage
        error={error}
        success={success}
        isLoading={loading}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />
      <div className="w-full h-full flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Alert Types</h2>
          <AlertType
            success={setSuccess}
            error={setError}
            loading={setLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
