import React from "react";
import Achievements from "~/components/user/achievements/Achievements";

function UserAchievement() {
  return (
    <div className="w-full h-full min-h-screen bg-white">
      <Achievements lightTheme={true} />
    </div>
  );
}

export default UserAchievement;
