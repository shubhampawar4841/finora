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
          <span className="text-lg font-medium">Employee targets</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{totalPercentage}%</span>
            <span className={`text-sm flex items-center ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                {percentageChange >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-scroll relative">
          {data.map((employee, index) => (
            <div key={index} className="space-y-2">
              <div className="relative h-8 w-full bg-gray-200 rounded-md overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-md"
                  style={{
                    width: `${(employee.value / employee.max) * 100}%`,
                    backgroundColor: colors.primary[500]
                  }}
                />
                <span
                  className="absolute top-0 right-0 flex items-center h-full px-2 text-sm font-medium"
                  style={{
                    color: (employee.value / employee.max) * 100 >= 90 ? "white" : colors.primary[900]
                  }}
                >
                  {employee.value}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>{employee.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </CardContent>
    </Card>
  )
}