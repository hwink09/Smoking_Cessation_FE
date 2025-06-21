import React from "react";
import Achievements from "~/components/user/achievements/Achievements";

function UserAchievement() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white text-slate-800 p-6 mx-auto">
        <Achievements lightTheme={true} />
      </div>
    </div>
  );
}

export default UserAchievement;
