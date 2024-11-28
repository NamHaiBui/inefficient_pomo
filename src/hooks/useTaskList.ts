import { useState, useRef, useEffect, useCallback } from 'react'
import { TaskList, TaskNode } from '@/utils/TaskListDLL'
import { ChartDataItem } from '@/types/task'
import { DropResult } from '@hello-pangea/dnd'
import generateTaskId from '@/utils/id_generator'

export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  destructive: 'hsl(var(--destructive))',
  warning: 'hsl(var(--warning))',
  success: 'hsl(var(--success))',
} as const

export const useTaskList = () => {
  const [taskList] = useState(() => new TaskList())
  const [tasks, setTasks] = useState<TaskNode[]>([])
  const [newTask, setNewTask] = useState('')
  const nextOrderRef = useRef(0)

  useEffect(() => {
    setTasks(taskList.toArray())
  }, [taskList])

  const addTask = useCallback(() => {
    const trimmedTask = newTask?.trim()
    if (!trimmedTask) return

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

  const calculateChartData = useCallback((): ChartDataItem[] => {
    const todoTasks = tasks.filter(task => !task.completed)
    const doneTasks = tasks.filter(task => task.completed)
    
    return [
      { name: 'To Do', value: todoTasks.length, color: CHART_COLORS.primary },
      { name: 'In Progress', value: todoTasks.filter(t => t.order > 0).length, color: CHART_COLORS.destructive },
      { name: 'Completed Today', 
        value: doneTasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length, 
        color: CHART_COLORS.warning },
      { name: 'Completed Earlier', 
        value: doneTasks.filter(t => new Date(t.createdAt).toDateString() !== new Date().toDateString()).length, 
        color: CHART_COLORS.success }
    ]
  }, [tasks])

  return {
    tasks,
    todoTasks: tasks.filter(task => !task.completed),
    doneTasks: tasks.filter(task => task.completed),
    newTask,
    setNewTask,
    addTask,
    toggleTask,
    deleteTask,
    handleDragEnd,
    chartData: calculateChartData()
  }
}
export type { ChartDataItem }

