"use client";
import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { useEffect, useState } from "react";

import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: "100%", height: "100vh" });

  useEffect(() => {
    // Set initial dimensions
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener("resize", updateDimensions);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    setDimensions({
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
    });
  };

  console.info(convertToExcalidrawElements([{
    type: "rectangle",
    id: "rect-1",
    // width: 186.47265625,
    // height: 141.9765625,
    x: 100,
    y: 100,
  },]));
  
  return (
    <div style={{ height: dimensions.height, width: dimensions.width }}>
      <Excalidraw />
    </div>
  );
};
export default ExcalidrawWrapper;