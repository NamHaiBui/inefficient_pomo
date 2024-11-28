import React from 'react'
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { ChartDataItem } from '@/hooks/useTaskList'
import { CustomTooltip, CustomLegend } from '@/components/ChartComponents'

interface TaskDistributionChartProps {
  data: ChartDataItem[]
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ data }) => (
  <div className="p-4">
    <h4 className="mb-4 text-sm font-medium">Task Distribution</h4>
    <div className="flex h-[200px] w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

export default TaskDistributionChart
