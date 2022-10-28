import { Card, Title, Text, LineChart, TabList, Tab } from '@tremor/react'

import { useEffect, useState } from 'react'
import { startOfYear, subDays } from 'date-fns'
import { trpc } from '@/lib/trpc'

const dataFormatter = (number: number) => {
  return number.toString()
}

export default function LineChartTabs() {
  const [selectedPeriod, setSelectedPeriod] = useState('1W')

  const [currentStartDate, setCurrentStartDate] = useState(new Date())
  const [currentEndDate, setCurrentEndDate] = useState(new Date())

  const {
    data: currMisc,
    refetch: refetchCurrMisc,
    isLoading: currMiscIsLoading,
  } = trpc.useQuery([
    'misc.get-range',
    {
      startDate: subDays(currentStartDate, 365),
      endDate: currentEndDate,
    },
  ])

  const getDate = (date: string) => {
    const [day, month, year] = date.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const filterData = (startDate: Date, endDate: Date) =>
    currMisc?.filter((item: any) => {
      const currentDate = getDate(item.date)
      return currentDate >= startDate && currentDate <= endDate
    })

  const getFilteredData = (period: string) => {
    const lastAvailableDate = getDate(currMisc[currMisc.length - 1].date)
    switch (period) {
      case '1W': {
        const periodStartDate = subDays(lastAvailableDate, 7)

        const x = filterData(periodStartDate, lastAvailableDate)
        return x
      }
      case '1M': {
        const periodStartDate = subDays(lastAvailableDate, 30)
        return filterData(periodStartDate, lastAvailableDate)
      }
      case '1Q': {
        const periodStartDate = subDays(lastAvailableDate, 90)
        return filterData(periodStartDate, lastAvailableDate)
      }
      case '6M': {
        const periodStartDate = subDays(lastAvailableDate, 180)
        return filterData(periodStartDate, lastAvailableDate)
      }
      case 'YTD': {
        const periodStartDate = startOfYear(lastAvailableDate)
        return filterData(periodStartDate, lastAvailableDate)
      }
      case '1Y': {
        const periodStartDate = subDays(lastAvailableDate, 365)
        return filterData(periodStartDate, lastAvailableDate)
      }
      default:
        return currMisc
    }
  }

  return (
    <Card>
      <Title>Weight</Title>
      <Text>Daily share price of a fictive company</Text>
      <TabList
        defaultValue={selectedPeriod}
        handleSelect={(value) => setSelectedPeriod(value)}
        marginTop="mt-10"
      >
        <Tab value="1W" text="1W" />
        <Tab value="1M" text="1M" />
        <Tab value="1Q" text="1Q" />
        <Tab value="6M" text="6M" />
        <Tab value="YTD" text="YTD" />
        <Tab value="1Y" text="1Y" />
      </TabList>
      {currMiscIsLoading ? (
        <div>Loading...</div>
      ) : (
        <LineChart
          data={getFilteredData(selectedPeriod)!}
          dataKey="date"
          categories={['weight']}
          colors={['blue']}
          valueFormatter={dataFormatter}
          showLegend={true}
          yAxisWidth="w-12"
          height="h-80"
          marginTop="mt-8"
        />
      )}
    </Card>
  )
}
