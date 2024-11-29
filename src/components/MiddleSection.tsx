'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface MiddleSectionProps {
  onWorkTimeChange: (workTime: number) => void;
}

interface SlotResults {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

interface TimerState {
  time: number;
  isActive: boolean;
  isWorkTime: boolean;
}

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;
const MAX_TIME = 60 * 60; // 1 hour max

const MiddleSection: React.FC<MiddleSectionProps> = ({ onWorkTimeChange }) => {
  const [{ time, isActive, isWorkTime }, setTimerState] = useState<TimerState>({
    time: DEFAULT_WORK_TIME,
    isActive: false,
    isWorkTime: true,
  });

  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [isSlotMachine, setIsSlotMachine] = useState(false);
  const [slotResults, setSlotResults] = useState<SlotResults>({ minutes: 0, seconds: 0, milliseconds: 0 });


  useEffect(() => {
    onWorkTimeChange(workTime);
  }, [workTime, onWorkTimeChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          time: prev.time - 1
        }));
      }, 1000);
    } else if (time === 0) {
      const newTime = isWorkTime ? breakTime : workTime;
      setTimerState(prev => ({
        isActive: false,
        time: newTime,
        isWorkTime: !prev.isWorkTime
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isWorkTime, workTime, breakTime]);

  const toggleTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      time: prev.isWorkTime ? workTime : breakTime
    }));
  }, [workTime, breakTime]);

  const handleManualTimeSet = useCallback((newTime: number) => {
    const validTime = Math.min(Math.max(0, newTime), MAX_TIME);
    if (isWorkTime) {
      setWorkTime(validTime);
    } else {
      setBreakTime(validTime);
    }
    setTimerState(prev => ({
      ...prev,
      time: validTime
    }));
  }, [isWorkTime]);

  const runSlotMachine = useCallback(() => {
    const getRandomValue = (max: number) => Math.floor(Math.random() * (max + 1));
    const animationDuration = 2000;
    const fps = 30;
    const frames = animationDuration / (1000 / fps);
    let frame = 0;

    const interval = setInterval(() => {
      const newResults = {
        minutes: getRandomValue(59),
        seconds: getRandomValue(59),
        milliseconds: getRandomValue(99)
      };
      setSlotResults(newResults);
      frame++;

      if (frame >= frames) {
        clearInterval(interval);
        const finalTime = newResults.minutes * 60 + newResults.seconds;
        handleManualTimeSet(finalTime);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [handleManualTimeSet]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference * (1 - (time / (isWorkTime ? workTime : breakTime)) || 0);

  return (
    <div className="relative flex h-full flex-col items-center justify-center p-4 overflow-hidden">
      
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
              stroke="hsl(var(--primary))"
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
              fill="hsl(var(--primary))"
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
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{isWorkTime ? 'Work Time' : 'Break Time'}</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Work: {Math.floor(workTime / 60)}:{(workTime % 60).toString().padStart(2, '0')} | 
          Break: {Math.floor(breakTime / 60)}:{(breakTime % 60).toString().padStart(2, '0')}
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Set Timer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set {isWorkTime ? 'Work' : 'Break'} Timer</DialogTitle>
            <DialogDescription>
              Adjust the timer settings for your Pomodoro session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="slot-machine-mode"
                checked={isSlotMachine}
                onCheckedChange={setIsSlotMachine}
              />
              <Label htmlFor="slot-machine-mode">Slot Machine Mode</Label>
            </div>
            {isSlotMachine ? (
              <div className="flex justify-center space-x-2">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-12 overflow-hidden rounded-md border border-primary bg-background">
                    <div className="flex h-full items-center justify-center text-2xl font-bold">
                      {slotResults.minutes}
                    </div>
                  </div>
                  <span className="mt-1 text-xs">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-12 overflow-hidden rounded-md border border-primary bg-background">
                    <div className="flex h-full items-center justify-center text-2xl font-bold">
                      {slotResults.seconds}
                    </div>
                  </div>
                  <span className="mt-1 text-xs">Seconds</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-12 overflow-hidden rounded-md border border-primary bg-background">
                    <div className="flex h-full items-center justify-center text-2xl font-bold">
                      {slotResults.milliseconds}
                    </div>
                  </div>
                  <span className="mt-1 text-xs">Milliseconds</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={Math.floor(time / 60)}
                    onChange={(e) => handleManualTimeSet(parseInt(e.target.value) * 60 + (time % 60))}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="seconds">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={time % 60}
                    onChange={(e) => handleManualTimeSet(Math.floor(time / 60) * 60 + parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
            <Button onClick={isSlotMachine ? runSlotMachine : undefined}>
              {isSlotMachine ? 'Spin!' : 'Set Timer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MiddleSection
