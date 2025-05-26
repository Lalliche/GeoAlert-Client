"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getCountByType } from "@/api/alertApi";
import { MdErrorOutline } from "react-icons/md";

function hexToRgba(hex, alpha) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white border border-gray-300 shadow-lg rounded-md p-3 text-gray-900 font-space-grotesk w-48">
        <p className="font-semibold text-lg mb-1" style={{ color: data.color }}>
          {data.type}
        </p>
        <p>
          Count: <strong>{data.count}</strong>
        </p>
      </div>
    );
  }

  return null;
};

function Legend({ chartData }) {
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    // max height 400px + scroll if overflow
    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
      {chartData.map((item, index) => {
        const percentage = ((item.count / totalCount) * 100).toFixed(1);
        return (
          <div
            key={index}
            className="flex items-center flex-col gap-[0.5em] font-space-grotesk py-[0.4em] px-[2em] rounded-md"
            style={{
              backgroundColor: hexToRgba(item.color, 0.05),
              color: item.color,
            }}
          >
            <p>{item.type}</p>
            <p className="text-[1.75em] font-bold">{percentage}%</p>
          </div>
        );
      })}
    </div>
  );
}

export default function PieChartComponent({ error, loading }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading(true);
        const result = await getCountByType();

        // Add total count to each data item for tooltip use
        const totalCount = result.reduce((sum, item) => sum + item.count, 0);
        const withTotal = result.map((item) => ({
          ...item,
          total: totalCount,
        }));

        setChartData(withTotal);
      } catch (err) {
        error("Failed to fetch chart data.");
        console.error(err);
      } finally {
        loading(false);
      }
    };

    fetchData();
  }, []);

  const gradients = chartData.map((item, index) => ({
    id: `grad-${index}`,
    stops: [
      { offset: "0%", stopColor: item.color },
      { offset: "100%", stopColor: hexToRgba(item.color, 0.1) },
    ],
  }));

  return (
    <div className="flex flex-col items-center border border-[#D0D5DD] p-5 gap-10 rounded-2xl bg-white">
      <p className="text-txt text-[1.4em] font-semibold">Alert types</p>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
          <MdErrorOutline className="text-4xl" />
          <p className="text-lg">No alerts created yet</p>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <PieChart width={300} height={300}>
            <defs>
              {gradients.map((g) => (
                <linearGradient key={g.id} id={g.id}>
                  {g.stops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={stop.stopColor}
                    />
                  ))}
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={chartData}
              cx={150}
              cy={150}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={0}
              cornerRadius={4}
              dataKey="count"
              nameKey="type"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>

          <Legend chartData={chartData} />
        </div>
      )}
    </div>
  );
}
