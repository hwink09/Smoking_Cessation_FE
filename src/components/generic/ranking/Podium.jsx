/* eslint-disable no-unused-vars */
import React from "react";
import { Avatar } from "antd";
import { motion } from "framer-motion";

const podiumStyles = {
  1: {
    order: 2,
    size: 128,
    color: "border-yellow-400",
    bgColor: "bg-yellow-400/20",
    label: "text-yellow-300",
  },
  2: {
    order: 1,
    size: 96,
    color: "border-gray-300",
    bgColor: "bg-gray-300/20",
    label: "text-gray-200",
  },
  3: {
    order: 3,
    size: 96,
    color: "border-yellow-600",
    bgColor: "bg-yellow-600/20",
    label: "text-yellow-500",
  },
};

const PodiumItem = ({ rank, user, value, unit, valueFormatter }) => {
  const style = podiumStyles[rank];
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${
        rank === 1 ? "mt-0" : "mt-8"
      }`}
      style={{ order: style.order }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}>
      <div className="relative">
        <Avatar
          src={user.avatar}
          size={style.size}
          className={`border-4 ${style.color} p-1`}
        />
        <div
          className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${style.bgColor} border-2 ${style.color} flex items-center justify-center font-bold text-white`}>
          {rank}
        </div>
      </div>
      <p className="font-bold text-lg mt-4 text-white">{user.name}</p>
      <p className={`font-bold text-xl ${style.label}`}>
        {valueFormatter(value)} <span className="text-sm">{unit}</span>
      </p>
    </motion.div>
  );
};

const Podium = ({ data, valueFormatter }) => {
  const top3 = data.slice(0, 3);
  return (
    <div className="flex justify-center items-end gap-8 mb-12">
      {top3.map((item) => (
        <PodiumItem key={item.rank} {...item} valueFormatter={valueFormatter} />
      ))}
    </div>
  );
};

export default Podium;
