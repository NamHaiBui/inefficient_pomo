'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

const MIN_PANEL_WIDTH = 15; // minimum 15% width for each panel

interface SplitViewProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode]
  leftWidth: number
  middleWidth: number
  rightWidth: number
  onResize: (leftWidth: number, middleWidth: number, rightWidth: number) => void
}

const ResizablePanel: React.FC<{
  width: number
  onMouseDown: () => void
  children: React.ReactNode
}> = ({ width, onMouseDown, children }) => (
  <div style={{ width: `${width}%` }} className="relative">
    <div className="h-full overflow-auto">
      {children}
    </div>
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
      onMouseDown={onMouseDown}
    />
  </div>
)

const SplitView: React.FC<SplitViewProps> = ({
  children,
  leftWidth,
  middleWidth,
  rightWidth,
  onResize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDivider, setActiveDivider] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const constrainWidth = useCallback((width: number) => {
    return Math.max(MIN_PANEL_WIDTH, Math.min(100 - (2 * MIN_PANEL_WIDTH), width));
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setActiveDivider(null);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || activeDivider === null || !containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      const percentX = (mouseX / containerWidth) * 100;

      let newLeftWidth = leftWidth;
      let newMiddleWidth = middleWidth;
      let newRightWidth = rightWidth;

      if (activeDivider === 0) {
        newLeftWidth = constrainWidth(percentX);
        newMiddleWidth = Math.max(MIN_PANEL_WIDTH, 100 - newLeftWidth - rightWidth);
      } else {
        const leftAndMiddle = constrainWidth(percentX);
        newMiddleWidth = leftAndMiddle - leftWidth;
        newRightWidth = Math.max(MIN_PANEL_WIDTH, 100 - leftWidth - newMiddleWidth);
      }

      onResize(newLeftWidth, newMiddleWidth, newRightWidth);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging, activeDivider, leftWidth, middleWidth, rightWidth, onResize, constrainWidth]);

  const handleMouseDown = useCallback((index: number) => {
    setIsDragging(true);
    setActiveDivider(index);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full">
      <ResizablePanel width={leftWidth} onMouseDown={() => handleMouseDown(0)}>
        {children[0]}
      </ResizablePanel>
      <ResizablePanel width={middleWidth} onMouseDown={() => handleMouseDown(1)}>
        {children[1]}
      </ResizablePanel>
      <div style={{ width: `${rightWidth}%` }}>{children[2]}</div>
    </div>
  )
}

export default SplitView
