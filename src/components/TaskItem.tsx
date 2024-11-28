import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, GripVertical } from 'lucide-react'
import { cn } from "@/lib/utils"
import { TaskNode } from '@/utils/TaskListDLL'

interface TaskItemProps {
  task: TaskNode
  index: number
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, toggleTask, deleteTask }) => (
  <Draggable 
    key={`task-${task.id}`} 
    draggableId={task.id} 
    index={index}
  >
    {(provided, snapshot) => (
      <motion.div
        initial={false}
        animate={{
          scale: snapshot.isDragging ? 1.02 : 1,
          boxShadow: snapshot.isDragging ? "0 5px 20px rgba(0,0,0,0.1)" : "none",
          zIndex: snapshot.isDragging ? 50 : 1
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        style={{
          ...provided.draggableProps.style,
          position: snapshot.isDragging ? 'relative' : 'static'
        }}
        className={cn(
          "mb-2 flex items-center rounded-md border bg-card p-3 transition-colors relative group",
          snapshot.isDragging && "bg-accent/50 border-accent shadow-xl",
          task.completed && "bg-muted/50"
        )}
      >
        <div
          {...provided.dragHandleProps}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-3 pl-6 flex-1">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex flex-col min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-sm font-medium leading-none truncate peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.text}
            </label>
            <p className="text-xs text-muted-foreground truncate">
              {task.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            deleteTask(task.id)
          }}
          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>
    )}
  </Draggable>
)

export default TaskItem
