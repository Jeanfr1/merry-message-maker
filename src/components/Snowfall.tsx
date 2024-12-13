import React from "react";

const Snowfall = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-snowfall text-white opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 5}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;