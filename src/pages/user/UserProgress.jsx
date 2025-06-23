import React from "react";
import Progress from "~/components/user/progress/ProgressUser";

function UserProgress() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white text-slate-800 mx-auto">
        <Progress />
      </div>
    </div>
  );
}

export default UserProgress;
