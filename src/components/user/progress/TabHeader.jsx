import React from "react";

function TabHeader({ icon, label }) {
  return (
    <span className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </span>
  );
}

export default TabHeader;
