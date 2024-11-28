import { Task } from '@/types/task'

export class TaskNode implements Task {
  prev: TaskNode | null = null
  next: TaskNode | null = null

  constructor(
    public id: string,
    public text: string,
    public completed: boolean,
    public createdAt: Date,
    public order: number
  ) {}
}

export class TaskList {
  private head: TaskNode | null = null
  private tail: TaskNode | null = null
  private nodeMap: Map<string, TaskNode> = new Map()

  insert(task: Task) {
    const newNode = new TaskNode(
      task.id,
      task.text,
      task.completed,
      task.createdAt,
      task.order
    )

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      let current: TaskNode | null = this.head
      while (current && current.order < newNode.order) {
        current = current.next
      }

      if (!current) {
        // Insert at end
        newNode.prev = this.tail
        this.tail!.next = newNode
        this.tail = newNode
      } else if (current === this.head) {
        // Insert at beginning
        newNode.next = this.head
        this.head.prev = newNode
        this.head = newNode
      } else {
        // Insert in middle
        newNode.prev = current.prev
        newNode.next = current
        current.prev!.next = newNode
        current.prev = newNode
      }
    }

    this.nodeMap.set(task.id, newNode)
  }

  remove(id: string) {
    const node = this.nodeMap.get(id)
    if (!node) return

    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }

    this.nodeMap.delete(id)
  }

  getNode(id: string) {
    return this.nodeMap.get(id) || null
  }

  toArray() {
    const result: TaskNode[] = []
    let current = this.head
    while (current) {
      result.push(current)
      current = current.next
    }
    return result
  }

  updateOrder(id: string, newOrder: number) {
    const node = this.nodeMap.get(id)
    if (!node) return

    this.remove(id)
    node.order = newOrder
    this.insert(node)
  }
}

