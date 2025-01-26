"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { colors } from "@/styles/colors"

interface EmployeeTarget {
  name: string
  value: number
  max: number
}

interface EmployeeTargetsChartProps {
  data: EmployeeTarget[]
  totalPercentage: number
  percentageChange: number
}

export function EmployeeTargetsChart({ data, totalPercentage, percentageChange }: EmployeeTargetsChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Employee targets</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{totalPercentage}%</span>
            <span className={`text-sm ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((employee, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{employee.name}</span>
                <span>{employee.value}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${(employee.value / employee.max) * 100}%`,
                    backgroundColor: colors.primary[500],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

