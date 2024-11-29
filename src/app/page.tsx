'use client'

import { useState } from 'react'
import SplitView from '@/components/SplitView'
import LeftSection from '@/components/LeftSection'
import MiddleSection from '@/components/MiddleSection'
import {RightSection} from '@/components/RightSection'
import { BubbleAvatar } from '@/components/smaller_components/BubbleAvatar'
import { SettingsProvider } from '@/context/SettingsContext'

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(33)
  const [middleWidth, setMiddleWidth] = useState(34)
  const [rightWidth, setRightWidth] = useState(33)
  const [workTime, setWorkTime] = useState(25 * 60) // 25 minutes in seconds

  return (
    <main className="h-screen bg-background text-foreground">
      <SettingsProvider>
      <SplitView
        leftWidth={leftWidth}
        middleWidth={middleWidth}
        rightWidth={rightWidth}
        onResize={(left, middle, right) => {
          setLeftWidth(left)
          setMiddleWidth(middle)
          setRightWidth(right)
        }}
      >
        <LeftSection />
        <MiddleSection onWorkTimeChange={setWorkTime} />
        <RightSection />
        
      </SplitView>
      
      <BubbleAvatar workTime={workTime} />
      </SettingsProvider>
    </main>
  )
}

