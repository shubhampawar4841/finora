"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { colors } from "@/styles/colors"

interface TradeAccuracyChartProps {
  percentage: number
  completedTrades: number
  percentageChange: number
}

export function TradeAccuracyChart({ percentage, completedTrades, percentageChange }: TradeAccuracyChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Trade accuracy</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className={`text-sm ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] w-[200px] mx-auto">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke={colors.gray[200]} strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.primary[500]}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.83} ${283 - percentage * 2.83}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
            <span className="text-sm text-gray-500">{completedTrades} completed trades</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

