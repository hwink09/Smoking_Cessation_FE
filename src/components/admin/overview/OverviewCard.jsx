import React from "react";

const OverviewCard = ({ icon, label, value, color }) => (
    <div className={`rounded-md shadow-md p-6 flex items-center gap-4`} style={{ background: color }}>
        <div className="text-xl">{icon}</div>
        <div>
            <div className="text-lg font-bold">{value}</div>
            <div className="text-base">{label}</div>
        </div>
    </div>
);

export default OverviewCard;