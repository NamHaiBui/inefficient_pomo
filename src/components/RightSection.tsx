'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Task {
  id: number
  text: string
  completed: boolean
}

const RightSection = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="h-full p-4">
      <Card className="h-full">
        <CardContent className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Task List</h2>
          <div className="mb-4 flex space-x-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {tasks.map((task) => (
              <div key={task.id} className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    id={`task-${task.id}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`${task.completed ? 'line-through' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default RightSection

