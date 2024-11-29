'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { AvatarFallback} from "@/components/ui/avatar"
// import { Card } from "@/components/ui/card"
import Image from 'next/image'

const messages = [
"Time to skibidi!",
"You're mogging it!",
"Stay grimace shake'd!",
"Remember to mew!",
"Keep up the goon!",
"You've been edging for a while, goon break!"
]

interface BubbleAvatarProps {
  workTime: number
}

export function BubbleAvatar({ workTime }: BubbleAvatarProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [imageError, setImageError] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0], [0, 1])

  const showMessage = useCallback(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setMessage(randomMessage)
    setTimeout(() => setMessage(null), 5000) // Hide message after 5 seconds
  }, [])

  useEffect(() => {
    const shortInterval = setInterval(() => {
      if (Math.random() < 0.5) showMessage() // 50% chance to show message every 69 seconds
    }, 69000)

    const longInterval = setInterval(() => {
      showMessage() // Always show message every 420 seconds
    }, 42000)

    return () => {
      clearInterval(shortInterval)
      clearInterval(longInterval)
    }
  }, [showMessage])

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => setIsVisible(true), workTime * 1000 / 5)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, workTime])

  const handleDragEnd = (event: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) {
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed bottom-4 right-4 flex items-end gap-2"
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {message && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-full right-0 mb-2 max-w-[200px] rounded-lg 
         bg-white p-2 text-sm shadow-lg border border-gray-200"
      >
        {message}
        <div className="absolute -bottom-2 right-4 h-0 w-0 border-8 
          border-transparent border-t-white" />
      </motion.div>
      )}
      
      <motion.div
      className="relative h-16 w-16 cursor-grab rounded-full bg-white 
         shadow-lg active:cursor-grabbing overflow-hidden border border-gray-200"
      animate={{
        y: [0, -5, 0],
      }}
      dragMomentum={false} // Added for more responsive dragging
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      >
      {!imageError ? (
        <Image
        src="/images/skibbidi-toilet.png"
        alt="Skibbidi Toilet"
        fill
        className=" translate-x-[8px] translate-y-[6px]"
        priority
        draggable={false} // Prevent image dragging
        onError={() => setImageError(true)}
        />
      ) : (
        <AvatarFallback className="h-full w-full">
        ST
        </AvatarFallback>
      )}
      </motion.div>
    </motion.div>
  )
}
