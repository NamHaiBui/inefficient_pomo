'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

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
      dragConstraints={{ left: -100, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {message && (
        <Card className="p-2 mb-2 max-w-[200px]">
          <p className="text-sm">{message}</p>
        </Card>
      )}
      <Avatar className="w-12 h-12 border-2 border-primary">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    </motion.div>
  )
}

