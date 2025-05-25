"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import StatusMessage from "@/Components/Global/StatusMessage";

const PieChartComponent = dynamic(
  () => import("@/Components/Statistics/PieChart"),
  { ssr: false }
);

const AlertAnalytics = dynamic(
  () => import("@/Components/Global/AlertAnalytics"),
  { ssr: false }
);

const OverviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  return (
    <div className="w-full col gap-[1em] px-[2em] pb-[5em]">
      <StatusMessage
        error={error}
        success={success}
        isLoading={loading}
        hideAlert={() => {
          setError(null);
          setSuccess(null);
        }}
      />
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <PieChartComponent error={setError} loading={setLoading} />
      <div className="w-full">
        <AlertAnalytics />
      </div>
    </div>
  );
};

export default OverviewPage;
