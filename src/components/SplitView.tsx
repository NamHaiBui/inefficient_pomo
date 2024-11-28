'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

interface SplitViewProps {
  children: React.ReactNode[]
  leftWidth: number
  middleWidth: number
  rightWidth: number
  onResize: (left: number, middle: number, right: number) => void
}

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
        newMiddleWidth = middleWidth + (leftWidth - newLeftWidth)
      } else if (activeDivider === 1) {
        newMiddleWidth = ((mouseX - (leftWidth / 100) * containerWidth) / containerWidth) * 100
        newRightWidth = 100 - newLeftWidth - newMiddleWidth
      }

      // Ensure minimum width of 10% for each section
      if (newLeftWidth < 10 || newMiddleWidth < 10 || newRightWidth < 10) return

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
      <div style={{ width: `${leftWidth}%` }} className="relative">
        {children[0]}
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300"
          onMouseDown={() => handleMouseDown(0)}
        />
      </div>
      <div style={{ width: `${middleWidth}%` }} className="relative">
        {children[1]}
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300"
          onMouseDown={() => handleMouseDown(1)}
        />
      </div>
      <div style={{ width: `${rightWidth}%` }}>{children[2]}</div>
    </div>
  )
}

export default SplitView

