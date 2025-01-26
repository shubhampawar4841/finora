"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { colors } from "@/styles/colors"

interface RevenueChartProps {
  data: {
    date: string
    value: number
  }[]
  total: number
  percentageChange: number
}

export function RevenueChart({ data, total, percentageChange }: RevenueChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Revenue generated</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{total}</span>
            <span className={`text-sm ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" stroke={colors.gray[400]} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke={colors.gray[400]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={colors.primary[500]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

