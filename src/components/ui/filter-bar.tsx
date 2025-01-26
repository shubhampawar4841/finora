"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useFilter } from "@/contexts/filter-context"

export function FilterBar() {
  const { dateRange, setDateRange, comparisonPeriod, setComparisonPeriod } = useFilter()

  return (
    <div className="flex items-center gap-4">
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <Select value={comparisonPeriod} onValueChange={(value: any) => setComparisonPeriod(value)}>
        <SelectTrigger className="w-[360px]">
          <SelectValue placeholder="Compare with" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_week">Last week</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="last_quarter">Last quarter</SelectItem>
          <SelectItem value="last_year">Last year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

