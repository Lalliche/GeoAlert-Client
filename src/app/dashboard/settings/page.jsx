"use client";
import React, { useState, useEffect } from "react";
import AlertType from "@/Components/Global/AlertType";
import Frequencies from "@/Components/Global/Frequencies";
import StatusMessage from "@/Components/Global/StatusMessage";
import Spinner from "@/Components/Global/Spinner";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="w-full col gap-[1em] px-[2em] pb-[5em] ">
      <StatusMessage
        error={error}
        success={success}
        isLoading={loading}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="w-full ">
        <AlertType success={setSuccess} error={setError} loading={setLoading} />
      </div>

      <div className="w-full ">
        <Frequencies
          success={setSuccess}
          error={setError}
          loading={setLoading}
        />
      </div>
    </div>
  );
};

export default page;
