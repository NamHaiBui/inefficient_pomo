import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { ChartDataItem } from '@/hooks/useTaskList'
import { CustomTooltip, CustomLegend } from '@/components/ChartComponents'

interface TaskProgressChartProps {
  data: ChartDataItem[]
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ data }) => (
  <div className="p-4">
    <h4 className="mb-4 text-sm font-medium">Task Progress</h4>
    <div className="flex h-[200px] w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)

export default TaskProgressChart
