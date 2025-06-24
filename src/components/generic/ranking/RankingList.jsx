/* eslint-disable no-unused-vars */
import React from "react";
import { Avatar } from "antd";
import { motion } from "framer-motion";

const RankingList = ({ data, valueFormatter }) => {
  const restOfRanks = data.slice(3);

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {restOfRanks.map((item, index) => (
        <motion.div
          key={item.rank}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-between"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg w-8 text-center text-gray-400">
              {item.rank}
            </span>
            <Avatar src={item.user.avatar} />
            <span className="font-semibold text-white">{item.user.name}</span>
          </div>
          <span className="font-bold text-blue-400">
            {valueFormatter(item.value)}{" "}
            <span className="text-xs text-gray-400">{item.unit}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default RankingList;
