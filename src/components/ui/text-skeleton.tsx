import React from "react";

export const TextSkeleton = ({ width = "100%", height = "1rem", className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }}></div>
);
