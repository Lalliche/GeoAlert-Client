"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import StatusMessage from "@/Components/Global/StatusMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PieChartComponent = dynamic(
  () => import("@/Components/Statistics/PieChart"),
  { ssr: false }
);

const AppUsers = dynamic(() => import("@/Components/Statistics/AppUsers"), {
  ssr: false,
});

const OverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-[1em] px-[2em] pb-[5em]">
      <StatusMessage
        error={error}
        success={success}
        isLoading={loading}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />

      {/* AppUsers */}
      <div>
        {loading ? <Skeleton height={300} className="rounded-[0.6em]" /> : null}
        <div style={{ display: loading ? "none" : "block" }}>
          <AppUsers />
        </div>
      </div>

      {/* PieChart */}
      <div>
        {loading ? <Skeleton height={300} className="rounded-[0.6em]" /> : null}
        <div className="w-1/2" style={{ display: loading ? "none" : "block" }}>
          <PieChartComponent error={setError} loading={setLoading} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
