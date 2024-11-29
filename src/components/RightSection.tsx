'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { TaskList, TaskNode } from '@/utils/TaskListDLL'
import { Curtain } from './Curtain'
import TaskItem from '@/components/TaskItem'
import TaskProgressChart from '@/components/TaskProgressChart'
import TaskDistributionChart from '@/components/TaskDistributionChart'
import generateTaskId from '@/utils/id_generator'
import { SettingsContext } from '@/context/SettingsContext'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ErrorBoundary } from 'react-error-boundary'

const COLORS = [
  '#ff6b6b',       // destructive - soft red
  '#ffd93d',       // warning - bright yellow
  '#4ade80',       // success - vibrant green
]

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })


const MotionCard = motion.create(Card)

// Update FreetimeBoard component
const FreetimeBoard = ({ tasks, onComplete }: { 
  tasks: TaskNode[], 
  onComplete: (id: string) => void 
}) => {
  return (
    <div className="rounded-lg border bg-background/50 p-4 transition-colors">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Freetime Todo</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <Droppable droppableId="freetime">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "transition-colors",
              snapshot.isDraggingOver && "bg-accent/10 border-accent"
            )}
          >
            <ScrollArea className="h-[calc(100vh-500px)]">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className="mb-2"
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    index={index}
                    toggleTask={() => onComplete(task.id)}
                    deleteTask={() => {}}
                  />
                </motion.div>
              ))}
              {provided.placeholder}
            </ScrollArea>
          </div>
        )}
      </Droppable>
    </div>
  )
}

export const RightSection = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('RightSection must be used within a SettingsProvider')
  const { settings } = context
  const [taskList] = React.useState(() => new TaskList())
  const [tasks, setTasks] = React.useState<TaskNode[]>([])
  const [newTask, setNewTask] = React.useState('')
  const nextOrderRef = React.useRef(0)
  const [isChartsVisible, setIsChartsVisible] = React.useState(true)
  const [isCurtainOpen, setIsCurtainOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = React.useState(0)
  const [freetimeTasks, setFreetimeTasks] = useState<TaskNode[]>([])

  React.useEffect(() => {
    setTasks(taskList.toArray())
  }, [taskList])

  React.useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

  const addTask = useCallback(() => {
    const trimmedTask = newTask?.trim()
    if (trimmedTask) {
      const newTaskItem = {
        id: generateTaskId(trimmedTask, Date.now()),
        text: trimmedTask,
        completed: false,
        createdAt: new Date(),
        order: nextOrderRef.current++
      }
      taskList.insert(newTaskItem)
      setTasks(taskList.toArray())
      setNewTask('')
    }
  }, [newTask, taskList])

  const toggleTask = useCallback((id: string) => {
    const node = taskList.getNode(id)
    if (node) {
      node.completed = !node.completed
      taskList.remove(id)
      node.order = nextOrderRef.current++
      taskList.insert(node)
      setTasks(taskList.toArray())
    }
  }, [taskList])

  const deleteTask = useCallback((id: string) => {
    taskList.remove(id)
    setTasks(taskList.toArray())
  }, [taskList])

  const handleDragEnd = (result: DropResult) => {
    if (!result?.destination || !result?.draggableId) return

    try {
      const taskId = result.draggableId
      const node = taskList.getNode(taskId)
      if (!node) return

      const isMovingToDone = result.destination.droppableId === 'done'
      const isMovingToTodo = result.destination.droppableId === 'todo'

      if ((isMovingToDone && !node.completed) || (isMovingToTodo && node.completed)) {
        toggleTask(taskId)
      }

      const newOrder = nextOrderRef.current++
      taskList.updateOrder(taskId, newOrder)
      setTasks(taskList.toArray())
    } catch (error) {
      console.error('Error in drag and drop:', error)
    }
  }

  const generateNewTask = async (): Promise<TaskNode | null> => {
    try {
      const prompt = "Give me task that will distract me from my current task and note that my interest is Overwatch\"\nKeep it short i.e <100 characters Respond with just the task and nothing else\nIf the task can be \"played\" and can be associated with a multiplayer competitive game, accompany it with the action of \"climb Solo Queue\" or ranked\nHave the tasks be as interactive and distracting like playing  or doing something actively\nException: Watching a recently released movie or Arcane";
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      return {
        id: generateTaskId(text, Date.now()),
        text,
        completed: false,
        createdAt: new Date(),
        order: nextOrderRef.current++,
        prev: null,
        next: null,
      };
    } catch (error) {
      console.error('Error generating task:', error);
      const fallbackTasks = [
        "Take a 5-minute stretching break",
        "Clean your desk space",
        "Write down 3 goals for today"
      ];
      return {
        id: generateTaskId("fallback", Date.now()),
        text: fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)],
        completed: false,
        createdAt: new Date(),
        order: nextOrderRef.current++,
        
        prev: null,
        next: null,
      };
    }
  };

  const handleFreetimeTaskComplete = async (id: string) => {
    setFreetimeTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));

    const newTask = await generateNewTask();
    if (newTask) {
      setFreetimeTasks(prev => [
        ...prev.filter(task => !task.completed && task.id !== id),
        newTask
      ]);
    }
  };

  useEffect(() => {
    const initializeFreetimeTasks = async () => {
      const tasks = await Promise.all([
        generateNewTask(),
        generateNewTask(),
        generateNewTask()
      ]);
      setFreetimeTasks(tasks.filter((t): t is TaskNode => t !== null));
    };

    if (settings.tryHardLevel === 'low') {
      initializeFreetimeTasks();
    }
  }, [settings.tryHardLevel]);

  const todoTasks = tasks.filter(task => !task.completed)
  const doneTasks = tasks.filter(task => task.completed)

  const chartData = [
    { name: 'To Do', value: todoTasks.length, color: COLORS[0] },
    { name: 'Completed', value: doneTasks.filter(t => 
      new Date(t.createdAt).toDateString() === new Date().toDateString()
    ).length, color: COLORS[2] },
  ]

  const renderDraggableTask = useCallback((task: TaskNode, index: number) => (
    <TaskItem 
      key={task.id}  
      task={task} 
      index={index}
      toggleTask={toggleTask}
      deleteTask={deleteTask}
    />
  ), [toggleTask, deleteTask])

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div ref={containerRef} className="flex h-full flex-col p-4 relative">
          <Curtain 
            containerHeight={containerHeight} 
            onToggle={setIsCurtainOpen}
          />
          <MotionCard 
            className="flex-grow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isCurtainOpen ? 0 : 1, 
              scale: isCurtainOpen ? 0.95 : 1,
              filter: isCurtainOpen ? 'blur(5px)' : 'none'
            }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Tasks</CardTitle>
                <Badge variant="secondary" className="animate-in fade-in">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTask()
                    }
                  }}
                  className="flex-grow"
                />
                <Button 
                  onClick={addTask} 
                  size="icon"
                  className="transition-all hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* To Do List */}
                <div className="rounded-lg border bg-background/50 p-4 transition-colors">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">To Do</h3>
                    <Badge variant="secondary">{todoTasks.length}</Badge>
                  </div>
                  <Droppable droppableId="todo">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "transition-colors",
                          snapshot.isDraggingOver && "bg-accent/10 border-accent"
                        )}
                      >
                        <ScrollArea className="h-[calc(100vh-500px)]">
                          <AnimatePresence mode="popLayout">
                            {todoTasks.map((task, index) => renderDraggableTask(task, index))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </ScrollArea>
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Conditional rendering of Completed or Freetime board */}
                {settings.tryHardLevel === 'low' ? (
                  <FreetimeBoard 
                    tasks={freetimeTasks} 
                    onComplete={handleFreetimeTaskComplete}
                  />
                ) : (
                  <div className="rounded-lg border bg-background/50 p-4 transition-colors">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Completed</h3>
                      <Badge variant="secondary">{doneTasks.length}</Badge>
                    </div>
                    <Droppable droppableId="done">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "transition-colors",
                            snapshot.isDraggingOver && "bg-accent/10 border-accent"
                          )}
                        >
                          <ScrollArea className="h-[calc(100vh-500px)]">
                            <AnimatePresence mode="popLayout">
                              {doneTasks.map((task, index) => renderDraggableTask(task, index))}
                            </AnimatePresence>
                            {provided.placeholder}
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={() => setIsChartsVisible(!isChartsVisible)}
                >
                  {isChartsVisible ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
                <AnimatePresence>
                  {isChartsVisible && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <Carousel className="w-full">
                            <CarouselContent>
                                <CarouselItem>
                                  <TaskProgressChart data={chartData} />
                                </CarouselItem>
                                  <CarouselItem>
                                    <TaskDistributionChart data={chartData} />
                                  </CarouselItem>
                                </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </DragDropContext>
    </ErrorBoundary>
  )
}
