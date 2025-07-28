import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ChartCard = ({ title, data, dataKeyX, dataKeyY, color }) => {
  return (
    <div className="p-4 border border-white rounded-xl shadow-inner backdrop-blur-md bg-white/10">
      {/* Nếu cần title thì hiện */}
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      )}

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={dataKeyX} stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderColor: "#e5e7eb",
                color: "#111827",
                fontWeight: "bold",
                fontSize: "15px",
              }}
              itemStyle={{ color: "#111827" }}
              formatter={(value) => {
                if (Array.isArray(value) && value.length > 0) {
                  const v = value[0];
                  return `<div><b>${v.payload[dataKeyX]}</b><br/>Số người dùng: <b>${v.value}</b></div>`;
                }
                return '';
              }}
            />
            <Bar dataKey={dataKeyY} fill={color || "#1d4ed8"} stroke="#e5e7eb" strokeWidth={1} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
