
import React from "react";

const InitialLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0d1117] z-50">
      <div className="w-8 h-8 relative transform rotate-45">
        <div
          className="absolute bg-orange-600 w-3.5 h-3.5 animate-ping"
          style={{ top: 0, left: 0, animationDuration: "1.2s" }}
        ></div>
        <div
          className="absolute bg-orange-600 w-3.5 h-3.5 animate-ping"
          style={{ top: 0, right: 0, animationDuration: "1.2s", animationDelay: "0.15s" }}
        ></div>
        <div
          className="absolute bg-orange-600 w-3.5 h-3.5 animate-ping"
          style={{ bottom: 0, right: 0, animationDuration: "1.2s", animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute bg-orange-600 w-3.5 h-3.5 animate-ping"
          style={{ bottom: 0, left: 0, animationDuration: "1.2s", animationDelay: "0.45s" }}
        ></div>
      </div>
    </div>
  );
};

export default InitialLoader;
