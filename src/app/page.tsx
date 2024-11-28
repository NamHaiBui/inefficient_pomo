'use client'

import { useState } from 'react'
import SplitView from '@/components/SplitView'
import LeftSection from '@/components/LeftSection'
import MiddleSection from '@/components/MiddleSection'
import RightSection from '@/components/RightSection'

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(33)
  const [middleWidth, setMiddleWidth] = useState(34)
  const [rightWidth, setRightWidth] = useState(33)

  return (
    <main className="min-h-[600px] min-w-[900px] h-screen w-screen overflow-auto bg-background text-foreground">
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
        <MiddleSection />
        <RightSection />
      </SplitView>
    </main>
  )
}

