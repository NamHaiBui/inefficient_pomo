'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const MiddleSection = () => {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(25 * 60)
  }

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const circumference = 2 * Math.PI * 120 // 120 is the radius of the circle
  const dashOffset = circumference * (1 - time / (25 * 60))

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6">
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="20"
            />
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 150 150)"
            />
            <text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="48"
              fontWeight="bold"
            >
              {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </text>
          </svg>
          <div className="mt-6 flex space-x-4">
            <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
            <Button onClick={resetTimer} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MiddleSection

