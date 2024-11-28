export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  order: number
}

export interface ChartDataItem {
  name: string
  value: number
  color: string
}
