'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

const MIN_WIDTH = 10; // Minimum panel width percentage
const MAX_WIDTH = 80; // Maximum panel width percentage

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
    {children}
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300"
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
  const [isDragging, setIsDragging] = useState(false)
  const [activeDivider, setActiveDivider] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((index: number) => {
    setIsDragging(true)
    setActiveDivider(index)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setActiveDivider(null)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || activeDivider === null || !containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.clientWidth
      const mouseX = e.clientX - container.getBoundingClientRect().left

      let newLeftWidth = leftWidth
      let newMiddleWidth = middleWidth
      let newRightWidth = rightWidth

      if (activeDivider === 0) {
        newLeftWidth = (mouseX / containerWidth) * 100
        newMiddleWidth = leftWidth + middleWidth - newLeftWidth
      } else if (activeDivider === 1) {
        newMiddleWidth = ((mouseX - (leftWidth / 100) * containerWidth) / containerWidth) * 100
        newRightWidth = 100 - leftWidth - newMiddleWidth
      }

      // Clamp widths between MIN_WIDTH% and MAX_WIDTH%
      newLeftWidth = Math.max(MIN_WIDTH, Math.min(newLeftWidth, MAX_WIDTH))
      newMiddleWidth = Math.max(MIN_WIDTH, Math.min(newMiddleWidth, MAX_WIDTH))
      newRightWidth = Math.max(MIN_WIDTH, Math.min(newRightWidth, MAX_WIDTH))

      // Ensure total width equals 100%
      const totalWidth = newLeftWidth + newMiddleWidth + newRightWidth
      newLeftWidth = (newLeftWidth / totalWidth) * 100
      newMiddleWidth = (newMiddleWidth / totalWidth) * 100
      newRightWidth = (newRightWidth / totalWidth) * 100

      onResize(newLeftWidth, newMiddleWidth, newRightWidth)
    },
    [isDragging, activeDivider, leftWidth, middleWidth, rightWidth, onResize]
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

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

