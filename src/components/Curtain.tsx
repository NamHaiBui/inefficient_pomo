'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CurtainProps {
  containerHeight: number
  onToggle: (isOpen: boolean) => void
}

export function Curtain({ containerHeight, onToggle }: CurtainProps) {
  const [isOpen, setIsOpen] = useState(false)
  const y = useMotionValue(0)
  const curtainHeight = useTransform(y, [0, containerHeight], [0, containerHeight])
  const opacity = useTransform(y, [0, containerHeight / 3], [0, 1])

  useEffect(() => {
    onToggle(isOpen)
  }, [isOpen, onToggle])

  const handleDragEnd = () => {
    const currentY = y.get()
    const threshold = containerHeight / 3
    if (currentY > threshold) {
      animate(y, containerHeight)
      setIsOpen(true)
    } else {
      animate(y, 0)
      setIsOpen(false)
    }
  }

  return (
    <>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: containerHeight }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="absolute top-0 left-0 right-0 z-50 flex justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full my-2" />
        <ChevronDown 
          className="absolute top-4 text-muted-foreground/50"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </motion.div>
      <motion.div
        style={{ 
          height: curtainHeight,
          opacity 
        }}
        className="absolute top-0 left-0 right-0 bg-background border-b"
      />
    </>
  )
}

