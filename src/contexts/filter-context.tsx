"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DateRange } from "react-day-picker"
import { addDays, subDays, startOfDay } from "date-fns"

type ComparisonPeriod = "last_week" | "last_month" | "last_quarter" | "last_year"

interface FilterContextType {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  comparisonPeriod: ComparisonPeriod
  setComparisonPeriod: (period: ComparisonPeriod) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(startOfDay(new Date()), 7),
    to: startOfDay(new Date()),
  })
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>("last_month")

  return (
    <FilterContext.Provider
      value={{
        dateRange,
        setDateRange,
        comparisonPeriod,
        setComparisonPeriod,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}

