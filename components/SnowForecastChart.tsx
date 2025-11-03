"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DailyForecast } from "@/types";

interface SnowForecastChartProps {
  forecasts: DailyForecast[];
  elevation: string;
}

export default function SnowForecastChart({ forecasts, elevation }: SnowForecastChartProps) {
  const chartData = forecasts.map((forecast) => ({
    date: new Date(forecast.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    snow: forecast.snowAccumulation,
    fullDate: forecast.date,
  }));

  // Function to get color based on snow amount
  const getBarColor = (snow: number) => {
    if (snow >= 3) return "#20B2AA"; // teal (high snow)
    if (snow > 0.1) return "#4169E1"; // royal blue (medium snow)
    return "#9370DB"; // purple (low snow)
  };

  return (
    <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">
        7-Day Snow Forecast - {elevation}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis
            label={{ value: 'Snow (inches)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            stroke="#64748b"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.2)",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            itemStyle={{ color: "#e2e8f0" }}
            formatter={(value: number) => [`${value}"`, "Snow"]}
            cursor={false}
          />
          <Bar dataKey="snow" radius={[8, 8, 0, 0]} activeBar={false}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.snow)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
