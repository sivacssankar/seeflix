

// components/MorningHaze.js
import React from "react";

function EmberBackground({ children }) {
  return (
    <div className="position-relative min-vh-100 w-100 bg-white">
      {/* Morning Haze Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
          `,
        }}
      />
      {/* Foreground content (children) */}
      <div className="position-relative z-1">{children}</div>
    </div>
  );
}

export default EmberBackground;

