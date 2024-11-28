'use client'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import React, { useCallback } from 'react'
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

const COLORS = [
  '#ff6b6b',       // destructive - soft red
  '#ffd93d',       // warning - bright yellow
  '#4ade80',       // success - vibrant green
]

const MotionCard = motion.create(Card)

const RightSection = () => {
  const [taskList] = React.useState(() => new TaskList())
  const [tasks, setTasks] = React.useState<TaskNode[]>([])
  const [newTask, setNewTask] = React.useState('')
  const nextOrderRef = React.useRef(0)
  const [isChartsVisible, setIsChartsVisible] = React.useState(true)
  const [isCurtainOpen, setIsCurtainOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = React.useState(0)

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

          <DragDropContext onDragEnd={handleDragEnd}>
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

              {/* Completed List */}
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
            </div>
          </DragDropContext>

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
  )
}

export default RightSection
