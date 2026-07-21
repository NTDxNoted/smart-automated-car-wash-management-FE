import React, { useState, useEffect, useRef } from "react";

/**
 * SafeChartContainer wraps Recharts components to provide a stable, resolved width and height
 * based on ResizeObserver. This prevents Recharts from rendering with -1 or 0 dimensions
 * and eliminates console warnings and label misalignments.
 */
export default function SafeChartContainer({ children, aspect, height = 300 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      if (rect.width > 0) {
        setWidth(rect.width);
      }
    });

    observer.observe(containerRef.current);

    // Initial measurement
    const initialWidth = containerRef.current.getBoundingClientRect().width;
    if (initialWidth > 0) {
      setWidth(initialWidth);
    }

    return () => observer.disconnect();
  }, []);

  const chartHeight = aspect && width > 0 ? width / aspect : height;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: `${chartHeight}px`, 
        minWidth: 0, 
        minHeight: 0,
        position: "relative"
      }} 
      className="safe-chart-container"
    >
      {width > 0 && (
        <>
          {React.isValidElement(children)
            ? React.cloneElement(children, { width, height: chartHeight })
            : typeof children === "function"
              ? children(width, chartHeight)
              : children}
        </>
      )}
    </div>
  );
}
