import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

interface DragLayerProps {
  isDragging: boolean
  currentOffset: { x: number; y: number } | null
  item: React.ReactNode
  className?: string
}

export function DragLayer({ isDragging, currentOffset, item, className }: DragLayerProps) {
  const [styles, setStyles] = useState({
    transform: 'translate(0px, 0px)'
  })

  useEffect(() => {
    if (isDragging && currentOffset) {
      setStyles({
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
      })
    }
  }, [isDragging, currentOffset])

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed left-0 top-0 z-50 w-[calc(100%-2rem)]",
            "pointer-events-none",
            className
          )}
          style={styles}
        >
          {item}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

