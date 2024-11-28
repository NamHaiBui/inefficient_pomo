import React from 'react'

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number }[]
}

interface LegendProps {
  payload?: { value: string; color: string }[]
}

export const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    )
  }
  return null
}

export const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}
